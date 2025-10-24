package com.idoc.auth.mapper;

import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idoc.auth.entity.RoleEntity;
import com.idoc.auth.entity.UserEntity;
import com.idoc.auth.model.Role;
import com.idoc.auth.model.User;

public class UserMapper {

  public static UserEntity toEntity(User model) {
    if (model == null)
      return null;
    UserEntity entity = new UserEntity(
        model.getUsername(),
        model.getPassword(),
        model.getEmail(),
        model.getStatus(),
        model.getRoles() != null
            ? model.getRoles().stream()
                .map(role -> new RoleEntity(role.getCode(), role.getName()))
                .collect(Collectors.toSet())
            : Collections.emptySet());
    return entity;
  }

  public static User toModel(UserEntity entity) {
    if (entity == null)
      return null;
    User model = new User(
        entity.getId(),
        entity.getUsername(),
        null,
        entity.getEmail(),
        entity.getStatus());
    model.setRoles(
        entity.getRoles() != null
            ? entity.getRoles().stream()
                .map(role -> new Role(
                    role.getId(),
                    role.getCode(),
                    role.getName()))
                .collect(Collectors.toSet())
            : Collections.emptySet());
    return model;
  }

  public static void updateEntityFromMap(ObjectMapper objectMapper, Map<String, Object> fields, UserEntity entity) {
    try {
      objectMapper.updateValue(fields, entity);
    } catch (JsonMappingException e) {
      throw new IllegalArgumentException("Invalid update data: " + e.getMessage(), e);
    }
  }
}
