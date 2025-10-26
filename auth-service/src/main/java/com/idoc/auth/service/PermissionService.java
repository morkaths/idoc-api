package com.idoc.auth.service;

import java.util.List;

import com.idoc.auth.core.BaseService;
import com.idoc.auth.dto.PermissionDto;

public interface PermissionService extends BaseService<PermissionDto, Long> {
  PermissionDto findByCode(String code);
  List<PermissionDto> findByRoleId(Long roleId);
}
