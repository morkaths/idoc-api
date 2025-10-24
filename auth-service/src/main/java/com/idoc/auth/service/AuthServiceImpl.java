package com.idoc.auth.service;

import java.util.Set;

import org.springframework.stereotype.Service;

import com.idoc.auth.constant.RoleConstants;
import com.idoc.auth.entity.RoleEntity;
import com.idoc.auth.entity.UserEntity;
import com.idoc.auth.repository.RoleRepository;
import com.idoc.auth.repository.UserRepository;
import com.idoc.auth.security.jwt.JwtTokenProvider;
import com.idoc.auth.security.jwt.JwtTokenRequest;
import com.idoc.auth.util.PasswordUtil;

@Service
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final JwtTokenProvider jwtTokenProvider;

	public AuthServiceImpl(UserRepository userRepository, RoleRepository roleRepository,
			JwtTokenProvider jwtTokenProvider) {
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.jwtTokenProvider = jwtTokenProvider;
	}

	@Override
	public String login(String identifier, String password) {
		UserEntity user = userRepository.findByUsernameOrEmail(identifier, identifier);
		if (user == null || !PasswordUtil.matches(password, user.getPassword())) {
			throw new IllegalArgumentException("Invalid username/email or password");
		}

		String token = jwtTokenProvider.createToken(new JwtTokenRequest(
				user.getId(),
				user.getUsername(),
				user.getEmail(),
				user.getRoles().stream().map(RoleEntity::getCode).toList()));
		if (token == null) {
			throw new IllegalStateException("Failed to generate token");
		}
		return token;
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
		return token;
	}

	@Override
	public boolean validateToken(String token) {
		return jwtTokenProvider.isValidToken(token);
	}

	@Override
	public boolean changePassword(String email, String oldPassword, String newPassword) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean logout(String token) {
		// TODO Auto-generated method stub
		return false;
	}

}
