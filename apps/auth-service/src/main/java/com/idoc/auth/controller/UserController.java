package com.idoc.auth.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import com.idoc.auth.dto.request.UserRequest;
import com.idoc.auth.dto.response.ApiResponse;
import com.idoc.auth.dto.response.UserResponse;
import com.idoc.auth.security.jwt.JwtTokenRequest;
import com.idoc.auth.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping
	public ResponseEntity<ApiResponse<List<UserResponse>>> getList(
			@RequestParam(defaultValue = "1") int page,
			@RequestParam(defaultValue = "10") int limit,
			@RequestParam Map<String, Object> filter) {
		filter.remove("page");
		filter.remove("limit");
		Page<UserResponse> data = userService.find(PageRequest.of(page > 0 ? page - 1 : 0, limit), filter);
		if (data.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No users found");
		}
		return ResponseEntity.ok(ApiResponse.paged(data, "Users retrieved successfully"));
	}

	@GetMapping("/all")
	public ResponseEntity<ApiResponse<List<UserResponse>>> getAll() {
		List<UserResponse> data = userService.findAll();
		if (data.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No users found");
		}
		return ResponseEntity.ok(ApiResponse.success(data, "Users retrieved successfully"));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<UserResponse>> getById(@PathVariable Long id) {
		if (id == null || id <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid user ID");
		}
		UserResponse data = userService.findById(id);
		if (data == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id);
		}
		return ResponseEntity.ok(ApiResponse.success(data, "User retrieved successfully"));
	}

	@PostMapping("/batch")
	public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersByIds(@RequestBody Map<String, List<Long>> body) {
		List<Long> ids = body.get("ids");
		if (ids == null || ids.isEmpty()) {
			return ResponseEntity.ok(ApiResponse.success(List.of(), "Lấy danh sách người dùng thành công"));
		}
		List<UserResponse> data = userService.findAllByIds(ids);
		return ResponseEntity.ok(ApiResponse.success(data, "Lấy danh sách người dùng thành công"));
	}

	@GetMapping("/search")
	public ResponseEntity<ApiResponse<List<UserResponse>>> search(@RequestParam Map<String, String> params) {
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
		return ResponseEntity.ok(ApiResponse.success(data, "Users retrieved successfully"));
	}

	@PostMapping
	@PreAuthorize("hasAuthority('user.edit')")
	public ResponseEntity<ApiResponse<UserResponse>> create(@Valid @RequestBody UserRequest request) {
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
		return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(data, "User created successfully"));
	}

	@PatchMapping("/{id}")
	@PreAuthorize("hasAuthority('user.edit')")
	public ResponseEntity<ApiResponse<UserResponse>> update(@PathVariable Long id,
			@RequestBody Map<String, Object> request) {
		if (id == null || id <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid user ID");
		}
		UserResponse data = userService.partial(id, request);
		if (data == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id);
		}
		return ResponseEntity.ok(ApiResponse.updated(data));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasAuthority('user.delete')")
	public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
		if (id == null || id <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid user ID");
		}
		boolean deleted = userService.delete(id);
		if (!deleted) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id);
		}
		return ResponseEntity.ok(ApiResponse.deleted());
	}

	@PostMapping("/import")
	@PreAuthorize("hasAuthority('user.edit')")
	public ResponseEntity<ApiResponse<String>> importExcel(@RequestParam("file") MultipartFile file) {
		userService.importExcel(file);
		return ResponseEntity.ok(ApiResponse.success("Users imported successfully"));
	}

	@GetMapping("/export")
	@PreAuthorize("hasAuthority('user.view')")
	public ResponseEntity<Resource> exportExcel() {
		String timestamp = LocalDateTime.now()
				.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
		String filename = "Users_" + timestamp + ".xlsx";
		InputStreamResource file = new InputStreamResource(userService.exportExcel());

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
				.contentType(
						MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
				.body(file);
	}
}
