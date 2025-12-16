package com.idoc.auth.spec;

import java.util.Map;

import org.springframework.data.jpa.domain.Specification;

import com.idoc.auth.core.BaseSpecification;
import com.idoc.auth.entity.RoleEntity;

public class RoleSpecification {
    public static Specification<RoleEntity> filter(Map<String, Object> filter) {
        return BaseSpecification.filter(filter, "name", "code");
    }
}
