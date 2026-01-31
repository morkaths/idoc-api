package com.idoc.auth.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.idoc.libs.common.core.BaseServiceImpl;
import com.idoc.auth.dto.request.PermissionRequest;
import com.idoc.auth.dto.response.PermissionResponse;
import com.idoc.auth.entity.PermissionEntity;
import com.idoc.auth.mapper.PermissionMapper;
import com.idoc.auth.repository.PermissionRepository;
import com.idoc.auth.spec.PermissionSpecification;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.idoc.libs.common.excel.ExcelHelper;
import java.io.ByteArrayInputStream;
import java.io.IOException;

@Service
@Transactional(readOnly = true)
public class PermissionServiceImpl
    extends BaseServiceImpl<PermissionRequest, PermissionResponse, PermissionEntity, Long>
    implements PermissionService {

  private static final Logger log = LoggerFactory.getLogger(PermissionServiceImpl.class);

  private final PermissionRepository permissionRepository;
  private final PermissionMapper permissionMapper;

  public PermissionServiceImpl(PermissionRepository permissionRepository,
      PermissionMapper permissionMapper) {
    super(permissionRepository, permissionRepository, permissionMapper);
    this.permissionRepository = permissionRepository;
    this.permissionMapper = permissionMapper;
  }

  @Override
  public Page<PermissionResponse> find(Pageable pageable, Map<String, Object> filter) {
    Specification<PermissionEntity> spec = PermissionSpecification.filter(filter);
    return this.paginate(pageable, spec);
  }

  @Override
  public PermissionResponse findByCode(String code) {
    PermissionEntity entity = permissionRepository.findByCode(code);
    if (entity == null) {
      throw new IllegalArgumentException("Permission not found with code: " + code);
    }
    return permissionMapper.toResponse(entity);
  }

  @Override
  public List<PermissionResponse> findByRoleId(Long roleId) {
    List<PermissionEntity> entities = permissionRepository.findByRoleId(roleId);
    return entities.stream()
        .map(permissionMapper::toResponse)
        .toList();
  }

  @Override
  @Transactional
  public void importExcel(MultipartFile file) {
    if (!ExcelHelper.hasExcelFormat(file)) {
      throw new IllegalArgumentException("Please upload an excel file!");
    }

    try {
      List<PermissionRequest> requests = ExcelHelper.importFromExcel(file.getInputStream(), (row, headerMap) -> {
        PermissionRequest req = new PermissionRequest();
        // Col: Name
        req.setName(ExcelHelper.getCellStringValue(row, headerMap, "Name"));

        // Col: Code
        req.setCode(ExcelHelper.getCellStringValue(row, headerMap, "Code"));

        return req;
      });

      for (PermissionRequest req : requests) {
        try {
          if (permissionRepository.existsByCode(req.getCode())) {
            log.warn("Permission with code {} already exists. Skipping.", req.getCode());
            continue;
          }
          this.save(req);
        } catch (Exception e) {
          log.error("Failed to import permission {}: {}", req.getCode(), e.getMessage());
        }
      }

    } catch (IOException e) {
      throw new RuntimeException("fail to store key file data: " + e.getMessage());
    }
  }

  @Override
  public ByteArrayInputStream exportExcel() {
    List<PermissionResponse> permissions = this.findAll();
    String[] headers = { "ID", "Name", "Code" };

    return ExcelHelper.exportToExcel(permissions, "Permissions", headers, permission -> {
      return new Object[] {
          permission.getId(),
          permission.getName(),
          permission.getCode()
      };
    });
  }

}
