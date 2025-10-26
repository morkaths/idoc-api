package com.idoc.auth.service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.idoc.auth.core.BaseServiceImpl;
import com.idoc.auth.dto.UserDto;
import com.idoc.auth.entity.RoleEntity;
import com.idoc.auth.entity.UserEntity;
import com.idoc.auth.mapper.UserMapper;
import com.idoc.auth.repository.RoleRepository;
import com.idoc.auth.repository.UserRepository;
import com.idoc.auth.util.SpecificationBuilder;

@Service
public class UserServiceImpl extends BaseServiceImpl<UserDto, UserEntity, Long> implements UserService {

	private final UserRepository userRepository;
	private final UserMapper userMapper;

	public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
		super(userRepository, userMapper);
		this.userRepository = userRepository;
		this.userMapper = userMapper;
	}

	@Autowired
	private RoleRepository roleRepository;

	@Override
	public List<UserDto> search(Map<String, Object> filter) {
		SpecificationBuilder<UserEntity> builder = SpecificationBuilder.<UserEntity>builder()
				.queryFields("username", "email")
				.likeFields("username", "email", "status")
				.manyToManyField("roles", "code")
				.build();
		Specification<UserEntity> specification = builder.build(filter);
		return userRepository.findAll(specification)
				.stream()
				.map(userMapper::toDto)
				.toList();
	}

	@Override
	public UserDto assignRolesToUser(Long userId, List<Long> roleIds) {
		UserEntity user = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));
		Set<RoleEntity> roles = roleRepository.findAllById(roleIds)
				.stream()
				.collect(Collectors.toSet());
		user.setRoles(roles);
		return userMapper.toDto(userRepository.save(user));
	}

	@Override
	public UserDto findByUsernameOrEmail(String identifier) {
		UserEntity user = userRepository.findByUsernameOrEmail(identifier);
		if (user == null) {
			throw new IllegalArgumentException("User not found with identifier: " + identifier);
		}
		return userMapper.toDto(user);
	}

}
