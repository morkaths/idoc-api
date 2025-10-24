package com.idoc.auth.mapper;

import com.idoc.auth.entity.RoleEntity;
import com.idoc.auth.model.Role;

public class RoleMapper {

  public static RoleEntity toEntity(Role model) {
    if (model == null)
      return null;
    return new RoleEntity(
        model.getCode(),
        model.getName());
  }

  public static Role toModel(RoleEntity entity) {
    if (entity == null)
      return null;
    return new Role(
        entity.getId(),
        entity.getCode(),
        entity.getName());
  }

}
