package com.idoc.auth.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.idoc.auth.core.BaseMapper;
import com.idoc.auth.dto.RoleDto;
import com.idoc.auth.entity.RoleEntity;

@Mapper(componentModel = "spring", uses = PermissionMapper.class)
public interface RoleMapper extends BaseMapper<RoleEntity, RoleDto> {

  RoleMapper INSTANCE = Mappers.getMapper(RoleMapper.class);

  @Override
  @Mapping(target = "users", ignore = true)
  @Mapping(target = "permissions", source = "permissions")
  RoleEntity toEntity(RoleDto dto);

  @Override
  @Mapping(target = "permissions", source = "permissions")
  RoleDto toDto(RoleEntity entity);

}
