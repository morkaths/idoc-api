package com.idoc.auth.mapper;

import org.mapstruct.Mapper;

import com.idoc.auth.core.BaseMapper;
import com.idoc.auth.dto.PermissionDto;
import com.idoc.auth.entity.PermissionEntity;

@Mapper(componentModel = "spring")
public interface PermissionMapper extends BaseMapper<PermissionEntity, PermissionDto> {

  @Override
  @org.mapstruct.Mapping(target = "roles", ignore = true)
  PermissionEntity toEntity(PermissionDto model);

  @Override
  PermissionDto toDto(PermissionEntity entity);
}
