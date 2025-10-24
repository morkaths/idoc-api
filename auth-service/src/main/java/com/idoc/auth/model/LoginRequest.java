package com.idoc.auth.model;

public class LoginRequest {
	private String identifier;
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
