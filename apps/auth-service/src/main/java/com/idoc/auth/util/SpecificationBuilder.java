package com.idoc.auth.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;

public class SpecificationBuilder<T> {

  private final List<String> queryFields;
  private final List<String> likeFields;
  private final Map<String, String> manyToManyFields;

  public SpecificationBuilder(List<String> queryFields, List<String> likeFields, Map<String, String> manyToManyFields) {
    this.queryFields = queryFields != null ? queryFields : List.of();
    this.likeFields = likeFields != null ? likeFields : List.of();
    this.manyToManyFields = manyToManyFields != null ? manyToManyFields : Map.of();
  }

  /**
   * Builds a Specification based on the provided filter map.
   * 
   * @param filter - a map where keys are field names and values are the filter
   *               criteria
   * @return a Specification object representing the combined filter criteria
   */
  public Specification<T> build(Map<String, Object> filter) {
    if (filter == null || filter.isEmpty()) {
      return (root, query, cb) -> cb.conjunction();
    }

    return filter.entrySet().stream()
        .filter(e -> e.getValue() != null && !e.getValue().toString().isEmpty())
        .map(e -> buildFieldSpec(e.getKey(), e.getValue()))
        .reduce(Specification::and)
        .orElse((root, query, cb) -> cb.conjunction());
  }

  /**
   * Builds a Specification for a single field based on the provided key and
   * value.
   * Supports multiple values separated by commas.
   * 
   * @param key   - the field name
   * @param value - the filter criteria, can be a single value or multiple values
   *              separated by commas
   * @return a Specification object for the given field
   */
  private Specification<T> buildFieldSpec(String key, Object value) {
    if ("query".equals(key) && queryFields != null && !queryFields.isEmpty()) {
      String q = value.toString();
      return (root, query, cb) -> {
        Predicate[] predicates = queryFields.stream()
            .map(field -> cb.like(cb.lower(root.get(field)), "%" + q.toLowerCase() + "%"))
            .toArray(Predicate[]::new);
        return cb.or(predicates);
      };
    }
    if (manyToManyFields.containsKey(key)) {
      String relatedField = manyToManyFields.get(key);
      String[] values = value.toString().split(",");
      return (root, query, cb) -> {
        var join = root.join(key);
        Predicate[] predicates = Arrays.stream(values)
            .map(v -> cb.equal(join.get(relatedField), v.trim()))
            .toArray(Predicate[]::new);
        return cb.or(predicates);
      };
    }
    String[] values = value.toString().split(",");
    return (root, query, cb) -> {
      Predicate[] predicates = Arrays.stream(values)
          .map(v -> {
            if (likeFields != null && likeFields.contains(key) && root.get(key).getJavaType().equals(String.class)) {
              return cb.like(cb.lower(root.get(key)), "%" + v.trim().toLowerCase() + "%");
            } else {
              return cb.equal(root.get(key), v.trim());
            }
          })
          .toArray(Predicate[]::new);
      return cb.or(predicates);
    };
  }

  public static class Builder<T> {
    private final List<String> queryFields = new ArrayList<>();
    private final List<String> likeFields = new ArrayList<>();
    private final Map<String, String> manyToManyFields = new HashMap<>();

    public Builder<T> queryFields(String... fields) {
      this.queryFields.addAll(Arrays.asList(fields));
      return this;
    }

    public Builder<T> likeFields(String... fields) {
      this.likeFields.addAll(Arrays.asList(fields));
      return this;
    }

    public Builder<T> manyToManyField(String field, String relatedField) {
      this.manyToManyFields.put(field, relatedField);
      return this;
    }

    public SpecificationBuilder<T> build() {
      return new SpecificationBuilder<>(queryFields, likeFields, manyToManyFields);
    }
  }

  public static <T> Builder<T> builder() {
    return new Builder<>();
  }
}
