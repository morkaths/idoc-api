package com.idoc.auth.security.jwt;

import java.util.List;

public class JwtTokenRequest {
	private final Long userId;
	private final String username;
	private final String email;
	private final List<String> roles;
	private final List<String> permissions;

	public JwtTokenRequest(Long userId, String username, String email, List<String> roles, List<String> permissions) {
		this.userId = userId;
		this.username = username;
		this.email = email;
		this.roles = roles;
		this.permissions = permissions;
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
	
	public List<String> getPermissions() {
		return permissions;
	}

	
}
