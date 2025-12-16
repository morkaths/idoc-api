package com.idoc.auth.spec;

import java.util.Map;

import org.springframework.data.jpa.domain.Specification;

import com.idoc.auth.core.BaseSpecification;
import com.idoc.auth.entity.PermissionEntity;

public class PermissionSpecification {
    public static Specification<PermissionEntity> filter(Map<String, Object> filter) {
        return BaseSpecification.filter(filter, "name", "code");
    }
}
