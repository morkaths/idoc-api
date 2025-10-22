package com.idoc.auth.security.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.idoc.auth.security.handler.CustomAccessDeniedHandler;
import com.idoc.auth.security.handler.CustomUnauthorizedHandler;
import com.idoc.auth.security.jwt.JwtAuthenticationFilter;
import com.idoc.auth.security.service.CustomUserDetailService;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final CustomUserDetailService customUserDetailService;
	private final CustomUnauthorizedHandler unauthorizedHandler;
	private final CustomAccessDeniedHandler accessDeniedHandler;

	@Autowired
	public WebSecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
			CustomUserDetailService customUserDetailService, CustomUnauthorizedHandler unauthorizedHandler,
			CustomAccessDeniedHandler accessDeniedHandler) {
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
		this.customUserDetailService = customUserDetailService;
		this.unauthorizedHandler = unauthorizedHandler;
		this.accessDeniedHandler = accessDeniedHandler;
	}

	@Bean
	public SecurityFilterChain applicationSecurity(HttpSecurity http) throws Exception {
		http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		http.csrf(AbstractHttpConfigurer::disable)
				.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.formLogin(AbstractHttpConfigurer::disable)
				.exceptionHandling(
						ex -> ex.authenticationEntryPoint(unauthorizedHandler).accessDeniedHandler(accessDeniedHandler))
				.authorizeHttpRequests(registry -> registry.requestMatchers("/api/auth/**").permitAll()
						.requestMatchers("/api/**").authenticated().anyRequest().denyAll());
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
