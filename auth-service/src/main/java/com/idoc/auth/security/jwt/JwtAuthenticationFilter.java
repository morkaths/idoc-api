package com.idoc.auth.security.jwt;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
	
	@Autowired
	private JwtTokenProvider jwtTokenProvider;
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		extractToken(request)
        	.map(jwtTokenProvider::decodeToken)
        	.filter(jwt -> jwt != null)
        	.map(jwt -> {
				Long userId = jwt.getClaim("userId").asLong();
				String username = jwt.getClaim("username").asString();
				String email = jwt.getClaim("email").asString();
				List<String> roles = jwt.getClaim("roles").asList(String.class);
                List<SimpleGrantedAuthority> authorities = roles != null
	                ? roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList())
	                : List.of();
                JwtTokenRequest principal = new JwtTokenRequest(userId, username, email, roles);
                return new UsernamePasswordAuthenticationToken(principal, null, authorities);
            })
        	.ifPresent(authentication -> SecurityContextHolder.getContext().setAuthentication(authentication));
		filterChain.doFilter(request, response);
	}

	private Optional<String> extractToken(HttpServletRequest request) {
		var token = request.getHeader("Authorization");
		if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
            return Optional.of(token.substring(7));
		}
		return Optional.empty();
	}
}
