package com.idoc.auth.service;

import com.idoc.auth.core.BaseService;
import com.idoc.auth.dto.RoleDto;

public interface RoleService extends BaseService<RoleDto, Long> {
  RoleDto findByCode(String code);
}
