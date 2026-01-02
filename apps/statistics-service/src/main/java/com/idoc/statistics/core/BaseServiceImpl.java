package com.idoc.statistics.core;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;

public abstract class BaseServiceImpl<Request, Response, Entity, ID>
    implements BaseService<Request, Response, Entity, ID> {

  protected final JpaRepository<Entity, ID> repository;
  protected final JpaSpecificationExecutor<Entity> specificationExecutor;
  protected final BaseMapper<Request, Response, Entity> mapper;

  @Autowired
  protected ObjectMapper objectMapper;

  public BaseServiceImpl(JpaRepository<Entity, ID> repository,
      JpaSpecificationExecutor<Entity> specificationExecutor,
      BaseMapper<Request, Response, Entity> mapper) {
    this.repository = repository;
    this.specificationExecutor = specificationExecutor;
    this.mapper = mapper;
  }

  @Override
  public Page<Response> paginate(Pageable pageable, Specification<Entity> spec) {
    Page<Entity> entities = specificationExecutor.findAll(spec, pageable);
    return entities.map(mapper::toResponse);
  }
  
  @Override
  public List<Response> findAll() {
    List<Entity> entities = repository.findAll();
    return entities.stream()
        .map(mapper::toResponse)
        .toList();
  }

  @Override
  public Response findById(ID id) {
    return repository.findById(id)
        .map(mapper::toResponse)
        .orElseThrow(() -> new IllegalArgumentException("Entity not found with id: " + id));
  }

  @Override
  public List<Response> findAllByIds(List<ID> ids) {
    List<Entity> entities = repository.findAllById(ids);
    return entities.stream().map(mapper::toResponse).collect(Collectors.toList());
  }

  @Override
  @Transactional
  public Response save(Request dto) {
    try {
      Entity entity = repository.save(mapper.toEntity(dto));
      return mapper.toResponse(entity);
    } catch (DataIntegrityViolationException ex) {
      throw ex;
    } catch (Exception ex) {
      throw new RuntimeException("Unknown error when saving entity", ex);
    }
  }

  @Override
  @Transactional
  public Response partial(ID id, Map<String, Object> fields) {
    Entity entity = repository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Entity with id " + id + " does not exist"));
    mapper.partial(objectMapper, fields, entity);
    Entity saved = repository.save(entity);
    return mapper.toResponse(saved);
  }

  @Override
  @Transactional
  public boolean delete(ID id) {
    if (repository.existsById(id)) {
      repository.deleteById(id);
      return true;
    }
    return false;
  }

}
