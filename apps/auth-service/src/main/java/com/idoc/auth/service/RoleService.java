package com.idoc.auth.service;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.idoc.auth.core.BaseService;
import com.idoc.auth.dto.RoleDto;
import com.idoc.auth.entity.RoleEntity;

public interface RoleService extends BaseService<RoleDto, RoleEntity, Long> {
  Page<RoleDto> getList(Pageable pageable, Map<String, Object> filter);
  RoleDto getByCode(String code);
}
