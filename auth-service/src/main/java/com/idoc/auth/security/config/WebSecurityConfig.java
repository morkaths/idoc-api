package com.idoc.auth.security.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.idoc.auth.security.handler.UnauthorizedHandler;
import com.idoc.auth.security.jwt.JwtAuthenticationFilter;
import com.idoc.auth.security.service.CustomUserDetailService;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final CustomUserDetailService customUserDetailService;
	private final UnauthorizedHandler unauthorizedHandler;

	@Autowired
	public WebSecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
			CustomUserDetailService customUserDetailService, UnauthorizedHandler unauthorizedHandler) {
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
		this.customUserDetailService = customUserDetailService;
		this.unauthorizedHandler = unauthorizedHandler;
	}

	@Bean
	public SecurityFilterChain applicationSecurity(HttpSecurity http) throws Exception {
		http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		http.csrf(AbstractHttpConfigurer::disable)
				.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.formLogin(AbstractHttpConfigurer::disable)
				.exceptionHandling(h -> h.authenticationEntryPoint(unauthorizedHandler))
				.authorizeHttpRequests(registry -> registry.requestMatchers("/api/**", "/api/auth/login").permitAll()
						.requestMatchers("/api/admin/**").hasRole("ADMIN").anyRequest().authenticated());
		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

//	@Bean
//	public CorsConfigurationSource corsConfigurationSource(@Value("${cors.allowed-origins}") String allowedOrigins) {
//		CorsConfiguration configuration = new CorsConfiguration();
//		for (String origin : allowedOrigins.split(",")) {
//			configuration.addAllowedOrigin(origin.trim());
//		}
//		configuration.addAllowedMethod("*");
//		configuration.addAllowedHeader("*");
//		configuration.setAllowCredentials(true);
//		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//		source.registerCorsConfiguration("/**", configuration);
//		return source;
//	}

	@Bean
	public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
		var builder = http.getSharedObject(AuthenticationManagerBuilder.class);
		builder.userDetailsService(customUserDetailService).passwordEncoder(passwordEncoder());
		return builder.build();
	}
}
