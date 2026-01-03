package com.idoc.auth.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

import com.idoc.auth.dto.request.PermissionRequest;
import com.idoc.auth.dto.response.ApiResponse;
import com.idoc.auth.dto.response.PermissionResponse;
import com.idoc.auth.service.PermissionService;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {

  @Autowired
  private PermissionService permissionService;

  @GetMapping
  @PreAuthorize("hasAuthority('permission.view')")
  public ResponseEntity<ApiResponse<List<PermissionResponse>>> getList(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int limit,
      @RequestParam Map<String, Object> filter) {
    filter.remove("page");
    filter.remove("limit");
    Page<PermissionResponse> data = permissionService.find(PageRequest.of(page > 0 ? page - 1 : 0, limit), filter);
    if (data.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No permissions found");
    }
    return ResponseEntity.ok(ApiResponse.paged(data, "Permissions retrieved successfully"));
  }

  @GetMapping("/all")
  @PreAuthorize("hasAuthority('permission.view')")
  public ResponseEntity<ApiResponse<List<PermissionResponse>>> getAll() {
    List<PermissionResponse> data = permissionService.findAll();
    if (data.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No permissions found");
    }
    return ResponseEntity.ok(ApiResponse.success(data, "Permissions retrieved successfully"));
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAuthority('permission.view')")
  public ResponseEntity<ApiResponse<PermissionResponse>> getById(@PathVariable Long id) {
    if (id == null || id <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid permission ID");
    }
    PermissionResponse data = permissionService.findById(id);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission not found with id: " + id);
    }
    return ResponseEntity.ok(ApiResponse.success(data, "Permission retrieved successfully"));
  }

  @GetMapping("/by-role")
  @PreAuthorize("hasAuthority('permission.view')")
  public ResponseEntity<ApiResponse<List<PermissionResponse>>> getByRoleId(@RequestParam Long roleId) {
    if (roleId == null || roleId <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role ID");
    }
    List<PermissionResponse> data = permissionService.findByRoleId(roleId);
    if (data.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No permissions found for role ID: " + roleId);
    }
    return ResponseEntity.ok(ApiResponse.success(data, "Permissions retrieved successfully"));
  }

  @GetMapping("/by-code")
  @PreAuthorize("hasAuthority('permission.view')")
  public ResponseEntity<ApiResponse<PermissionResponse>> getByCode(@RequestParam String code) {
    if (code == null || code.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Permission code cannot be null or empty");
    }
    PermissionResponse data = permissionService.findByCode(code);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission not found with code: " + code);
    }
    return ResponseEntity.ok(ApiResponse.success(data, "Permission retrieved successfully"));
  }

  @PostMapping
  @PreAuthorize("hasAuthority('permission.edit')")
  public ResponseEntity<ApiResponse<PermissionResponse>> create(@RequestBody PermissionRequest request) {
    PermissionResponse data = permissionService.save(request);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to create permission");
    }
    return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(data, "Permission created successfully"));
  }

  @PatchMapping("/{id}")
  @PreAuthorize("hasAuthority('permission.edit')")
  public ResponseEntity<ApiResponse<PermissionResponse>> update(@PathVariable Long id,
      @RequestBody Map<String, Object> request) {
    if (id == null || id <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid permission ID");
    }
    PermissionResponse data = permissionService.partial(id, request);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission not found with id: " + id);
    }
    return ResponseEntity.ok(ApiResponse.updated(data));
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAuthority('permission.delete')")
  public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
    if (id == null || id <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid permission ID");
    }
    boolean deleted = permissionService.delete(id);
    if (!deleted) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission not found with id: " + id);
    }
    return ResponseEntity.ok(ApiResponse.deleted());
  }

}
