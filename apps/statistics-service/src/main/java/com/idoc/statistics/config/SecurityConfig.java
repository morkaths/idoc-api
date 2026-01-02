package com.idoc.statistics.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, ApiKeyFilter apiKeyFilter) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .requestMatchers("/api/v1/statistics/**").authenticated()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(apiKeyFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Component
    public static class ApiKeyFilter extends OncePerRequestFilter {

        @Value("${service.key}") // Default or from properties
        private String apiKey;

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                throws ServletException, IOException {
            
            String path = request.getRequestURI();
            if (path.startsWith("/v3/api-docs") || path.startsWith("/swagger-ui")) {
                filterChain.doFilter(request, response);
                return;
            }

            String requestApiKey = request.getHeader("x-api-key");
            if (apiKey.equals(requestApiKey)) {
                 // Set simplistic authentication
                 // For now, assume if key matches, it's authenticated.
                 // In Spring Security, we usually set Authentication object in SecurityContextHolder.
                 // I'll skip complex object creation for now or create a simple token.
                 org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(
                     new org.springframework.security.authentication.UsernamePasswordAuthenticationToken("internal-service", null, java.util.Collections.emptyList())
                 );
                 filterChain.doFilter(request, response);
            } else {
                 response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                 response.getWriter().write("Unauthorized: Invalid API Key");
            }
        }
    }
}
