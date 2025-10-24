package com.idoc.auth.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.idoc.auth.model.User;
import com.idoc.auth.service.UserService;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserService userService;

	@GetMapping
	public ResponseEntity<Map<String, Object>> getAllUsers() {
		List<User> data = userService.findAllUser();
		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");
		response.put("message", "Users retrieved successfully");
		response.put("data", data);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
		User data = userService.findUserById(id);
		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");
		response.put("message", "User retrieved successfully");
		response.put("data", data);
		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<Map<String, Object>> searchUsers(@RequestParam Map<String, String> params) {
		Map<String, Object> filter = new HashMap<>();
		params.forEach((key, value) -> {
			if (value != null && !value.isEmpty()) {
				filter.put(key, value);
			}
		});
		List<User> data = userService.search(filter);
		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");
		response.put("message", "Users searched successfully");
		response.put("data", data);
		return ResponseEntity.ok(response);
	}

	@PostMapping
	public ResponseEntity<Map<String, Object>> createUser(@RequestBody User request) {
		User data = userService.createUser(request);
		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");
		response.put("message", "User created successfully");
		response.put("data", data);
		return ResponseEntity.ok(response);
	}

	@PatchMapping("/{id}")
	public ResponseEntity<Map<String, Object>> updateUser(@PathVariable Long id,
			@RequestBody Map<String, Object> request) {
		User data = userService.partialUpdateUser(id, request);
		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");
		response.put("message", "User updated successfully");
		response.put("data", data);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
		userService.deleteUserById(id);
		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");
		response.put("message", "User deleted successfully");
		return ResponseEntity.ok(response);
	}
}
