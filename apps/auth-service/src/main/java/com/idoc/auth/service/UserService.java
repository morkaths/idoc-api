package com.idoc.auth.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.idoc.auth.core.BaseService;
import com.idoc.auth.dto.request.UserRequest;
import com.idoc.auth.dto.response.UserResponse;
import com.idoc.auth.entity.UserEntity;

public interface UserService extends BaseService<UserRequest, UserResponse, UserEntity, Long> {
	Page<UserResponse> getList(Pageable pageable, Map<String, Object> filter);
	UserResponse getByUsernameOrEmail(String identifier);
	List<UserResponse> search(Map<String, Object> filter);
	UserResponse assign(Long userId, Set<Long> roleIds);
	UserResponse create(UserRequest dto, Long createdBy);
}
