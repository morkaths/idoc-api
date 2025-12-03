package com.idoc.auth.constant;

public class SecurityConstants {
	public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final long EXPIRATION_TIME = 86400000;
    public static final String[] PUBLIC_ROUTES = { "/api/auth/**", "/api/users/**" };
}
