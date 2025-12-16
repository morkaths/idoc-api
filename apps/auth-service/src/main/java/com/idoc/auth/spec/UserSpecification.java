package com.idoc.auth.spec;

import java.util.Map;

import org.springframework.data.jpa.domain.Specification;

import com.idoc.auth.core.BaseSpecification;
import com.idoc.auth.entity.UserEntity;

public class UserSpecification {
    public static Specification<UserEntity> filter(Map<String, Object> filter) {
        return BaseSpecification.filter(filter, "username", "email");
    }
}
