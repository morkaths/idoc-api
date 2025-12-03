package com.idoc.auth.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.idoc.auth.core.BaseServiceImpl;
import com.idoc.auth.dto.PermissionDto;
import com.idoc.auth.entity.PermissionEntity;
import com.idoc.auth.mapper.PermissionMapper;
import com.idoc.auth.repository.PermissionRepository;

@Service
public class PermissionServiceImpl extends BaseServiceImpl<PermissionDto, PermissionEntity, Long> implements PermissionService {

  private final PermissionRepository permissionRepository;
  private final PermissionMapper permissionMapper;

  public PermissionServiceImpl(PermissionRepository permissionRepository, PermissionMapper permissionMapper) {
    super(permissionRepository, permissionMapper);
    this.permissionRepository = permissionRepository;
    this.permissionMapper = permissionMapper;
  }

  @Override
  public PermissionDto findByCode(String code) {
    PermissionEntity entity = permissionRepository.findByCode(code);
    if (entity == null) {
      throw new IllegalArgumentException("Permission not found with code: " + code);
    }
    return permissionMapper.toDto(entity);
  }

  @Override
  public List<PermissionDto> findByRoleId(Long roleId) {
    List<PermissionEntity> entities = permissionRepository.findByRoleId(roleId);
    return entities.stream()
        .map(permissionMapper::toDto)
        .toList();
  }

}
