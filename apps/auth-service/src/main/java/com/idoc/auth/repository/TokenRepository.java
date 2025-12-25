package com.idoc.auth.repository;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class TokenRepository {
    private final StringRedisTemplate redisTemplate;

    static final String ACCESS_TOKEN_PREFIX = "user:access:";
    static final String REFRESH_TOKEN_PREFIX = "user:refresh:";
    static final String ACCESS_BLACKLIST_PREFIX = "blacklist:access:";
    static final String REFRESH_BLACKLIST_PREFIX = "blacklist:refresh:";

    @Value("${spring.jwt.expired-duration}")
    private long jwtExpiration;

    @Value("${spring.jwt.refreshable-duration}")
    private long jwtRefreshExpiration;

    public TokenRepository(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void storeToken(String userId, String accessToken, String refreshToken) {
        String accessKey = ACCESS_TOKEN_PREFIX + userId;
        redisTemplate.opsForValue().set(accessKey, accessToken, jwtExpiration, TimeUnit.SECONDS);

        String refreshKey = REFRESH_TOKEN_PREFIX + userId;
        redisTemplate.opsForValue().set(refreshKey, refreshToken, jwtRefreshExpiration, TimeUnit.SECONDS);
    }

    public String getAccessToken(String userId) {
        return redisTemplate.opsForValue().get(ACCESS_TOKEN_PREFIX + userId);
    }

    public String getRefreshToken(String userId) {
        return redisTemplate.opsForValue().get(REFRESH_TOKEN_PREFIX + userId);
    }

    public void removeAllToken(String userId) {
        String accessToken = getAccessToken(userId);
        String refreshToken = getRefreshToken(userId);

        redisTemplate.delete(ACCESS_TOKEN_PREFIX + userId);
        redisTemplate.delete(REFRESH_TOKEN_PREFIX + userId);

        if (accessToken != null) {
            blacklistAccessToken(accessToken);
        }
        if (refreshToken != null) {
            blacklistRefreshToken(refreshToken);
        }
    }

    public void removeAccessToken(String userId) {
        String accessToken = getAccessToken(userId);
        redisTemplate.delete(ACCESS_TOKEN_PREFIX + userId);
        if (accessToken != null) {
            blacklistAccessToken(accessToken);
        }
    }

    private void blacklistAccessToken(String accessToken) {
        String key = ACCESS_BLACKLIST_PREFIX + accessToken;
        redisTemplate.opsForValue().set(key, "blacklisted", jwtExpiration, TimeUnit.SECONDS);
    }

    private void blacklistRefreshToken(String refreshToken) {
        String key = REFRESH_BLACKLIST_PREFIX + refreshToken;
        redisTemplate.opsForValue().set(key, "blacklisted", jwtRefreshExpiration, TimeUnit.SECONDS);
    }

    public boolean isAccessTokenBlacklisted(String accessToken) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(ACCESS_BLACKLIST_PREFIX + accessToken));
    }

    public boolean isRefreshTokenBlacklisted(String refreshToken) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(REFRESH_BLACKLIST_PREFIX + refreshToken));
    }
}