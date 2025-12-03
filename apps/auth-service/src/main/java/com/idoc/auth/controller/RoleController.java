package com.idoc.auth.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.idoc.auth.dto.RoleDto;
import com.idoc.auth.service.RoleService;
import com.idoc.auth.util.ResponseUtil;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

  @Autowired
  private RoleService roleService;

  @GetMapping
  public ResponseEntity<Map<String, Object>> getAllRoles() {
    List<RoleDto> data = roleService.findAll();
    if (data.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No roles found");
    }
    return ResponseUtil.success("Roles retrieved successfully", data);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Map<String, Object>> getRoleById(@PathVariable Long id) {
    if (id == null || id <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role ID");
    }
    RoleDto data = roleService.findById(id);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found with id: " + id);
    }
    return ResponseUtil.success("Role retrieved successfully", data);
  }

  @PostMapping
  @PreAuthorize("hasRole(T(com.idoc.auth.constant.RoleConstants).ADMIN)")
  public ResponseEntity<Map<String, Object>> createRole(@RequestBody RoleDto role) {
    RoleDto data = roleService.create(role);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to create role");
    }
    return ResponseUtil.created("Role created successfully", data);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasAnyRole('admin', 'manager')")
  public ResponseEntity<Map<String, Object>> updateRole(@PathVariable Long id, RoleDto role) {
    if (id == null || id <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role ID");
    }
    role.setId(id);
    RoleDto data = roleService.update(role);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found with id: " + id);
    }
    return ResponseUtil.updated("Role updated successfully", data);
  }

  @PatchMapping("/{id}")
  @PreAuthorize("hasAnyRole('admin', 'manager')")
  public ResponseEntity<Map<String, Object>> partialUpdateRole(@PathVariable Long id,
      @RequestBody Map<String, Object> updates) {
    if (id == null || id <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role ID");
    }
    RoleDto data = roleService.partialUpdate(id, updates);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found with id: " + id);
    }
    return ResponseUtil.success("Role partially updated successfully", data);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('admin')")
  public ResponseEntity<Map<String, Object>> deleteRole(@PathVariable Long id) {
    if (id == null || id <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role ID");
    }
    boolean deleted = roleService.delete(id);
    if (!deleted) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found with id: " + id);
    }
    return ResponseUtil.deleted("Role deleted successfully");
  }

}