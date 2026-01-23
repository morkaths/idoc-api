package com.idoc.statistics;

import com.idoc.statistics.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
@ComponentScan(basePackages = { "com.idoc.statistics", "com.idoc.libs.common.security" })
public class StatisticsServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(StatisticsServiceApplication.class, args);
	}

}
