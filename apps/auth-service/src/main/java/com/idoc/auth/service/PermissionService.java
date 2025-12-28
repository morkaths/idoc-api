package com.idoc.auth.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.idoc.auth.core.BaseService;
import com.idoc.auth.dto.request.PermissionRequest;
import com.idoc.auth.dto.response.PermissionResponse;
import com.idoc.auth.entity.PermissionEntity;

public interface PermissionService extends BaseService<PermissionRequest, PermissionResponse, PermissionEntity, Long> {
  Page<PermissionResponse> find(Pageable pageable, Map<String, Object> filter);
  PermissionResponse findByCode(String code);
  List<PermissionResponse> findByRoleId(Long roleId);
}
