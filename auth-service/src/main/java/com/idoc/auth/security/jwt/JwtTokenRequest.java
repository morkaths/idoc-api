package com.idoc.auth.security.jwt;

import java.util.List;

public class JwtTokenRequest {
	private final Long userId;
	private final String username;
	private final String email;
	private final List<String> roles;

	public JwtTokenRequest(Long userId, String username, String email, List<String> roles) {
		this.userId = userId;
		this.username = username;
		this.email = email;
		this.roles = roles;
	}

	public Long getUserId() {
		return userId;
	}

	public String getUsername() {
		return username;
	}

	public String getEmail() {
		return email;
	}

	public List<String> getRoles() {
		return roles;
	}
}
