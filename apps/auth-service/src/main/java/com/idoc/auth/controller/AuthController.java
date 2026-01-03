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
import com.idoc.auth.dto.response.ApiResponse;
import com.idoc.auth.dto.response.AuthenticationResponse;
import com.idoc.auth.dto.response.UserResponse;
import com.idoc.auth.security.jwt.JwtTokenRequest;
import com.idoc.auth.service.AuthService;
import com.idoc.auth.service.UserService;

import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthService authService;

	@Autowired
	private UserService userService;

	@PostMapping("/login")
	public ResponseEntity<ApiResponse<AuthenticationResponse>> login(@Valid @RequestBody LoginRequest request) {
		AuthenticationResponse response = authService.login(request.getIdentifier(), request.getPassword());
		if (response == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
		}
		return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
	}

	@PostMapping("/register")
	public ResponseEntity<ApiResponse<AuthenticationResponse>> register(@Valid @RequestBody RegisterRequest request) {
		AuthenticationResponse response = authService.register(request.getEmail(), request.getUsername(),
				request.getPassword());
		if (response == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration failed");
		}
		return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(response, "Registration successful"));
	}

	@GetMapping("/verify")
	public ResponseEntity<ApiResponse<UserResponse>> verify() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == null
				|| authentication.getPrincipal().equals("anonymousUser")) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
		}
		JwtTokenRequest principal;
		try {
			principal = (JwtTokenRequest) authentication.getPrincipal();
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
					"Principal is not a valid JwtTokenRequest: " + e.getMessage());
		}
		UserResponse user = userService.findById(principal.getUserId());
		if (user == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
					"No user found with userId: " + principal.getUserId());
		}
		return ResponseEntity.ok(ApiResponse.success(user, "Token is valid"));
	}

	@PostMapping("/refresh")
	public ResponseEntity<ApiResponse<AuthenticationResponse>> refresh(@RequestBody Map<String, String> body) {
		AuthenticationResponse response = authService.refresh(body.get("refreshToken"));
		if (response == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
		}
		return ResponseEntity.ok(ApiResponse.success(response, "Token refreshed"));
	}

	@PostMapping("/logout")
	public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request) {
		String token = request.getHeader("Authorization");
		if (token != null && token.startsWith("Bearer ")) {
			token = token.substring(7);
			authService.logout(token);
		}
		return ResponseEntity.ok(ApiResponse.success(null, "Logout successful"));
	}

	@PatchMapping("/update")
	public ResponseEntity<ApiResponse<UserResponse>> update(@RequestBody Map<String, Object> request) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		JwtTokenRequest principal = (JwtTokenRequest) authentication.getPrincipal();
		UserResponse data = userService.partial(principal.getUserId(), request);
		if (data == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Update failed");
		}
		return ResponseEntity.ok(ApiResponse.success(data, "User updated successfully"));
	}
}
