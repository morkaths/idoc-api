package com.idoc.auth.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.idoc.auth.constant.query.PermissionQuery;
import com.idoc.auth.entity.PermissionEntity;

public interface PermissionRepository extends JpaRepository<PermissionEntity, Long> {
	boolean existsByCode(String code);

	PermissionEntity findByCode(String code);

	PermissionEntity findByName(String name);

	@Query(PermissionQuery.FIND_BY_ROLE_ID)
	List<PermissionEntity> findByRoleId(@Param("roleId") Long roleId);

}
