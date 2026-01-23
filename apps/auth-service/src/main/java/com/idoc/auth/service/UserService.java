package com.idoc.auth.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import java.io.ByteArrayInputStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.idoc.libs.common.core.BaseService;
import com.idoc.auth.dto.request.UserRequest;
import com.idoc.auth.dto.response.UserResponse;
import com.idoc.auth.entity.UserEntity;

public interface UserService extends BaseService<UserRequest, UserResponse, UserEntity, Long> {
	Page<UserResponse> find(Pageable pageable, Map<String, Object> filter);

	UserResponse findByUsernameOrEmail(String identifier);

	List<UserResponse> search(Map<String, Object> filter);

	UserResponse assign(Long userId, Set<Long> roleIds);

	UserResponse create(UserRequest dto, Long createdBy);

	void importExcel(MultipartFile file);

	ByteArrayInputStream exportExcel();
}
