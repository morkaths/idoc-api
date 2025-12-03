package com.idoc.auth.util;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.persistence.Column;

public class EntityUtil {
  public static List<String> getFieldNames(Class<?> entityClass) {
    return Arrays.stream(entityClass.getDeclaredFields())
        .map(Field::getName)
        .toList();
  }

  public static Map<String, String> getColumnNames(Class<?> entityClass) {
    Map<String, String> fieldToColumn = new HashMap<>();
    for (Field field : entityClass.getDeclaredFields()) {
      Column column = field.getAnnotation(Column.class);
      if (column != null && !column.name().isBlank()) {
        fieldToColumn.put(field.getName(), column.name());
      } else {
        fieldToColumn.put(field.getName(), field.getName());
      }
    }
    return fieldToColumn;
  }
}
