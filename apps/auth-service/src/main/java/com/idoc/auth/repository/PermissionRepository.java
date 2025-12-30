package com.idoc.auth.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.idoc.auth.entity.PermissionEntity;

public interface PermissionRepository extends JpaRepository<PermissionEntity, Long>, JpaSpecificationExecutor<PermissionEntity> {

	boolean existsByCode(String code);

	PermissionEntity findByCode(String code);

	PermissionEntity findByName(String name);

	@Query("""
			SELECT p FROM PermissionEntity p
			JOIN p.roles r
			WHERE r.id = :roleId
			""")
	List<PermissionEntity> findByRoleId(@Param("roleId") Long roleId);

}
