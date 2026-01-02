package com.idoc.statistics.core;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface BaseService<Request, Response, Entity, ID> {
    Page<Response> paginate(Pageable pageable, Specification<Entity> spec);
    List<Response> findAll();
    Response findById(ID id);
    List<Response> findAllByIds(List<ID> ids);
    Response save(Request request);
    Response partial(ID id, Map<String, Object> fields);
    boolean delete(ID id);
}
