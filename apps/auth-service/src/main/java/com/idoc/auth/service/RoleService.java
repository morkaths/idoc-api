package com.idoc.auth.service;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.idoc.libs.common.core.BaseService;
import com.idoc.auth.dto.request.RoleRequest;
import com.idoc.auth.dto.response.RoleResponse;
import com.idoc.auth.entity.RoleEntity;

public interface RoleService extends BaseService<RoleRequest, RoleResponse, RoleEntity, Long> {
  Page<RoleResponse> find(Pageable pageable, Map<String, Object> filter);

  RoleResponse findByCode(String code);

  void importExcel(org.springframework.web.multipart.MultipartFile file);

  java.io.ByteArrayInputStream exportExcel();
}
