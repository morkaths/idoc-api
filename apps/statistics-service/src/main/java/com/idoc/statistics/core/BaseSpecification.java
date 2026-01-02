package com.idoc.statistics.core;

import java.util.List;
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
                String queryValue = filter.get("query").toString().trim();
                if (!queryValue.isEmpty()) {
                    String q = "%" + queryValue.toLowerCase() + "%";
                    Predicate orPredicate = cb.disjunction();
                    for (String field : searchFields) {
                        orPredicate = cb.or(orPredicate, cb.like(cb.lower(root.get(field)), q));
                    }
                    predicate = cb.and(predicate, orPredicate);
                }
            }

            for (Map.Entry<String, Object> entry : filter.entrySet()) {
                String key = entry.getKey();
                Object value = entry.getValue();
                if (List.of("query", "sortBy", "sortOrder", "page", "limit").contains(key)) continue;
                if (value != null && !value.toString().isEmpty()) {
                    predicate = cb.and(predicate, cb.equal(root.get(key), value));
                }
            }
            return predicate;
        };
    }
}
