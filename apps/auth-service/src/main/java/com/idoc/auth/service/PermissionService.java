package com.idoc.auth.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.idoc.auth.core.BaseService;
import com.idoc.auth.dto.PermissionDto;
import com.idoc.auth.entity.PermissionEntity;

public interface PermissionService extends BaseService<PermissionDto, PermissionEntity, Long> {
  Page<PermissionDto> getList(Pageable pageable, Map<String, Object> filter);
  PermissionDto getByCode(String code);
  List<PermissionDto> getByRoleId(Long roleId);
}
