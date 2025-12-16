package com.idoc.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.idoc.auth.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long>, JpaSpecificationExecutor<UserEntity> {
	
	boolean existsByUsername(String username);

	boolean existsByEmail(String email);

	UserEntity findByUsername(String username);

	UserEntity findByEmail(String email);

	UserEntity findOneByUsernameAndStatus(String username, int status);

	@Query("""
			SELECT u FROM UserEntity u
			LEFT JOIN FETCH u.roles r
			LEFT JOIN FETCH r.permissions
			WHERE u.username = :identifier OR u.email = :identifier
			""")
	UserEntity findByUsernameOrEmail(@Param("identifier") String identifier);

	@Query("""
			SELECT u FROM UserEntity u
			LEFT JOIN FETCH u.roles r
			LEFT JOIN FETCH r.permissions
			WHERE u.username = :username
			""")
	UserEntity findByUsernameWithRolesAndPermissions(@Param("username") String username);
}
