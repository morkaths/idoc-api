package com.idoc.auth.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
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

	@GetMapping("/me")
	public ResponseEntity<Map<String, Object>> verify(@RequestHeader("Authorization") String authHeader) {
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing or invalid Authorization header");
    }
    String token = authHeader.substring(7);
		try {
			UserDto user = authService.validateToken(token);
			return ResponseUtil.buildSuccessResponse("Token is valid", null, user);
		} catch (IllegalArgumentException ex) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
		}
	}
}
