package com.idoc.auth.service;

import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.idoc.auth.constant.Role;
import com.idoc.auth.dto.external.ProfileRequest;
import com.idoc.auth.dto.response.AuthenticationResponse;
import com.idoc.auth.dto.response.TokenResponse;
import com.idoc.auth.entity.RoleEntity;
import com.idoc.auth.entity.UserEntity;
import com.idoc.auth.integration.ProfileClient;
import com.idoc.auth.mapper.UserMapper;
import com.idoc.auth.repository.LinkedAccountRepository;
import com.idoc.auth.repository.RoleRepository;
import com.idoc.auth.repository.TokenRepository;
import com.idoc.auth.repository.UserRepository;
import com.idoc.auth.security.jwt.JwtTokenProvider;
import com.idoc.auth.security.jwt.JwtTokenRequest;
import com.idoc.auth.security.model.AuthUser;
import com.idoc.auth.config.AppProperties;
import com.idoc.auth.security.service.GoogleIdentityService;
import com.idoc.auth.util.PasswordUtil;

import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

	private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

	private final AuthenticationManager authenticationManager;
	private final JwtTokenProvider jwtTokenProvider;
	private final UserRepository userRepository;
	private final UserMapper userMapper;
	private final TokenRepository tokenRepository;
	private final RoleRepository roleRepository;
	private final ProfileClient profileClient;
	private final LinkedAccountRepository linkedAccountRepository;
	private final GoogleIdentityService googleIdentityService;
	private final AppProperties appProperties;

	public AuthServiceImpl(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider,
			UserRepository userRepository, UserMapper userMapper, TokenRepository tokenRepository,
			RoleRepository roleRepository, ProfileClient profileClient,
			LinkedAccountRepository linkedAccountRepository, GoogleIdentityService googleIdentityService,
			AppProperties appProperties) {
		this.authenticationManager = authenticationManager;
		this.jwtTokenProvider = jwtTokenProvider;
		this.userRepository = userRepository;
		this.userMapper = userMapper;
		this.tokenRepository = tokenRepository;
		this.roleRepository = roleRepository;
		this.profileClient = profileClient;
		this.linkedAccountRepository = linkedAccountRepository;
		this.googleIdentityService = googleIdentityService;
		this.appProperties = appProperties;
	}

	@Override
	public AuthenticationResponse login(String identifier, String password) {
		try {
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(identifier, password));

			AuthUser authUser = (AuthUser) authentication.getPrincipal();
			UserEntity user = authUser.getUser();
			JwtTokenRequest request = new JwtTokenRequest(
					user.getId(),
					user.getUsername(),
					user.getEmail(),
					user.getRoles().stream().map(RoleEntity::getCode).toList(),
					user.getRoles().stream()
							.flatMap(role -> role.getPermissions().stream())
							.map(permission -> permission.getCode())
							.distinct()
							.toList());
			String accessToken = jwtTokenProvider.createToken(request,
					appProperties.getJwt().getExpiredDuration() * 1000);
			String refreshToken = jwtTokenProvider.createToken(request,
					appProperties.getJwt().getRefreshableDuration() * 1000);
			if (accessToken == null) {
				throw new IllegalStateException("Failed to generate token");
			}
			tokenRepository.saveSession(String.valueOf(user.getId()), refreshToken);
			TokenResponse token = new TokenResponse(
					accessToken,
					refreshToken,
					true,
					appProperties.getJwt().getExpiredDuration());
			return new AuthenticationResponse(token, userMapper.toResponse(user));
		} catch (AuthenticationException ex) {
			throw new IllegalArgumentException("Invalid username/email or password");
		}
	}

	@Override
	@Transactional
	public AuthenticationResponse loginWithGoogle(String idToken) {
		try {
			var payload = googleIdentityService.verify(idToken);
			String email = payload.getEmail();
			String providerId = payload.getSubject();
			String name = (String) payload.get("name");

			// Check Linked Account
			return linkedAccountRepository.findByProviderAndProviderId("GOOGLE", providerId)
					.map(linkedAccount -> generateResponse(linkedAccount.getUser()))
					.orElseGet(() -> {
						// Check if user exists by email
						UserEntity user = userRepository.findByEmail(email);
						if (user != null) {
							// Link account
							linkAccount(user, "GOOGLE", providerId);
							return generateResponse(user);
						} else {
							// Create new user
							String username = email;
							if (userRepository.existsByUsername(username)) {
								username = email.split("@")[0] + "_"
										+ java.util.UUID.randomUUID().toString().substring(0, 4);
							}

							String randomPassword = java.util.UUID.randomUUID().toString();
							String hashedPassword = PasswordUtil.hash(randomPassword);

							RoleEntity userRole = roleRepository.findByCode(Role.USER.getValue());
							if (userRole == null) {
								throw new IllegalArgumentException("Default user role not found");
							}

							user = userRepository.save(new UserEntity(
									username, hashedPassword, email, 1, Set.of(userRole)));

							linkAccount(user, "GOOGLE", providerId);
							AuthenticationResponse response = generateResponse(user);

							// Create backend profile
							ProfileRequest profile = new ProfileRequest(user.getId(),
									name != null ? name : "User " + user.getUsername());
							try {
								profileClient.create(profile, response.getToken().getAccessToken());
							} catch (Exception e) {
								logger.error("Failed to create profile for user {}: {}", user.getId(), e.getMessage());
							}
							return response;
						}
					});

		} catch (Exception e) {
			throw new IllegalArgumentException("Google login failed: " + e.getMessage());
		}
	}

	private void linkAccount(UserEntity user, String provider, String providerId) {
		com.idoc.auth.entity.LinkedAccountEntity linked = new com.idoc.auth.entity.LinkedAccountEntity();
		linked.setUser(user);
		linked.setProvider(provider);
		linked.setProviderId(providerId);
		linked.setLinkedAt(java.time.LocalDateTime.now());
		linkedAccountRepository.save(linked);
	}

	private AuthenticationResponse generateResponse(UserEntity user) {
		JwtTokenRequest request = new JwtTokenRequest(
				user.getId(),
				user.getUsername(),
				user.getEmail(),
				user.getRoles().stream().map(RoleEntity::getCode).toList(),
				user.getRoles().stream()
						.flatMap(role -> role.getPermissions().stream())
						.map(permission -> permission.getCode())
						.distinct()
						.toList());
		String accessToken = jwtTokenProvider.createToken(request, appProperties.getJwt().getExpiredDuration() * 1000);
		String refreshToken = jwtTokenProvider.createToken(request,
				appProperties.getJwt().getRefreshableDuration() * 1000);
		if (accessToken == null) {
			throw new IllegalStateException("Failed to generate token");
		}
		tokenRepository.saveSession(String.valueOf(user.getId()), refreshToken);
		TokenResponse token = new TokenResponse(
				accessToken,
				refreshToken,
				true,
				appProperties.getJwt().getExpiredDuration());
		return new AuthenticationResponse(token, userMapper.toResponse(user));
	}

	@Override
	@Transactional
	public AuthenticationResponse register(String email, String username, String password) {

		if (userRepository.existsByEmail(email)) {
			throw new IllegalArgumentException("Email already exists: " + email);
		}

		if (userRepository.existsByUsername(username)) {
			throw new IllegalArgumentException("Username already exists: " + username);
		}

		String hashedPassword = PasswordUtil.hash(password);
		RoleEntity userRole = roleRepository.findByCode(Role.USER.getValue());
		if (userRole == null) {
			throw new IllegalArgumentException("Default user role not found");
		}

		UserEntity user = userRepository.save(new UserEntity(
				username, hashedPassword, email, 1, Set.of(userRole)));

		JwtTokenRequest request = new JwtTokenRequest(
				user.getId(),
				user.getUsername(),
				user.getEmail(),
				user.getRoles().stream().map(RoleEntity::getCode).toList(),
				user.getRoles().stream()
						.flatMap(role -> role.getPermissions().stream())
						.map(permission -> permission.getCode())
						.distinct()
						.toList());
		String accessToken = jwtTokenProvider.createToken(request, appProperties.getJwt().getExpiredDuration() * 1000);
		String refreshToken = jwtTokenProvider.createToken(request,
				appProperties.getJwt().getRefreshableDuration() * 1000);
		if (accessToken == null) {
			throw new IllegalStateException("Failed to generate token");
		}
		tokenRepository.saveSession(String.valueOf(user.getId()), refreshToken);
		ProfileRequest profile = new ProfileRequest(user.getId(), "User " + user.getUsername());
		profileClient.create(profile, accessToken);
		TokenResponse token = new TokenResponse(
				accessToken,
				refreshToken,
				true,
				appProperties.getJwt().getExpiredDuration());
		return new AuthenticationResponse(token, userMapper.toResponse(user));
	}

	@Override
	@Transactional
	public AuthenticationResponse refresh(String refreshToken) {
		if (tokenRepository.isRefreshTokenBlacklisted(refreshToken)) {
			throw new IllegalArgumentException("Invalid refresh token");
		}
		DecodedJWT jwt = jwtTokenProvider.decodeToken(refreshToken);
		System.out.println("Decoded JWT: " + jwt);
		if (jwt == null) {
			throw new IllegalArgumentException("Token decoding failed");
		}
		String userId = jwt.getSubject();
		UserEntity user = userRepository.findById(Long.valueOf(userId)).orElse(null);
		if (user == null)
			throw new IllegalArgumentException("User not found");

		// Sinh access token mới
		JwtTokenRequest request = new JwtTokenRequest(
				user.getId(),
				user.getUsername(),
				user.getEmail(),
				user.getRoles().stream().map(RoleEntity::getCode).toList(),
				user.getRoles().stream()
						.flatMap(role -> role.getPermissions().stream())
						.map(permission -> permission.getCode())
						.distinct()
						.toList());
		String accessToken = jwtTokenProvider.createToken(request, appProperties.getJwt().getExpiredDuration() * 1000);
		if (accessToken == null) {
			throw new IllegalStateException("Failed to generate access token");
		}
		tokenRepository.saveSession(String.valueOf(user.getId()), refreshToken);
		TokenResponse token = new TokenResponse(
				accessToken,
				refreshToken,
				true,
				appProperties.getJwt().getExpiredDuration());
		return new AuthenticationResponse(token, userMapper.toResponse(user));
	}

	@Override
	public void logout(String accessToken) {
		DecodedJWT jwt = jwtTokenProvider.decodeToken(accessToken);
		if (jwt != null) {
			String jti = jwt.getId();
			long expiration = jwt.getExpiresAt().getTime();
			long now = System.currentTimeMillis();
			long ttl = expiration - now;
			if (ttl > 0) {
				tokenRepository.revokeToken(jti, ttl);
			}
			// Remove refresh token by userId
			String userId = jwt.getSubject();
			tokenRepository.removeSession(userId);
		}
	}
}
