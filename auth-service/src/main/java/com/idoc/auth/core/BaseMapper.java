package com.idoc.auth.core;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public interface BaseMapper<E, D> {
  D toDto(E entity);

  E toEntity(D dto);

  default void partialUpdateEntity(ObjectMapper objectMapper, Map<String, Object> fields, E entity) {
    Set<String> validFields = Arrays.stream(entity.getClass().getDeclaredFields())
        .map(Field::getName)
        .collect(Collectors.toSet());
    String invalidKeys = fields.keySet().stream()
        .filter(key -> !validFields.contains(key))
        .collect(Collectors.joining(", "));
    if (!invalidKeys.isEmpty()) {
      throw new IllegalArgumentException("Invalid field(s): " + invalidKeys);
    }
    try {
      objectMapper.updateValue(entity, fields);
    } catch (JsonMappingException e) {
      throw new IllegalArgumentException("Invalid update data: " + e.getMessage(), e);
    }
  }
}
