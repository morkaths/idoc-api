package com.idoc.auth.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.idoc.auth.entity.UserEntity;
import com.idoc.auth.mapper.UserMapper;
import com.idoc.auth.model.User;
import com.idoc.auth.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ObjectMapper objectMapper;

	@Override
	public List<User> findAllUser() {
		return userRepository.findAll()
				.stream()
				.map(UserMapper::toModel)
				.toList();
	}

	@Override
	public List<User> search(Map<String, Object> filter) {
		Specification<UserEntity> spec = null;
		for (Map.Entry<String, Object> entry : filter.entrySet()) {
			String key = entry.getKey();
			Object value = entry.getValue();
			if (value == null)
				continue;
			String[] values = value.toString().split(",");
			Specification<UserEntity> fieldSpec = null;
			for (String v : values) {
				Specification<UserEntity> s = (root, query, cb) -> cb.equal(root.get(key), v.trim());
				fieldSpec = (fieldSpec == null) ? s : fieldSpec.or(s);
			}
			spec = (spec == null) ? fieldSpec : spec.and(fieldSpec);
		}

		return userRepository.findAll(spec != null ? spec : (root, query, cb) -> cb.conjunction())
				.stream()
				.map(UserMapper::toModel)
				.toList();
	}

	@Override
	public User findUserById(Long id) {
		UserEntity entity = userRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("User with id " + id + " does not exist"));
		return UserMapper.toModel(entity);
	}

	@Override
	public User findUserByEmail(String email) {
		if (email == null || email.isEmpty()) {
			throw new IllegalArgumentException("Email cannot be null or empty");
		}
		UserEntity entity = userRepository.findByEmail(email);
		return UserMapper.toModel(entity);
	}

	@Override
	public User createUser(User user) {
		if (user.getId() != null && userRepository.existsById(user.getId())) {
			throw new IllegalArgumentException("User with id " + user.getId() + " already exists");
		}
		UserEntity entity = UserMapper.toEntity(user);
		UserEntity saved = userRepository.save(entity);
		return UserMapper.toModel(saved);
	}

	@Override
	public User updateUser(Long id, User user) {
		if (!userRepository.existsById(id)) {
			throw new IllegalArgumentException("User with id " + id + " does not exist");
		}
		UserEntity entity = UserMapper.toEntity(user);
		UserEntity saved = userRepository.save(entity);
		return UserMapper.toModel(saved);
	}

	@Override
	public User partialUpdateUser(Long id, Map<String, Object> fields) {
		UserEntity entity = userRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("User with id " + id + " does not exist"));
		UserMapper.updateEntityFromMap(objectMapper, fields, entity);
		UserEntity saved = userRepository.save(entity);
		return UserMapper.toModel(saved);
	}

	@Override
	public void deleteUserById(Long id) {
		if (!userRepository.existsById(id)) {
			throw new IllegalArgumentException("User with id " + id + " does not exist");
		}
		userRepository.deleteById(id);
	}

}
