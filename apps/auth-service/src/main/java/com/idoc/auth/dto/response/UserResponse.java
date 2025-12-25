package com.idoc.auth.dto.response;

import java.util.Set;

public class UserResponse {
	private Long id;
	private String username;
	private String password;
	private String email;
	private int status;
	private Set<UserRoleResponse> roles;
	
	public UserResponse() {
		super();
	}

	public UserResponse(Long id, String username, String password, String email, int status) {
		super();
		this.id = id;
		this.username = username;
		this.password = password;
		this.email = email;
		this.status = status;
	}

	public UserResponse(Long id, String username, String password, String email, int status, Set<UserRoleResponse> roles) {
		super();
		this.id = id;
		this.username = username;
		this.password = password;
		this.email = email;
		this.status = status;
		this.roles = roles;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public Set<UserRoleResponse> getRoles() {
		return roles;
	}

	public void setRoles(Set<UserRoleResponse> roles) {
		this.roles = roles;
	}

}
