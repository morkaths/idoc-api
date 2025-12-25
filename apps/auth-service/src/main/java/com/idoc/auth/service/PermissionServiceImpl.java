package com.idoc.auth.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.idoc.auth.core.BaseServiceImpl;
import com.idoc.auth.dto.request.PermissionRequest;
import com.idoc.auth.dto.response.PermissionResponse;
import com.idoc.auth.entity.PermissionEntity;
import com.idoc.auth.mapper.PermissionMapper;
import com.idoc.auth.repository.PermissionRepository;
import com.idoc.auth.spec.PermissionSpecification;

@Service
public class PermissionServiceImpl
    extends BaseServiceImpl<PermissionRequest, PermissionResponse, PermissionEntity, Long>
    implements PermissionService {

  private final PermissionRepository permissionRepository;
  private final PermissionMapper permissionMapper;

  public PermissionServiceImpl(PermissionRepository permissionRepository,
      PermissionMapper permissionMapper) {
    super(permissionRepository, permissionRepository, permissionMapper);
    this.permissionRepository = permissionRepository;
    this.permissionMapper = permissionMapper;
  }

  @Override
  public Page<PermissionResponse> getList(Pageable pageable, Map<String, Object> filter) {
    Specification<PermissionEntity> spec = PermissionSpecification.filter(filter);
    return this.search(pageable, spec);
  }

  @Override
  public PermissionResponse getByCode(String code) {
    PermissionEntity entity = permissionRepository.findByCode(code);
    if (entity == null) {
      throw new IllegalArgumentException("Permission not found with code: " + code);
    }
    return permissionMapper.toDto(entity);
  }

  @Override
  public List<PermissionResponse> getByRoleId(Long roleId) {
    List<PermissionEntity> entities = permissionRepository.findByRoleId(roleId);
    return entities.stream()
        .map(permissionMapper::toDto)
        .toList();
  }

}
