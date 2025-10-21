package com.idoc.auth.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.idoc.auth.entity.UserEntity;
import com.idoc.auth.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepository userRepository;

	@Override
	public List<UserEntity> findAllUser() {
		return userRepository.findAll();
	}

	@Override
	public UserEntity findUserById(Long id) {
		if (!userRepository.existsById(id)) {
			throw new IllegalArgumentException("User with id " + id + " does not exist");
		}
		return userRepository.findById(id).orElse(null);
	}

	@Override
	public UserEntity findUserByEmail(String email) {
		if (email == null || email.isEmpty()) {
			throw new IllegalArgumentException("Email cannot be null or empty");
		}
		return userRepository.findByEmail(email);
	}

	@Override
	public UserEntity addUser(UserEntity user) {
		if (user.getId() != null && userRepository.existsById(user.getId())) {
			throw new IllegalArgumentException("User with id " + user.getId() + " already exists");
		}
		return userRepository.save(user);
	}

	@Override
	public UserEntity updateUser(UserEntity user) {
		if (user.getId() == null || !userRepository.existsById(user.getId())) {
			throw new IllegalArgumentException("User with id " + user.getId() + " does not exist");
		}
		return userRepository.save(user);
	}

	@Override
	public void deleteUserById(Long id) {
		if (!userRepository.existsById(id)) {
			throw new IllegalArgumentException("User with id " + id + " does not exist");
		}
		userRepository.deleteById(id);
	}
	
}
