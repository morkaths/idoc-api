package com.idoc.auth.core;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface BaseService<T, E, ID> {
  List<T> getAll();
  Page<T> search(Pageable pageable, Specification<E> spec);
  T getById(ID id);
  T save(T dto);
  T partial(ID id, Map<String, Object> fields);
  boolean delete(ID id);
}
