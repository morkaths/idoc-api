package com.idoc.auth.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.idoc.auth.dto.UserDto;
import com.idoc.auth.service.UserService;
import com.idoc.auth.util.ResponseUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserService userService;

	@GetMapping
	public ResponseEntity<Map<String, Object>> getAllUsers() {
		List<UserDto> data = userService.findAll();
		if (data.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No users found");
		}
		return ResponseUtil.success("Users retrieved successfully", data);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
		if (id == null || id <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid user ID");
		}
		UserDto data = userService.findById(id);
		if (data == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id);
		}
		return ResponseUtil.success("User retrieved successfully", data);
	}

	@GetMapping("/search")
	public ResponseEntity<Map<String, Object>> searchUsers(@RequestParam Map<String, String> params) {
		Map<String, Object> filter = new HashMap<>();
		params.forEach((key, value) -> {
			if (value != null && !value.isEmpty()) {
				filter.put(key, value);
			}
		});
		List<UserDto> data = userService.search(filter);
		if (data.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No users found matching the criteria");
		}
		return ResponseUtil.success("Users retrieved successfully", data);
	}

	@PostMapping
	@PreAuthorize("hasAuthority('user.edit')")
	public ResponseEntity<Map<String, Object>> createUser(@Valid @RequestBody UserDto request) {
		UserDto data = userService.create(request);
		if (data == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to create user");
		}
		return ResponseUtil.created("User created successfully", data);
	}

	@PatchMapping("/{id}")
	@PreAuthorize("hasRole('admin')")
	public ResponseEntity<Map<String, Object>> updateUser(@PathVariable Long id,
			@RequestBody Map<String, Object> request) {
		if (id == null || id <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid user ID");
		}
		UserDto data = userService.partialUpdate(id, request);
		if (data == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id);
		}
		return ResponseUtil.updated("User updated successfully", data);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('admin')")
	public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
		if (id == null || id <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid user ID");
		}
		boolean deleted = userService.delete(id);
		if (!deleted) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id);
		}
		return ResponseUtil.deleted("User deleted successfully");
	}
}
