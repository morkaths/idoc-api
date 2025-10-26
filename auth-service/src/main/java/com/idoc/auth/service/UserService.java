package com.idoc.auth.service;

import java.util.List;
import java.util.Map;

import com.idoc.auth.core.BaseService;
import com.idoc.auth.dto.UserDto;

public interface UserService extends BaseService<UserDto, Long> {
	UserDto findByUsernameOrEmail(String identifier);
	List<UserDto> search(Map<String, Object> filter);
	UserDto assignRolesToUser(Long userId, List<Long> roleIds);
}
