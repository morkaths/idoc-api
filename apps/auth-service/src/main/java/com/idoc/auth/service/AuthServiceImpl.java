package com.idoc.auth.service;

import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.idoc.auth.constant.Common;
import com.idoc.auth.constant.Role;
import com.idoc.auth.dto.external.ProfileRequest;
import com.idoc.auth.dto.response.AuthenticationResponse;
import com.idoc.auth.dto.response.TokenResponse;
import com.idoc.auth.entity.RoleEntity;
import com.idoc.auth.entity.UserEntity;
import com.idoc.auth.integration.ProfileClient;
import com.idoc.auth.mapper.UserMapper;
import com.idoc.auth.repository.RoleRepository;
import com.idoc.auth.repository.TokenRepository;
import com.idoc.auth.repository.UserRepository;
import com.idoc.auth.security.jwt.JwtTokenProvider;
import com.idoc.auth.security.jwt.JwtTokenRequest;
import com.idoc.auth.security.model.AuthUser;
import com.idoc.auth.util.PasswordUtil;

@Service
public class AuthServiceImpl implements AuthService {

	@Value("${spring.jwt.expired-duration}")
	private long accessTokenExpiration;

	@Value("${spring.jwt.refreshable-duration}")
	private long refreshTokenExpiration;

	private final AuthenticationManager authenticationManager;
	private final JwtTokenProvider jwtTokenProvider;
	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final ProfileClient profileClient;
	private final TokenRepository tokenRepository;
	private final UserMapper userMapper;

	public AuthServiceImpl(UserRepository userRepository, RoleRepository roleRepository, ProfileClient profileClient,
			JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager,
			TokenRepository tokenRepository, UserMapper userMapper) {
		this.authenticationManager = authenticationManager;
		this.jwtTokenProvider = jwtTokenProvider;
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.profileClient = profileClient;
		this.tokenRepository = tokenRepository;
		this.userMapper = userMapper;
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
					user.getRoles().stream().map(RoleEntity::getCode).toList());
			String accessToken = jwtTokenProvider.createToken(request, accessTokenExpiration * 1000);
			String refreshToken = jwtTokenProvider.createToken(request, refreshTokenExpiration * 1000);
			if (accessToken == null) {
				throw new IllegalStateException("Failed to generate token");
			}
			tokenRepository.storeToken(String.valueOf(user.getId()), accessToken, refreshToken);
			TokenResponse token = new TokenResponse(
					accessToken,
					refreshToken,
					true,
					accessTokenExpiration);
			return new AuthenticationResponse(token, userMapper.toDto(user));
		} catch (AuthenticationException ex) {
			throw new IllegalArgumentException("Invalid username/email or password");
		}
	}

	@Override
	public AuthenticationResponse register(String email, String username, String password) {

		if (userRepository.existsByEmail(email)) {
			throw new IllegalArgumentException("Email already registered");
		}

		if (userRepository.existsByUsername(username)) {
			throw new IllegalArgumentException("Username already taken");
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
				user.getRoles().stream().map(RoleEntity::getCode).toList());
		String accessToken = jwtTokenProvider.createToken(request, accessTokenExpiration * 1000);
		String refreshToken = jwtTokenProvider.createToken(request, refreshTokenExpiration * 1000);
		if (accessToken == null) {
			throw new IllegalStateException("Failed to generate token");
		}
		tokenRepository.storeToken(String.valueOf(user.getId()), accessToken, refreshToken);
		ProfileRequest profile = new ProfileRequest(
				user.getId(),
				"User " + user.getUsername(),
				null,
				null,
				null,
				null);
		profileClient.create(profile, accessToken);
		TokenResponse token = new TokenResponse(
				accessToken,
				refreshToken,
				true,
				accessTokenExpiration);
		return new AuthenticationResponse(token, userMapper.toDto(user));
	}

	@Override
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
				user.getRoles().stream().map(RoleEntity::getCode).toList());
		String accessToken = jwtTokenProvider.createToken(request, Common.EXPIRATION_TIME);
		if (accessToken == null) {
			throw new IllegalStateException("Failed to generate access token");
		}
		tokenRepository.storeToken(String.valueOf(user.getId()), accessToken, refreshToken);
		TokenResponse token = new TokenResponse(
				accessToken,
				refreshToken,
				true,
				accessTokenExpiration);
		return new AuthenticationResponse(token, userMapper.toDto(user));
	}

	@Override
	public void logout(String userId) {
		tokenRepository.removeAllToken(userId);
	}
}
