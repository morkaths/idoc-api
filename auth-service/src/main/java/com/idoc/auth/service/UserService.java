package com.idoc.auth.service;

import java.util.List;
import java.util.Map;

import com.idoc.auth.model.User;

public interface UserService {
	List<User> findAllUser();
	List<User> search(Map<String, Object> filter);
	User findUserById(Long id);
	User findUserByEmail(String email);
	User createUser(User user);
	User updateUser(Long id, User user);
	User partialUpdateUser(Long id, Map<String, Object> fields);
	void deleteUserById(Long id);
	
}
