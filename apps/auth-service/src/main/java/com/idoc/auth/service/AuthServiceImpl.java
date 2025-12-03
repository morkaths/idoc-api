package com.idoc.auth.service;

import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import com.idoc.auth.constant.RoleConstants;
import com.idoc.auth.dto.external.ProfileDto;
import com.idoc.auth.entity.RoleEntity;
import com.idoc.auth.entity.UserEntity;
import com.idoc.auth.integration.ProfileClient;
import com.idoc.auth.repository.RoleRepository;
import com.idoc.auth.repository.UserRepository;
import com.idoc.auth.security.jwt.JwtTokenProvider;
import com.idoc.auth.security.jwt.JwtTokenRequest;
import com.idoc.auth.security.model.AuthUser;
import com.idoc.auth.util.PasswordUtil;

@Service
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final ProfileClient profileClient;
	private final JwtTokenProvider jwtTokenProvider;
	private final AuthenticationManager authenticationManager;

	public AuthServiceImpl(UserRepository userRepository, RoleRepository roleRepository, ProfileClient profileClient,
			JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager) {
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.profileClient = profileClient;
		this.jwtTokenProvider = jwtTokenProvider;
		this.authenticationManager = authenticationManager;
	}

	@Override
	public String login(String identifier, String password) {
		try {
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(identifier, password));

			AuthUser authUser = (AuthUser) authentication.getPrincipal();
			UserEntity user = authUser.getUser();
			String token = jwtTokenProvider.createToken(new JwtTokenRequest(
					user.getId(),
					user.getUsername(),
					user.getEmail(),
					user.getRoles().stream().map(RoleEntity::getCode).toList()));
			if (token == null) {
				throw new IllegalStateException("Failed to generate token");
			}
			return token;
		} catch (AuthenticationException ex) {
			throw new IllegalArgumentException("Invalid username/email or password");
		}
	}

	@Override
	public String register(String email, String username, String password) {

		if (userRepository.existsByEmail(email)) {
			throw new IllegalArgumentException("Email already registered");
		}

		if (userRepository.existsByUsername(username)) {
			throw new IllegalArgumentException("Username already taken");
		}

		String hashedPassword = PasswordUtil.hash(password);
		RoleEntity userRole = roleRepository.findByName(RoleConstants.USER);
		if (userRole == null) {
			throw new IllegalArgumentException("Default user role not found");
		}

		UserEntity newUser = userRepository.save(new UserEntity(
				username, hashedPassword, email, 1, Set.of(userRole)));

		String token = jwtTokenProvider.createToken(new JwtTokenRequest(
				newUser.getId(),
				newUser.getUsername(),
				newUser.getEmail(),
				newUser.getRoles().stream().map(RoleEntity::getCode).toList()));
		if (token == null) {
			throw new IllegalStateException("Failed to generate token");
		}

		ProfileDto profile = new ProfileDto(
				newUser.getId(),
				"User " + newUser.getUsername(),
				null,
				null,
				null,
				null);
		profileClient.createProfile(profile, token);
		return token;
	}
}
