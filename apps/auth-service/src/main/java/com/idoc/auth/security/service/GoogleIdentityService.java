package com.idoc.auth.security.service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import com.idoc.auth.config.AppProperties;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleIdentityService {

    private final GoogleIdTokenVerifier verifier;

    public GoogleIdentityService(AppProperties appProperties) {
        this.verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(appProperties.getGoogle().getClient().getId()))
                .build();
    }

    public GoogleIdToken.Payload verify(String tokenString) throws GeneralSecurityException, IOException {
        GoogleIdToken idToken = verifier.verify(tokenString);
        if (idToken != null) {
            return idToken.getPayload();
        } else {
            throw new GeneralSecurityException("Invalid ID token.");
        }
    }
}
