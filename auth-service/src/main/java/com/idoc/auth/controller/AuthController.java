package com.idoc.auth.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.idoc.auth.model.LoginRequest;
import com.idoc.auth.model.RegisterRequest;
import com.idoc.auth.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthService authService;

	
	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
		String token = authService.login(request.getIdentifier(), request.getPassword());
		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");
		response.put("message", "Login successful");
		response.put("token", token);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/register")
	public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
		String token = authService.register(request.getEmail(), request.getUsername(), request.getPassword());
		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");
		response.put("message", "Registration successful");
		response.put("token", token);
		return ResponseEntity.ok(response);
	}
}
