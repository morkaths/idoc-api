package com.idoc.auth.service;

import java.util.List;

import com.idoc.auth.entity.UserEntity;

public interface UserService {
	List<UserEntity> findAllUser();
	UserEntity findUserById(Long id);
	UserEntity findUserByEmail(String email);
	UserEntity addUser(UserEntity user);
	UserEntity updateUser(UserEntity user);
	void deleteUserById(Long id);
	
}
