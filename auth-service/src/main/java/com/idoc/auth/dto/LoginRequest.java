package com.idoc.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

	@NotBlank(message = "Identifier is required")
	private String identifier;

	@NotBlank(message = "Password is required")
	private String password;

	public String getIdentifier() {
		return identifier;
	}

	public void setIdentifier(String username) {
		this.identifier = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
