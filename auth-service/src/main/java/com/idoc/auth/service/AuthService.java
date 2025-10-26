package com.idoc.auth.service;

import com.idoc.auth.dto.UserDto;

public interface AuthService {
	String login(String identifier, String password);
	String register(String email, String username, String password);
	UserDto validateToken(String token);
	boolean changePassword(String username, String oldPassword, String newPassword);
	boolean logout(String token);
}
