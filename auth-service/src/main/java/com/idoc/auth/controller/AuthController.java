package com.idoc.auth.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.idoc.auth.dto.LoginRequest;
import com.idoc.auth.dto.RegisterRequest;
import com.idoc.auth.dto.UserDto;
import com.idoc.auth.service.AuthService;
import com.idoc.auth.util.ResponseUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthService authService;

	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
		String token = authService.login(request.getIdentifier(), request.getPassword());
		if (token == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
		}
		return ResponseUtil.buildSuccessResponse("Login successful", token);
	}

	@PostMapping("/register")
	public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
		String token = authService.register(request.getEmail(), request.getUsername(), request.getPassword());
		if (token == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration failed");
		}
		return ResponseUtil.buildCreatedResponse("Registration successful", token);
	}

	@PostMapping("/validate")
	public ResponseEntity<Map<String, Object>> validateToken(@RequestBody Map<String, String> request) {
		String token = request.get("token");
		if (token == null || token.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token is required");
		}
		try {
			UserDto user = authService.validateToken(token);
			return ResponseUtil.buildSuccessResponse("Token is valid", user);
		} catch (IllegalArgumentException ex) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
		}
	}
}
