package com.idoc.auth.security.jwt;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

@Component
public class JwtTokenProvider {

  private final Algorithm algorithm;
  private final JWTVerifier verifier;
  private final String issuer;
  private final String audience;

  public JwtTokenProvider(
      @Value("${jwt.secret}") String jwtSecret,
      @Value("${jwt.issuer}") String jwtIssuer,
      @Value("${jwt.audience}") String jwtAudience) {
    this.algorithm = Algorithm.HMAC256(jwtSecret);
    this.issuer = jwtIssuer;
    this.audience = jwtAudience;
    this.verifier = JWT.require(algorithm)
        .withIssuer(issuer)
        .withAudience(audience)
        .build();
  }

  public String createToken(JwtTokenRequest request, long expiration) {
    return JWT.create()
        .withSubject(String.valueOf(request.getUserId()))
        .withIssuer(issuer)
        .withAudience(audience)
        .withIssuedAt(new Date())
        .withExpiresAt(new Date(System.currentTimeMillis() + expiration))
        .withClaim("username", request.getUsername())
        .withClaim("email", request.getEmail())
        .withClaim("roles", request.getRoles())
        .sign(algorithm);
  }

  public DecodedJWT decodeToken(String token) {
    try {
      return verifier.verify(token);
    } catch (JWTVerificationException | NullPointerException e) {
      e.printStackTrace();
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
