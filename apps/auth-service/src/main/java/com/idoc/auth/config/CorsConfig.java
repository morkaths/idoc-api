package com.idoc.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    private final AppProperties appProperties;

    public CorsConfig(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String[] origins = appProperties.getCors().getAllowedOrigins().toArray(new String[0]);
                registry.addMapping("/**")
                        .allowedOrigins(origins)
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}