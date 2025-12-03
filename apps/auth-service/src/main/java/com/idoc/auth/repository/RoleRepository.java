package com.idoc.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.idoc.auth.entity.RoleEntity;

public interface RoleRepository extends JpaRepository<RoleEntity, Long> {
	boolean existsByCode(String code);

	RoleEntity findByCode(String code);

	RoleEntity findByName(String name);
}