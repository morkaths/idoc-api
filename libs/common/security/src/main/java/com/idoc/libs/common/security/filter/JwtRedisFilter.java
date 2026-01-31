package com.idoc.libs.common.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtRedisFilter extends OncePerRequestFilter {

    private final StringRedisTemplate redisTemplate;

    public JwtRedisFilter(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken jwtToken) {
            // Get JTI from claims
            String jti = jwtToken.getToken().getId();
            // Fallback if ID is not set in standard field, check claims
            if (jti == null) {
                jti = jwtToken.getToken().getClaimAsString("jti");
            }

            if (jti != null) {
                String blacklistKey = "idoc:auth:blacklist:access:" + jti;
                if (Boolean.TRUE.equals(redisTemplate.hasKey(blacklistKey))) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Token is blacklisted");
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
