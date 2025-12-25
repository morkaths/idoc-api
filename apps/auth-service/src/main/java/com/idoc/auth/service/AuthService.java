package com.idoc.auth.service;

import com.idoc.auth.dto.response.AuthenticationResponse;

public interface AuthService {
	AuthenticationResponse login(String identifier, String password);
	AuthenticationResponse register(String email, String username, String password);
	AuthenticationResponse refresh(String refreshToken);
	void logout(String userId);
}
