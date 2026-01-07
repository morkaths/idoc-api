package com.idoc.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public class GoogleLoginRequest {

    @NotBlank(message = "ID Token is required")
    private String idToken;

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }
}
