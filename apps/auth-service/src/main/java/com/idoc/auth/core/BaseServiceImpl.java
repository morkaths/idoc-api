package com.idoc.auth.core;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.fasterxml.jackson.databind.ObjectMapper;

public abstract class BaseServiceImpl<T, E, ID> implements BaseService<T, ID> {

  protected final JpaRepository<E, ID> repository;
  protected final BaseMapper<E, T> mapper;

  @Autowired
  protected ObjectMapper objectMapper;

  public BaseServiceImpl(JpaRepository<E, ID> repository, BaseMapper<E, T> mapper) {
    this.repository = repository;
    this.mapper = mapper;
  }

  @Override
  public List<T> findAll() {
    List<E> entities = repository.findAll();
    return entities.stream()
        .map(mapper::toDto)
        .toList();
  }

  @Override
  public Page<T> findAll(Pageable pageable) {
    Page<E> entities = repository.findAll(pageable);
    return entities.map(mapper::toDto);
  }

  @Override
  public T findById(ID id) {
    return repository.findById(id)
        .map(mapper::toDto)
        .orElseThrow(() -> new IllegalArgumentException("Entity not found with id: " + id));
  }

  @Override
  public T create(T dto) {
    try {
      E entity = repository.save(mapper.toEntity(dto));
      return mapper.toDto(entity);
    } catch (DataIntegrityViolationException ex) {
      throw ex;
    } catch (Exception ex) {
      throw new RuntimeException("Unknown error when saving entity", ex);
    }
  }

  @Override
  public T update(T dto) {
    try {
      E entity = repository.save(mapper.toEntity(dto));
      return mapper.toDto(entity);
    } catch (DataIntegrityViolationException ex) {
      throw ex;
    } catch (Exception ex) {
      throw new RuntimeException("Unknown error when saving entity", ex);
    }
  }

  @Override
  public T partialUpdate(ID id, Map<String, Object> fields) {
    E entity = repository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Entity with id " + id + " does not exist"));
    mapper.partialUpdateEntity(objectMapper, fields, entity);
    E saved = repository.save(entity);
    return mapper.toDto(saved);
  }

  @Override
  public boolean delete(ID id) {
    if (repository.existsById(id)) {
      repository.deleteById(id);
      return true;
    }
    return false;
  }

}
