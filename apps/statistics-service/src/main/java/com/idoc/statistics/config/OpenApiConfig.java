package com.idoc.statistics.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Statistics Service API")
                        .description("API documentation for the Auth Service")
                        .version("1.0.0")
                        .termsOfService("https://idoc.com/terms")
                        .contact(new Contact()
                                .name("iDoc Team")
                                .email("support@idoc.com")
                                .url("https://idoc.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")))
                .servers(List.of(
                        new Server().url("http://localhost:8085").description("Local server"),
                        new Server().url("http://localhost:8000").description("Gateway server"),
                        new Server().url("https://api.idoc.com").description("Production server")))
                .addSecurityItem(new SecurityRequirement()
                        .addList("bearerAuth")
                        .addList("apiKeyAuth"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .in(SecurityScheme.In.HEADER)
                                        .name("Authorization"))
                        .addSecuritySchemes("apiKeyAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.HEADER)
                                        .name("x-api-key")));
    }
}
