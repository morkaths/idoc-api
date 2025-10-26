package com.idoc.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.idoc.auth.constant.query.UserQuery;
import com.idoc.auth.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long>, JpaSpecificationExecutor<UserEntity> {
	boolean existsByUsername(String username);

	boolean existsByEmail(String email);

	UserEntity findByUsername(String username);

	UserEntity findByEmail(String email);

	UserEntity findOneByUsernameAndStatus(String username, int status);

	@Query(UserQuery.FIND_BY_USERNAME_OR_EMAIL)
	UserEntity findByUsernameOrEmail(@Param("identifier") String identifier);

	@Query(UserQuery.FIND_BY_USERNAME_WITH_ROLES_AND_PERMISSIONS)
	UserEntity findByUsernameWithRolesAndPermissions(@Param("username") String username);
}
