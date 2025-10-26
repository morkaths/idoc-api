package com.idoc.auth.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.idoc.auth.dto.UserRoleDto;
import com.idoc.auth.entity.RoleEntity;

@Mapper(componentModel = "spring")
public interface UserRoleMapper {
  @Mapping(target = "permissions", ignore = true)
  @Mapping(target = "users", ignore = true)
  RoleEntity toEntity(UserRoleDto dto);

  UserRoleDto toDto(RoleEntity entity);
}
