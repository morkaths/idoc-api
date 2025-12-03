package com.idoc.auth.controller;

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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.idoc.auth.dto.PermissionDto;
import com.idoc.auth.service.PermissionService;
import com.idoc.auth.util.ResponseUtil;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {

  @Autowired
  private PermissionService permissionService;

  @GetMapping
  public ResponseEntity<Map<String, Object>> getAll() {
    List<PermissionDto> data = permissionService.findAll();
    if (data.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No permissions found");
    }
    return ResponseUtil.success("Permissions retrieved successfully", data);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Map<String, Object>> getPermissionById(@PathVariable Long id) {
    if (id == null || id <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid permission ID");
    }
    PermissionDto data = permissionService.findById(id);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission not found with id: " + id);
    }
    return ResponseUtil.success("Permission retrieved successfully", data);
  }

  @GetMapping("/by-role")
  public ResponseEntity<Map<String, Object>> getByRoleId(@RequestParam Long roleId) {
    if (roleId == null || roleId <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role ID");
    }
    List<PermissionDto> data = permissionService.findByRoleId(roleId);
    if (data.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No permissions found for role ID: " + roleId);
    }
    return ResponseUtil.success("Permissions retrieved successfully", data);
  }

  @GetMapping("/by-code")
  public ResponseEntity<Map<String, Object>> getPermissionByCode(@RequestParam String code) {
    if (code == null || code.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Permission code cannot be null or empty");
    }
    PermissionDto data = permissionService.findByCode(code);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission not found with code: " + code);
    }
    return ResponseUtil.success("Permission retrieved successfully", data);
  }

  @PostMapping
  @PreAuthorize("hasAnyRole('admin', 'manager')")
  public ResponseEntity<Map<String, Object>> createPermission(@RequestBody PermissionDto permission) {
    PermissionDto data = permissionService.create(permission);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to create permission");
    }
    return ResponseUtil.created("Permission created successfully", data);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasAnyRole('admin', 'manager')")
  public ResponseEntity<Map<String, Object>> updatePermission(@PathVariable Long id,
      @RequestBody PermissionDto permission) {
    if (id == null || id <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role ID");
    }
    permission.setId(id);
    PermissionDto data = permissionService.update(permission);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission not found with id: " + permission.getId());
    }
    return ResponseUtil.updated("Permission updated successfully", data);
  }

  @PatchMapping("/{id}")
  @PreAuthorize("hasAnyRole('admin', 'manager')")
  public ResponseEntity<Map<String, Object>> partialUpdatePermission(@PathVariable Long id,
      @RequestBody Map<String, Object> updates) {
    if (id == null || id <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid permission ID");
    }
    PermissionDto data = permissionService.partialUpdate(id, updates);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission not found with id: " + id);
    }
    return ResponseUtil.updated("Permission partially updated successfully", data);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Map<String, Object>> deletePermission(@PathVariable Long id) {
    if (id == null || id <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid permission ID");
    }
    boolean deleted = permissionService.delete(id);
    if (!deleted) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission not found with id: " + id);
    }
    return ResponseUtil.deleted("Permission deleted successfully");
  }

}
