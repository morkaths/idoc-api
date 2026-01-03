package com.idoc.auth.security.jwt;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.idoc.auth.constant.Common;
import com.idoc.auth.repository.TokenRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	@Autowired
	private TokenRepository tokenRepository;

	/**
	 * Filter method to authenticate requests based on JWT tokens.
	 * 
	 * @param request     - HTTP request
	 * @param response    - HTTP response
	 * @param filterChain - Filter chain
	 * @throws ServletException - if a servlet error occurs
	 * @throws IOException      - if an I/O error occurs
	 */
	@Override
	protected void doFilterInternal(
			@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain)
			throws ServletException, IOException {

		Optional<String> tokenOpt = extractToken(request);
		if (tokenOpt.isPresent()) {
			String token = tokenOpt.get();
			DecodedJWT jwt = jwtTokenProvider.decodeToken(token);

			if (jwt != null) {
				if (tokenRepository.isAccessTokenBlacklisted(jwt.getId())) {
					SecurityContextHolder.clearContext();
					filterChain.doFilter(request, response);
					return;
				}
				UsernamePasswordAuthenticationToken authentication = buildAuthentication(jwt, token);
				SecurityContextHolder.getContext().setAuthentication(authentication);
			} else {
				SecurityContextHolder.clearContext(); // Token không hợp lệ, clear context
			}
		}
		filterChain.doFilter(request, response);
	}

	/**
	 * Extract JWT token from the request header.
	 * 
	 * @param request - HTTP request
	 * @return Optional containing the token if present, otherwise empty
	 */
	private Optional<String> extractToken(HttpServletRequest request) {
		String token = request.getHeader(Common.HEADER_STRING);
		if (StringUtils.hasText(token) && token.startsWith(Common.TOKEN_PREFIX)) {
			return Optional.of(token.substring(7));
		}
		return Optional.empty();
	}

	/**
	 * Build Authentication object from Decoded JWT.
	 * 
	 * @param jwt - Decoded JWT token
	 * @return UsernamePasswordAuthenticationToken representing the authenticated
	 *         user
	 */
	private UsernamePasswordAuthenticationToken buildAuthentication(DecodedJWT jwt, String token) {
		Long userId = Long.valueOf(jwt.getSubject());
		String username = jwt.getClaim("username").asString();
		String email = jwt.getClaim("email").asString();
		List<String> roles = jwt.getClaim("roles").asList(String.class);
		List<String> permissions = jwt.getClaim("permissions").asList(String.class);
		List<SimpleGrantedAuthority> authorities = new ArrayList<>();
		if (roles != null) {
			authorities.addAll(roles.stream()
					.map(role -> new SimpleGrantedAuthority("ROLE_" + role))
					.collect(Collectors.toList()));
		}
		if (permissions != null) {
			authorities.addAll(permissions.stream()
					.map(permission -> new SimpleGrantedAuthority(permission))
					.collect(Collectors.toList()));
		}
		JwtTokenRequest principal = new JwtTokenRequest(userId, username, email, roles, permissions);
		return new UsernamePasswordAuthenticationToken(principal, token, authorities);
	}

}
