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

import com.idoc.auth.dto.request.LoginRequest;
import com.idoc.auth.dto.request.RegisterRequest;
import com.idoc.auth.dto.response.AuthenticationResponse;
import com.idoc.auth.dto.response.UserResponse;
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
		AuthenticationResponse response = authService.login(request.getIdentifier(), request.getPassword());
		if (response == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
		}
		return ResponseUtil.authentication("Login successful", response, null);
	}

	@PostMapping("/register")
	public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
		AuthenticationResponse response = authService.register(request.getEmail(), request.getUsername(),
				request.getPassword());
		if (response == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration failed");
		}
		return ResponseUtil.authentication("Registration successful", response, null);
	}

	@GetMapping("/verify")
	public ResponseEntity<Map<String, Object>> verify() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == null
				|| authentication.getPrincipal().equals("anonymousUser")) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
		}
		JwtTokenRequest principal;
		try {
			principal = (JwtTokenRequest) authentication.getPrincipal();
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Principal is not a valid JwtTokenRequest: " + e.getMessage());
		}
		UserResponse user = userService.findById(principal.getUserId());
		if (user == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No user found with userId: " + principal.getUserId());
		}
		return ResponseUtil.user("Token is valid", user);
	}

	@PostMapping("/refresh")
	public ResponseEntity<Map<String, Object>> refresh(@RequestBody Map<String, String> body) {
		AuthenticationResponse response = authService.refresh(body.get("refreshToken"));
		if (response == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
		}
		return ResponseUtil.success("Token refreshed", response);
	}

	@PostMapping("/logout")
	public ResponseEntity<Map<String, Object>> logout() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		JwtTokenRequest principal = (JwtTokenRequest) authentication.getPrincipal();
		authService.logout(String.valueOf(principal.getUserId()));
		return ResponseUtil.success("Logout successful", null);
	}

	@PatchMapping("/update")
	public ResponseEntity<Map<String, Object>> update(@RequestBody Map<String, Object> request) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		JwtTokenRequest principal = (JwtTokenRequest) authentication.getPrincipal();
		UserResponse data = userService.partial(principal.getUserId(), request);
		if (data == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Update failed");
		}
		return ResponseUtil.success("User updated successfully", data);
	}
}
