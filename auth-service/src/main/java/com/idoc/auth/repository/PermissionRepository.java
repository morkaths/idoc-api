package com.idoc.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.idoc.auth.entity.PermissionEntity;

public interface PermissionRepository extends JpaRepository<PermissionEntity, Long> {
	PermissionEntity findByCode(String code);
	PermissionEntity findByName(String name);
}
