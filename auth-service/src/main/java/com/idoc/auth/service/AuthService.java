package com.idoc.auth.service;

public interface AuthService {
	String login(String identifier, String password);
	String register(String email, String username, String password);
}
