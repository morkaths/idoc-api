package com.idoc.auth.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.idoc.auth.dto.LoginRequest;
import com.idoc.auth.dto.RegisterRequest;
import com.idoc.auth.dto.UserDto;
import com.idoc.auth.security.jwt.JwtTokenRequest;
import com.idoc.auth.service.AuthService;
import com.idoc.auth.service.UserService;
import com.idoc.auth.util.ResponseUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthService authService;

	@Autowired
	private UserService userService;

	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
		String token = authService.login(request.getIdentifier(), request.getPassword());
		if (token == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
		}
		return ResponseUtil.success("Login successful", token);
	}

	@PostMapping("/register")
	public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
		String token = authService.register(request.getEmail(), request.getUsername(), request.getPassword());
		if (token == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration failed");
		}
		return ResponseUtil.created("Registration successful", token);
	}

	@GetMapping("/verify")
	public ResponseEntity<Map<String, Object>> verify() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		JwtTokenRequest principal = (JwtTokenRequest) authentication.getPrincipal();
		UserDto user = userService.findById(principal.getUserId());
		if (user == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
		}
		return ResponseUtil.user("Token is valid", user);
	}

	@PatchMapping("/update")
	public ResponseEntity<Map<String, Object>> update(@RequestBody Map<String, Object> request) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		JwtTokenRequest principal = (JwtTokenRequest) authentication.getPrincipal();
		UserDto data = userService.partialUpdate(principal.getUserId(), request);
		if (data == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Update failed");
		}
		return ResponseUtil.success("User updated successfully", data);
	}
}
