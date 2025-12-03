package com.idoc.auth.core;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BaseService<T, ID> {
  List<T> findAll();
  Page<T> findAll(Pageable pageable);
  T findById(ID id);
  T create(T dto);
  T update(T dto);
  T partialUpdate(ID id, Map<String, Object> fields);
  boolean delete(ID id);
}
