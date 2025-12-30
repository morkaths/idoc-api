package com.idoc.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.idoc.auth.entity.RoleEntity;

public interface RoleRepository extends JpaRepository<RoleEntity, Long>, JpaSpecificationExecutor<RoleEntity> {
	
	boolean existsByCode(String code);

	RoleEntity findByCode(String code);

	RoleEntity findByName(String name);
}