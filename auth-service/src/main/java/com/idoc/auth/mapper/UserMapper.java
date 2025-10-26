package com.idoc.auth.mapper;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idoc.auth.core.BaseMapper;
import com.idoc.auth.dto.UserDto;
import com.idoc.auth.entity.UserEntity;

@Mapper(componentModel = "spring", uses = UserRoleMapper.class)
public interface UserMapper extends BaseMapper<UserEntity, UserDto> {
  UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

  @Override
  @Mapping(target = "roles", source = "roles")
  UserEntity toEntity(UserDto dto);

  @Override
  @Mapping(target = "password", ignore = true)
  @Mapping(target = "roles", source = "roles")
  UserDto toDto(UserEntity entity);

  /**
   * Cập nhật UserEntity từ Map các trường và giá trị.
   * Jackson duyệt từng key trong fields ("email", "status", v.v.).
   * Nếu key khớp với attribute của Entity, nó sẽ cập nhật giá trị tương ứng.
   * 
   * @param objectMapper - ObjectMapper để thực hiện việc cập nhật
   * @param fields       - Bản đồ các trường và giá trị cần cập nhật
   * @param entity       - Thực thể UserEntity cần được cập nhật
   */
  public static void updateEntityFromMap(ObjectMapper objectMapper, Map<String, Object> fields, UserEntity entity) {
    Set<String> validFields = getEntityFieldNames(UserEntity.class);
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

  public static Set<String> getEntityFieldNames(Class<?> clazz) {
    return Arrays.stream(clazz.getDeclaredFields())
        .map(Field::getName)
        .collect(Collectors.toSet());
  }
}
