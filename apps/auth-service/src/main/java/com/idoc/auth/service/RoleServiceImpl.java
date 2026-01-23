package com.idoc.auth.service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.idoc.libs.common.core.BaseServiceImpl;
import com.idoc.auth.dto.request.RoleRequest;
import com.idoc.auth.dto.response.RoleResponse;
import com.idoc.auth.entity.PermissionEntity;
import com.idoc.auth.entity.RoleEntity;
import com.idoc.auth.mapper.RoleMapper;
import com.idoc.auth.repository.PermissionRepository;
import com.idoc.auth.repository.RoleRepository;
import com.idoc.auth.spec.RoleSpecification;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.idoc.libs.common.excel.ExcelHelper;
import java.io.ByteArrayInputStream;
import java.io.IOException;

@Service
@Transactional(readOnly = true)
public class RoleServiceImpl
    extends BaseServiceImpl<RoleRequest, RoleResponse, RoleEntity, Long>
    implements RoleService {

  private static final Logger log = LoggerFactory.getLogger(RoleServiceImpl.class);

  private final PermissionRepository permissionRepository;
  private final RoleRepository roleRepository;
  private final RoleMapper roleMapper;

  public RoleServiceImpl(PermissionRepository permissionRepository, RoleRepository roleRepository,
      RoleMapper roleMapper) {
    super(roleRepository, roleRepository, roleMapper);
    this.permissionRepository = permissionRepository;
    this.roleRepository = roleRepository;
    this.roleMapper = roleMapper;
  }

  @Override
  public Page<RoleResponse> find(Pageable pageable, Map<String, Object> filter) {
    String sortBy = (String) filter.getOrDefault("sortBy", "id");
    String sortOrder = (String) filter.getOrDefault("sortOrder", "asc");
    Sort sort = sortOrder.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
    Pageable pageRequest = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
    Specification<RoleEntity> spec = RoleSpecification.filter(filter);
    return this.paginate(pageRequest, spec);
  }

  @Override
  public RoleResponse findByCode(String code) {
    RoleEntity entity = roleRepository.findByCode(code);
    if (entity == null) {
      throw new IllegalArgumentException("Role not found with code: " + code);
    }
    return roleMapper.toResponse(entity);
  }

  @Override
  @Transactional
  public RoleResponse save(RoleRequest request) {
    RoleEntity entity = roleMapper.toEntity(request);
    if (request.getPermissionIds() != null) {
      Set<PermissionEntity> permissions = new HashSet<>(permissionRepository.findAllById(request.getPermissionIds()));
      entity.setPermissions(permissions);
    }
    RoleEntity saved = roleRepository.save(entity);
    return roleMapper.toResponse(saved);
  }

  @Override
  @Transactional
  public RoleResponse partial(Long id, Map<String, Object> fields) {
    RoleEntity entity = roleRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Role not found with id: " + id));
    if (fields.containsKey("permissionIds")) {
      List<?> rawPermissionIds = (List<?>) fields.get("permissionIds");
      List<Long> permissionIds = rawPermissionIds.stream()
          .map(val -> Long.valueOf(String.valueOf(val)))
          .collect(Collectors.toList());
      Set<PermissionEntity> permissions = new HashSet<>(permissionRepository.findAllById(permissionIds));
      entity.setPermissions(permissions);
      fields.remove("permissionIds");
    }
    return super.partial(id, fields);
  }

  @Override
  @Transactional
  public void importExcel(MultipartFile file) {
    if (!ExcelHelper.hasExcelFormat(file)) {
      throw new IllegalArgumentException("Please upload an excel file!");
    }

    try {
      // Pre-fetch permissions map: Code -> ID
      Map<String, Long> permissionMap = permissionRepository.findAll().stream()
          .collect(Collectors.toMap(PermissionEntity::getCode, PermissionEntity::getId));

      List<RoleRequest> requests = ExcelHelper.importFromExcel(file.getInputStream(), row -> {
        RoleRequest req = new RoleRequest();
        // Col 0: Name
        req.setName(ExcelHelper.getCellStringValue(row, 0));

        // Col 1: Code
        req.setCode(ExcelHelper.getCellStringValue(row, 1));

        // Col 2: Permissions (comma separated codes)
        String permCodes = ExcelHelper.getCellStringValue(row, 2);
        Set<Long> permIds = new HashSet<>();
        if (permCodes != null && !permCodes.isEmpty()) {
          String[] codes = permCodes.split(",");
          for (String code : codes) {
            Long permId = permissionMap.get(code.trim());
            if (permId != null) {
              permIds.add(permId);
            }
          }
        }
        req.setPermissionIds(permIds);

        return req;
      }, 1);

      for (RoleRequest req : requests) {
        try {
          if (roleRepository.existsByCode(req.getCode())) {
            log.warn("Role with code {} already exists. Skipping.", req.getCode());
            continue;
          }
          this.save(req);
        } catch (Exception e) {
          log.error("Failed to import role {}: {}", req.getCode(), e.getMessage());
        }
      }

    } catch (IOException e) {
      throw new RuntimeException("fail to store key file data: " + e.getMessage());
    }
  }

  @Override
  public ByteArrayInputStream exportExcel() {
    List<RoleResponse> roles = this.findAll();
    String[] headers = { "ID", "Name", "Code", "Permissions" };

    return ExcelHelper.exportToExcel(roles, "Roles", headers, role -> {
      String perms = role.getPermissions() != null
          ? role.getPermissions().stream().map(p -> p.getCode()).collect(Collectors.joining(", "))
          : "";

      return new Object[] {
          role.getId(),
          role.getName(),
          role.getCode(),
          perms
      };
    });
  }

}
