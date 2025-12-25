package com.idoc.auth.dto.response;

public class AuthenticationResponse {
    private TokenResponse token;
    private UserResponse user;

    public AuthenticationResponse() {}

    public AuthenticationResponse(TokenResponse token, UserResponse user) {
        this.token = token;
        this.user = user;
    }

    public TokenResponse getToken() {
        return token;
    }

    public void setToken(TokenResponse token) {
        this.token = token;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }
}
