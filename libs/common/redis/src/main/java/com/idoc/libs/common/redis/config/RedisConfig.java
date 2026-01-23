package com.idoc.libs.common.redis.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class RedisConfig {

    @Value("${spring.data.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.data.redis.port:6379}")
    private int redisPort;

    @Value("${spring.data.redis.password:}")
    private String redisPassword;

    @Value("${spring.data.redis.database:0}")
    private int redisDatabase;

    @Bean
    public org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory lettuceConnectionFactory() {
        org.springframework.data.redis.connection.RedisStandaloneConfiguration configuration = new org.springframework.data.redis.connection.RedisStandaloneConfiguration();
        configuration.setHostName(redisHost);
        configuration.setPort(redisPort);
        configuration.setDatabase(redisDatabase);
        if (redisPassword != null && !redisPassword.isBlank()) {
            configuration.setPassword(redisPassword);
        }

        org.apache.commons.pool2.impl.GenericObjectPoolConfig<?> poolConfig = new org.apache.commons.pool2.impl.GenericObjectPoolConfig<>();
        poolConfig.setMaxWait(java.time.Duration.ofSeconds(3));
        poolConfig.setMaxIdle(8);
        poolConfig.setMinIdle(4);
        poolConfig.setMaxTotal(50);

        org.springframework.data.redis.connection.lettuce.LettucePoolingClientConfiguration poolingClientConfiguration =
                org.springframework.data.redis.connection.lettuce.LettucePoolingClientConfiguration.builder()
                        .commandTimeout(java.time.Duration.ofSeconds(3))
                        .poolConfig(poolConfig)
                        .build();

        return new org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory(configuration, poolingClientConfiguration);
    }

    @Bean
    public org.springframework.data.redis.core.StringRedisTemplate stringRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
        org.springframework.data.redis.core.StringRedisTemplate stringRedisTemplate = new org.springframework.data.redis.core.StringRedisTemplate();
        stringRedisTemplate.setConnectionFactory(redisConnectionFactory);
        return stringRedisTemplate;
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.activateDefaultTyping(
                LaissezFaireSubTypeValidator.instance,
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY
        );

        GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(objectMapper);

        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());

        template.setValueSerializer(serializer);
        template.setHashValueSerializer(serializer);

        template.afterPropertiesSet();
        return template;
    }
}
