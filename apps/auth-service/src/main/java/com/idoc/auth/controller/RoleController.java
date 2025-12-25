package com.idoc.auth.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

import com.idoc.auth.dto.request.RoleRequest;
import com.idoc.auth.dto.response.RoleResponse;
import com.idoc.auth.service.RoleService;
import com.idoc.auth.util.ResponseUtil;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

  @Autowired
  private RoleService roleService;

  @GetMapping
  public ResponseEntity<Map<String, Object>> getList(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int limit,
      @RequestParam Map<String, Object> filter
  ) {
    filter.remove("page");
    filter.remove("limit");
    var data = roleService.getList(PageRequest.of(page > 0 ? page - 1 : 0, limit), filter);
    if (data.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No roles found");
    }
    return com.idoc.auth.util.ResponseUtil.paged("Roles retrieved successfully", data);
  }

  @GetMapping("/all")
  public ResponseEntity<Map<String, Object>> getAll() {
    List<RoleResponse> data = roleService.getAll();
    if (data.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No roles found");
    }
    return ResponseUtil.success("Roles retrieved successfully", data);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
    if (id == null || id <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role ID");
    }
    RoleResponse data = roleService.getById(id);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found with id: " + id);
    }
    return ResponseUtil.success("Role retrieved successfully", data);
  }

  @PostMapping
  public ResponseEntity<Map<String, Object>> create(@RequestBody RoleRequest request) {
    RoleResponse data = roleService.save(request);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to create role");
    }
    return ResponseUtil.created("Role created successfully", data);
  }

  @PatchMapping("/{id}")
  public ResponseEntity<Map<String, Object>> update(@PathVariable Long id,
      @RequestBody Map<String, Object> updates) {
    if (id == null || id <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role ID");
    }
    RoleResponse data = roleService.partial(id, updates);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found with id: " + id);
    }
    return ResponseUtil.success("Role partially updated successfully", data);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
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