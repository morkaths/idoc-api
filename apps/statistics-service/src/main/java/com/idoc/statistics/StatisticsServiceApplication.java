package com.idoc.statistics;

import com.idoc.statistics.security.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class StatisticsServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(StatisticsServiceApplication.class, args);
	}

}
