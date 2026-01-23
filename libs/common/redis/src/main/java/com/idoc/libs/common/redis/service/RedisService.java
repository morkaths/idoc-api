package com.idoc.libs.common.redis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
public class RedisService {
    private static final Logger log = LoggerFactory.getLogger(RedisService.class);
    private final RedisTemplate<String, Object> redisTemplate;

    public RedisService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Lưu key-value vào Redis.
     *
     * @param key   Khóa
     * @param value Giá trị
     */
    public void set(String key, Object value) {
        try {
            redisTemplate.opsForValue().set(key, value);
        } catch (Exception e) {
            log.error("Lỗi khi set key {} vào Redis: {}", key, e.getMessage());
        }
    }

    /**
     * Lưu key-value vào Redis với thời gian hết hạn.
     *
     * @param key     Khóa
     * @param value   Giá trị
     * @param timeout Thời gian tồn tại
     * @param unit    Đơn vị thời gian
     */
    public void set(String key, Object value, long timeout, TimeUnit unit) {
        try {
            redisTemplate.opsForValue().set(key, value, timeout, unit);
        } catch (Exception e) {
            log.error("Lỗi khi set key {} với timeout vào Redis: {}", key, e.getMessage());
        }
    }

    /**
     * Lưu key-value vào Redis với thời gian hết hạn (Duration).
     *
     * @param key      Khóa
     * @param value    Giá trị
     * @param duration Thời gian tồn tại (Duration)
     */
    public void set(String key, Object value, Duration duration) {
        try {
            redisTemplate.opsForValue().set(key, value, duration);
        } catch (Exception e) {
            log.error("Lỗi khi set key {} với duration vào Redis: {}", key, e.getMessage());
        }
    }

    /**
     * Lấy giá trị từ Redis.
     *
     * @param key Khóa
     * @return Object giá trị hoặc null nếu không tìm thấy
     */
    public Object get(String key) {
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            log.error("Lỗi khi get key {} từ Redis: {}", key, e.getMessage());
            return null;
        }
    }

    /**
     * Xóa key khỏi Redis.
     *
     * @param key Khóa
     */
    public void delete(String key) {
        try {
            redisTemplate.delete(key);
        } catch (Exception e) {
            log.error("Lỗi khi delete key {} khỏi Redis: {}", key, e.getMessage());
        }
    }

    /**
     * Kiểm tra key có tồn tại không.
     *
     * @param key Khóa
     * @return true nếu tồn tại, ngược lại false
     */
    public boolean hasKey(String key) {
        try {
            Boolean hasKey = redisTemplate.hasKey(key);
            return hasKey != null && hasKey;
        } catch (Exception e) {
            log.error("Lỗi khi kiểm tra key {} trong Redis: {}", key, e.getMessage());
            return false;
        }
    }

    /**
     * Thiết lập thời gian hết hạn cho key.
     *
     * @param key     Khóa
     * @param timeout Thời gian tồn tại
     * @param unit    Đơn vị thời gian
     * @return true nếu thành công
     */
    public boolean expire(String key, long timeout, TimeUnit unit) {
        try {
            Boolean result = redisTemplate.expire(key, timeout, unit);
            return result != null && result;
        } catch (Exception e) {
            log.error("Lỗi khi set expire cho key {}: {}", key, e.getMessage());
            return false;
        }
    }
}
