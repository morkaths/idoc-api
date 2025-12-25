package com.idoc.auth.core;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface BaseService<Request, Response, Entity, ID> {
    List<Response> getAll();
    Page<Response> search(Pageable pageable, Specification<Entity> spec);
    Response getById(ID id);
    Response save(Request request);
    Response partial(ID id, Map<String, Object> fields);
    boolean delete(ID id);
}
