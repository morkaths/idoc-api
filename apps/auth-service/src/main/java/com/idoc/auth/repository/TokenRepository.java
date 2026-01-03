package com.idoc.auth.repository;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class TokenRepository {
    private final StringRedisTemplate redisTemplate;

    static final String REFRESH_TOKEN_PREFIX = "user:refresh:";
    static final String REFRESH_BLACKLIST_PREFIX = "blacklist:refresh:";
    static final String ACCESS_BLACKLIST_PREFIX = "blacklist:access:";

    @Value("${jwt.refreshable-duration}")
    private long jwtRefreshExpiration;

    public TokenRepository(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void saveSession(String userId, String refreshToken) {
        String refreshKey = REFRESH_TOKEN_PREFIX + userId;
        redisTemplate.opsForValue().set(refreshKey, refreshToken, jwtRefreshExpiration, TimeUnit.SECONDS);
    }

    public String findSession(String userId) {
        return redisTemplate.opsForValue().get(REFRESH_TOKEN_PREFIX + userId);
    }

    public void removeSession(String userId) {
        redisTemplate.delete(REFRESH_TOKEN_PREFIX + userId);
    }

    public void revokeToken(String jti, long ttlInMillis) {
        String key = ACCESS_BLACKLIST_PREFIX + jti;
        redisTemplate.opsForValue().set(key, "blacklisted", ttlInMillis, TimeUnit.MILLISECONDS);
    }

    public boolean isRefreshTokenBlacklisted(String refreshToken) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(REFRESH_BLACKLIST_PREFIX + refreshToken));
    }

    public boolean isAccessTokenBlacklisted(String jti) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(ACCESS_BLACKLIST_PREFIX + jti));
    }
}