package com.idoc.auth.core;

import java.util.Map;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;

public class BaseSpecification {
    public static <T> Specification<T> filter(Map<String, Object> filter, String... searchFields) {
        return (root, query, cb) -> {
            Predicate predicate = cb.conjunction();

            if (filter == null)
                return predicate;

            if (filter.containsKey("query") && searchFields != null) {
                String q = "%" + filter.get("query").toString().toLowerCase() + "%";
                Predicate orPredicate = cb.disjunction();
                for (String field : searchFields) {
                    orPredicate = cb.or(orPredicate, cb.like(cb.lower(root.get(field)), q));
                }
                predicate = cb.and(predicate, orPredicate);
            }

            for (Map.Entry<String, Object> entry : filter.entrySet()) {
                String key = entry.getKey();
                Object value = entry.getValue();
                if (!key.equals("query") && value != null && !value.toString().isEmpty()) {
                    predicate = cb.and(predicate, cb.equal(root.get(key), value));
                }
            }
            return predicate;
        };
    }
}
