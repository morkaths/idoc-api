package com.idoc.auth.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.idoc.libs.common.core.BaseMapper;
import com.idoc.auth.dto.request.RoleRequest;
import com.idoc.auth.dto.response.RoleResponse;
import com.idoc.auth.entity.RoleEntity;

@Mapper(componentModel = "spring", uses = PermissionMapper.class)
public interface RoleMapper extends BaseMapper<RoleRequest, RoleResponse, RoleEntity> {

  RoleMapper INSTANCE = Mappers.getMapper(RoleMapper.class);

  @Override
  @Mapping(target = "users", ignore = true)
  @Mapping(target = "permissions", ignore = true)
  RoleEntity toEntity(RoleRequest request);

  @Override
  @Mapping(target = "permissions", source = "permissions")
  RoleResponse toResponse(RoleEntity entity);

}
