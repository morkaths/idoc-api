package com.idoc.auth.mapper;

import com.idoc.auth.entity.PermissionEntity;
import com.idoc.auth.model.Permission;

public class PermissionMapper {

  public static PermissionEntity toEntity(Permission model) {
    if (model == null)
      return null;
    return new PermissionEntity(
        model.getCode(),
        model.getName());
  }

  public static Permission toModel(PermissionEntity entity) {
    if (entity == null)
      return null;
    return new Permission(
        entity.getId(),
        entity.getCode(),
        entity.getName());
  }

}
