package com.idoc.auth.mapper;

import org.mapstruct.Mapper;

import com.idoc.libs.common.core.BaseMapper;
import com.idoc.auth.dto.request.PermissionRequest;
import com.idoc.auth.dto.response.PermissionResponse;
import com.idoc.auth.entity.PermissionEntity;

@Mapper(componentModel = "spring")
public interface PermissionMapper extends BaseMapper<PermissionRequest, PermissionResponse, PermissionEntity> {

  @Override
  @org.mapstruct.Mapping(target = "roles", ignore = true)
  PermissionEntity toEntity(PermissionRequest request);

  @Override
  PermissionResponse toResponse(PermissionEntity entity);
}
