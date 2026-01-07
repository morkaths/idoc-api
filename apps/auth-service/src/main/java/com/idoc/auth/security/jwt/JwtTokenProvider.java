package com.idoc.auth.security.jwt;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Date;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.idoc.auth.config.AppProperties;
import com.idoc.auth.util.KeyUtils;

import jakarta.annotation.PostConstruct;

@Component
public class JwtTokenProvider {

  private Algorithm algorithm;
  private JWTVerifier verifier;

  private final AppProperties appProperties;
  private final KeyUtils keyUtils;

  public JwtTokenProvider(AppProperties appProperties, KeyUtils keyUtils) {
    this.appProperties = appProperties;
    this.keyUtils = keyUtils;
  }

  @PostConstruct
  public void init() throws Exception {
    RSAPrivateKey privateKey = keyUtils.getPrivateKey(appProperties.getJwt().getPrivateKey());
    RSAPublicKey publicKey = keyUtils.getPublicKey(appProperties.getJwt().getPublicKey());
    this.algorithm = Algorithm.RSA256(publicKey, privateKey);
    this.verifier = JWT.require(algorithm)
        .withIssuer(appProperties.getJwt().getIssuer())
        .withAudience(appProperties.getJwt().getAudience())
        .build();
  }

  public String createToken(JwtTokenRequest request, long expiration) {
    return JWT.create()
        .withSubject(String.valueOf(request.getUserId()))
        .withJWTId(UUID.randomUUID().toString()) // Add JTI
        .withIssuer(appProperties.getJwt().getIssuer())
        .withAudience(appProperties.getJwt().getAudience())
        .withIssuedAt(new Date())
        .withExpiresAt(new Date(System.currentTimeMillis() + expiration))
        .withClaim("username", request.getUsername())
        .withClaim("email", request.getEmail())
        .withClaim("roles", request.getRoles())
        .withClaim("permissions", request.getPermissions())
        .sign(algorithm);
  }

  public DecodedJWT decodeToken(String token) {
    try {
      return verifier.verify(token);
    } catch (JWTVerificationException | NullPointerException e) {
      return null;
    }
  }

  public String getSubjectFromToken(String token) {
    DecodedJWT jwt = decodeToken(token);
    return jwt != null ? jwt.getSubject() : null;
  }

  public boolean isValidToken(String token) {
    return decodeToken(token) != null;
  }

}
