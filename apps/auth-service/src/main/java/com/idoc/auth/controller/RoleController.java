package com.idoc.auth.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import com.idoc.auth.dto.request.RoleRequest;
import com.idoc.auth.dto.response.ApiResponse;
import com.idoc.auth.dto.response.RoleResponse;
import com.idoc.auth.service.RoleService;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

  @Autowired
  private RoleService roleService;

  @GetMapping
  @PreAuthorize("hasAuthority('role.view')")
  public ResponseEntity<ApiResponse<List<RoleResponse>>> getList(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int limit,
      @RequestParam Map<String, Object> filter) {
    filter.remove("page");
    filter.remove("limit");
    Page<RoleResponse> data = roleService.find(PageRequest.of(page > 0 ? page - 1 : 0, limit), filter);
    if (data.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No roles found");
    }
    return ResponseEntity.ok(ApiResponse.paged(data, "Roles retrieved successfully"));
  }

  @GetMapping("/all")
  @PreAuthorize("hasAuthority('role.view')")
  public ResponseEntity<ApiResponse<List<RoleResponse>>> getAll() {
    List<RoleResponse> data = roleService.findAll();
    if (data.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No roles found");
    }
    return ResponseEntity.ok(ApiResponse.success(data, "Roles retrieved successfully"));
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAuthority('role.view')")
  public ResponseEntity<ApiResponse<RoleResponse>> getById(@PathVariable Long id) {
    if (id == null || id <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role ID");
    }
    RoleResponse data = roleService.findById(id);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found with id: " + id);
    }
    return ResponseEntity.ok(ApiResponse.success(data, "Role retrieved successfully"));
  }

  @PostMapping
  @PreAuthorize("hasAuthority('role.edit')")
  public ResponseEntity<ApiResponse<RoleResponse>> create(@RequestBody RoleRequest request) {
    RoleResponse data = roleService.save(request);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to create role");
    }
    return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(data, "Role created successfully"));
  }

  @PatchMapping("/{id}")
  @PreAuthorize("hasAuthority('role.edit')")
  public ResponseEntity<ApiResponse<RoleResponse>> update(@PathVariable Long id,
      @RequestBody Map<String, Object> updates) {
    if (id == null || id <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role ID");
    }
    RoleResponse data = roleService.partial(id, updates);
    if (data == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found with id: " + id);
    }
    return ResponseEntity.ok(ApiResponse.updated(data));
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAuthority('role.delete')")
  public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
    if (id == null || id <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role ID");
    }
    boolean deleted = roleService.delete(id);
    if (!deleted) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found with id: " + id);
    }
    return ResponseEntity.ok(ApiResponse.deleted());
  }

  @PostMapping("/import")
  @PreAuthorize("hasAuthority('role.edit')")
  public ResponseEntity<ApiResponse<String>> importExcel(@RequestParam("file") MultipartFile file) {
    roleService.importExcel(file);
    return ResponseEntity.ok(ApiResponse.success("Roles imported successfully"));
  }

  @GetMapping("/export")
  @PreAuthorize("hasAuthority('role.view')")
  public ResponseEntity<Resource> exportExcel() {
    String timestamp = LocalDateTime.now()
        .format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
    String filename = "Roles_" + timestamp + ".xlsx";
    InputStreamResource file = new InputStreamResource(roleService.exportExcel());

    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
        .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
        .body(file);
  }

}
