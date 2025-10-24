package com.idoc.auth.security.jwt;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.idoc.auth.constant.SecurityConstants;

@Component
public class JwtTokenProvider {

  private final Algorithm algorithm;
  private final JWTVerifier verifier;

  public JwtTokenProvider(@Value("${jwt.secret}") String jwtSecret) {
    this.algorithm = Algorithm.HMAC256(jwtSecret);
    this.verifier = JWT.require(algorithm).build();
  }

  public String createToken(JwtTokenRequest request) {
    return JWT.create()
        .withSubject(String.valueOf(request.getUserId()))
        .withIssuedAt(new Date())
        .withExpiresAt(new Date(System.currentTimeMillis() + SecurityConstants.EXPIRATION_TIME))
        .withClaim("username", request.getUsername())
        .withClaim("email", request.getEmail())
        .withClaim("roles", request.getRoles())
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
