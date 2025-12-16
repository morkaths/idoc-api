package com.idoc.auth.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.idoc.auth.core.BaseService;
import com.idoc.auth.dto.UserDto;
import com.idoc.auth.entity.UserEntity;

public interface UserService extends BaseService<UserDto, UserEntity, Long> {
	Page<UserDto> getList(Pageable pageable, Map<String, Object> filter);
	UserDto getByUsernameOrEmail(String identifier);
	List<UserDto> search(Map<String, Object> filter);
	UserDto assignRolesToUser(Long userId, List<Long> roleIds);
}
