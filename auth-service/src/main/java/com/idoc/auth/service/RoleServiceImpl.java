package com.idoc.auth.service;

import org.springframework.stereotype.Service;

import com.idoc.auth.core.BaseServiceImpl;
import com.idoc.auth.dto.RoleDto;
import com.idoc.auth.entity.RoleEntity;
import com.idoc.auth.mapper.RoleMapper;
import com.idoc.auth.repository.RoleRepository;

@Service
public class RoleServiceImpl extends BaseServiceImpl<RoleDto, RoleEntity, Long> implements RoleService {

  private final RoleRepository roleRepository;
  private final RoleMapper roleMapper;

  public RoleServiceImpl(RoleRepository roleRepository, RoleMapper roleMapper) {
    super(roleRepository, roleMapper);
    this.roleRepository = roleRepository;
    this.roleMapper = roleMapper;
  }

  @Override
  public RoleDto findByCode(String code) {
    RoleEntity entity = roleRepository.findByCode(code);
    if (entity == null) {
      throw new IllegalArgumentException("Role not found with code: " + code);
    }
    return roleMapper.toDto(entity);
  }

}
