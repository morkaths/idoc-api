package com.idoc.auth.service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.idoc.auth.core.BaseServiceImpl;
import com.idoc.auth.dto.external.ProfileRequest;
import com.idoc.auth.dto.request.UserRequest;
import com.idoc.auth.dto.response.UserResponse;
import com.idoc.auth.entity.RoleEntity;
import com.idoc.auth.entity.UserEntity;
import com.idoc.auth.integration.ProfileClient;
import com.idoc.auth.mapper.UserMapper;
import com.idoc.auth.repository.RoleRepository;
import com.idoc.auth.repository.TokenRepository;
import com.idoc.auth.repository.UserRepository;
import com.idoc.auth.spec.UserSpecification;
import com.idoc.auth.util.SpecificationBuilder;

@Service
public class UserServiceImpl
		extends BaseServiceImpl<UserRequest, UserResponse, UserEntity, Long>
		implements UserService {

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final UserMapper userMapper;
	private final ProfileClient profileClient;
	private final TokenRepository tokenRepository;

	public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, RoleRepository roleRepository,
			ProfileClient profileClient, TokenRepository tokenRepository) {
		super(userRepository, userRepository, userMapper);
		this.userRepository = userRepository;
		this.userMapper = userMapper;
		this.roleRepository = roleRepository;
		this.profileClient = profileClient;
		this.tokenRepository = tokenRepository;
	}

	@Override
	public Page<UserResponse> find(Pageable pageable, Map<String, Object> filter) {
		String sortBy = (String) filter.getOrDefault("sortBy", "id");
		String sortOrder = (String) filter.getOrDefault("sortOrder", "asc");
		Sort sort = sortOrder.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		Pageable pageRequest = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
		Specification<UserEntity> spec = UserSpecification.filter(filter);
		return this.paginate(pageRequest, spec);
	}

	@Override
	public UserResponse findByUsernameOrEmail(String identifier) {
		UserEntity user = userRepository.findByUsernameOrEmail(identifier);
		if (user == null) {
			throw new IllegalArgumentException("User not found with identifier: " + identifier);
		}
		return userMapper.toResponse(user);
	}

	@Override
	public List<UserResponse> search(Map<String, Object> filter) {
		SpecificationBuilder<UserEntity> builder = SpecificationBuilder.<UserEntity>builder()
				.queryFields("username", "email")
				.likeFields("username", "email", "status")
				.manyToManyField("roles", "code")
				.build();
		Specification<UserEntity> specification = builder.build(filter);
		return userRepository.findAll(specification)
				.stream()
				.map(userMapper::toResponse)
				.toList();
	}

	@Override
	@Transactional
	public UserResponse assign(Long userId, Set<Long> roleIds) {
		UserEntity user = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));
		Set<RoleEntity> roles = roleRepository.findAllById(roleIds)
				.stream()
				.collect(Collectors.toSet());
		user.setRoles(roles);
		return userMapper.toResponse(userRepository.save(user));
	}

	@Override
	@Transactional
	public UserResponse save(UserRequest dto) {
		UserEntity entity = userMapper.toEntity(dto);
		if (dto.getRoleIds() != null && !dto.getRoleIds().isEmpty()) {
			Set<RoleEntity> roles = new HashSet<>(roleRepository.findAllById(dto.getRoleIds()));
			entity.setRoles(roles);
		}
		UserEntity saved = userRepository.save(entity);
		return userMapper.toResponse(saved);
	}

	@Override
	@Transactional
	public UserResponse create(UserRequest dto, Long createdBy) {
		UserEntity entity = userMapper.toEntity(dto);
		if (dto.getRoleIds() != null && !dto.getRoleIds().isEmpty()) {
			Set<RoleEntity> roles = new HashSet<>(roleRepository.findAllById(dto.getRoleIds()));
			entity.setRoles(roles);
		}
		UserEntity saved = userRepository.save(entity);
		ProfileRequest profile = new ProfileRequest(
				saved.getId(),
				"User " + saved.getUsername(),
				null,
				null,
				null,
				null);
		String accessToken = tokenRepository.getAccessToken(String.valueOf(createdBy));
		try {
			profileClient.create(profile, accessToken);
		} catch (Exception ex) {
			System.err.println("Error when creating profile: " + ex.getMessage());
		}
		return userMapper.toResponse(saved);
	}

	@Override
	@Transactional
	public UserResponse partial(Long id, Map<String, Object> fields) {
		UserEntity user = userRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));
		if (fields.containsKey("roleIds")) {
			List<?> rawRoleIds = (List<?>) fields.get("roleIds");
			List<Long> roleIds = rawRoleIds.stream()
					.map(val -> Long.valueOf(val.toString()))
					.collect(Collectors.toList());
			Set<RoleEntity> roles = new HashSet<>(roleRepository.findAllById(roleIds));
			user.setRoles(roles);
			fields.remove("roleIds");
		}
		return super.partial(id, fields);
	}

}
