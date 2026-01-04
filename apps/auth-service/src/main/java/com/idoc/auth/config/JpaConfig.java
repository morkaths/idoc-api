package com.idoc.auth.config;

import java.util.Optional;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.idoc.auth.security.jwt.JwtTokenRequest;

@Configuration
@EnableJpaAuditing
public class JpaConfig {
  @Bean
  public AuditorAware<String> auditorProvider() {
    return () -> {
      Authentication auth = SecurityContextHolder.getContext().getAuthentication();
      if (auth == null || !auth.isAuthenticated())
        return Optional.empty();

      if (auth.getPrincipal() instanceof JwtTokenRequest) {
        return Optional.of(((JwtTokenRequest) auth.getPrincipal()).getUsername());
      }

      return Optional.ofNullable(auth.getName());
    };
  }
}
