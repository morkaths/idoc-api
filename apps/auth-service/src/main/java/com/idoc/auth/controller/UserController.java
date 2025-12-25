package com.idoc.auth.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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

import com.idoc.auth.dto.request.UserRequest;
import com.idoc.auth.dto.response.UserResponse;
import com.idoc.auth.security.jwt.JwtTokenRequest;
import com.idoc.auth.service.UserService;
import com.idoc.auth.util.ResponseUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserService userService;

	@GetMapping
	public ResponseEntity<Map<String, Object>> getList(
			@RequestParam(defaultValue = "1") int page,
			@RequestParam(defaultValue = "10") int limit,
			@RequestParam Map<String, Object> filter) {
		filter.remove("page");
		filter.remove("limit");
		var data = userService.getList(PageRequest.of(page > 0 ? page - 1 : 0, limit), filter);
		if (data.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No users found");
		}
		return ResponseUtil.paged("Users retrieved successfully", data);
	}

	@GetMapping("/all")
	public ResponseEntity<Map<String, Object>> getAll() {
		List<UserResponse> data = userService.getAll();
		if (data.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No users found");
		}
		return ResponseUtil.success("Users retrieved successfully", data);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
		if (id == null || id <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid user ID");
		}
		UserResponse data = userService.getById(id);
		if (data == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id);
		}
		return ResponseUtil.success("User retrieved successfully", data);
	}

	@GetMapping("/search")
	public ResponseEntity<Map<String, Object>> search(@RequestParam Map<String, String> params) {
		Map<String, Object> filter = new HashMap<>();
		params.forEach((key, value) -> {
			if (value != null && !value.isEmpty()) {
				filter.put(key, value);
			}
		});
		List<UserResponse> data = userService.search(filter);
		if (data.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No users found matching the criteria");
		}
		return ResponseUtil.success("Users retrieved successfully", data);
	}

	@PostMapping
	public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody UserRequest request) {
		JwtTokenRequest principal;
		try {
			principal = (JwtTokenRequest) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
					"Principal is not a valid JwtTokenRequest: " + e.getMessage());
		}
		UserResponse data = userService.create(request, principal.getUserId());
		if (data == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to create user");
		}
		return ResponseUtil.created("User created successfully", data);
	}

	@PatchMapping("/{id}")
	public ResponseEntity<Map<String, Object>> update(@PathVariable Long id,
			@RequestBody Map<String, Object> request) {
		if (id == null || id <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid user ID");
		}
		UserResponse data = userService.partial(id, request);
		if (data == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id);
		}
		return ResponseUtil.updated("User updated successfully", data);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
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
