package com.idoc.auth.service;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.idoc.auth.core.BaseServiceImpl;
import com.idoc.auth.dto.RoleDto;
import com.idoc.auth.entity.RoleEntity;
import com.idoc.auth.mapper.RoleMapper;
import com.idoc.auth.repository.RoleRepository;
import com.idoc.auth.spec.RoleSpecification;

@Service
public class RoleServiceImpl extends BaseServiceImpl<RoleDto, RoleEntity, Long> implements RoleService {

  private final RoleRepository roleRepository;
  private final RoleMapper roleMapper;

  public RoleServiceImpl(RoleRepository roleRepository, RoleMapper roleMapper) {
    super(roleRepository, roleRepository, roleMapper);
    this.roleRepository = roleRepository;
    this.roleMapper = roleMapper;
  }

  @Override
  public Page<RoleDto> getList(Pageable pageable, Map<String, Object> filter) {
    Specification<RoleEntity> spec = RoleSpecification.filter(filter);
    return this.search(pageable, spec);
  }

  @Override
  public RoleDto getByCode(String code) {
    RoleEntity entity = roleRepository.findByCode(code);
    if (entity == null) {
      throw new IllegalArgumentException("Role not found with code: " + code);
    }
    return roleMapper.toDto(entity);
  }

}
