package com.idoc.auth.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.idoc.auth.constant.RoleConstants;
import com.idoc.auth.constant.SecurityConstants;
import com.idoc.auth.security.handler.CustomAccessDeniedHandler;
import com.idoc.auth.security.handler.CustomUnauthorizedHandler;
import com.idoc.auth.security.jwt.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final CustomUnauthorizedHandler unauthorizedHandler;
	private final CustomAccessDeniedHandler accessDeniedHandler;

	public WebSecurityConfig(
			JwtAuthenticationFilter jwtAuthenticationFilter,
			CustomUnauthorizedHandler unauthorizedHandler,
			CustomAccessDeniedHandler accessDeniedHandler) {
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
		this.unauthorizedHandler = unauthorizedHandler;
		this.accessDeniedHandler = accessDeniedHandler;
	}

	/**
	 * Configure HttpSecurity for the application.
	 * 
	 * @param http - HttpSecurity
	 * @return SecurityFilterChain
	 * @throws Exception - if an error occurs
	 */
	@Bean
	public SecurityFilterChain applicationSecurity(HttpSecurity http) throws Exception {

		// Disable CORS, CSRF, Form Login, Session Management
		http.csrf(AbstractHttpConfigurer::disable).formLogin(AbstractHttpConfigurer::disable)
				.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		// Configure exception handling
		http.exceptionHandling(ex -> ex
				.authenticationEntryPoint(unauthorizedHandler)
				.accessDeniedHandler(accessDeniedHandler));

		// Add JWT Authentication Filter
		http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		// Configure route authorization
		http.authorizeHttpRequests(registry -> registry
				.requestMatchers(SecurityConstants.PUBLIC_ROUTES).permitAll()
				.requestMatchers("/api/roles/**").authenticated()
				.requestMatchers("/api/permissions/**").hasRole(RoleConstants.ADMIN)
				.anyRequest().denyAll());

		return http.build();
	}

	/**
	 * Password encoder bean using BCrypt.
	 * 
	 * @return PasswordEncoder
	 */
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	// @Bean
	// public CorsConfigurationSource
	// corsConfigurationSource(@Value("${cors.allowed-origins}") String
	// allowedOrigins) {
	// CorsConfiguration configuration = new CorsConfiguration();
	// for (String origin : allowedOrigins.split(",")) {
	// configuration.addAllowedOrigin(origin.trim());
	// }
	// configuration.addAllowedMethod("*");
	// configuration.addAllowedHeader("*");
	// configuration.setAllowCredentials(true);
	// UrlBasedCorsConfigurationSource source = new
	// UrlBasedCorsConfigurationSource();
	// source.registerCorsConfiguration("/**", configuration);
	// return source;
	// }

	/**
	 * Configure AuthenticationManager with custom UserDetailsService and
	 * PasswordEncoder.
	 * 
	 * @param http - HttpSecurity
	 * @return AuthenticationManager
	 * @throws Exception - if an error occurs
	 */
	// @Bean
	// public AuthenticationManager authenticationManager(HttpSecurity http) throws
	// Exception {
	// AuthenticationManagerBuilder builder =
	// http.getSharedObject(AuthenticationManagerBuilder.class);
	// builder.userDetailsService(customUserDetailService).passwordEncoder(passwordEncoder());
	// return builder.build();
	// }

	/**
	 * Alternative method to get AuthenticationManager from
	 * AuthenticationConfiguration.
	 * 
	 * @param configuration - AuthenticationConfiguration
	 * @return AuthenticationManager
	 * @throws Exception - if an error occurs
	 */
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}
}
