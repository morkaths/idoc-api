package com.idoc.auth.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.idoc.auth.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long>, JpaSpecificationExecutor<UserEntity> {

	boolean existsByUsername(String username);

	boolean existsByEmail(String email);

	@EntityGraph(attributePaths = { "roles", "roles.permissions" })
	UserEntity findByUsername(String username);

	UserEntity findByEmail(String email);

	UserEntity findOneByUsernameAndStatus(String username, int status);

	@EntityGraph(attributePaths = { "roles", "roles.permissions" })
	@Query("""
			SELECT u FROM UserEntity u
			WHERE u.username = :identifier OR u.email = :identifier
			""")
	UserEntity findByUsernameOrEmail(@Param("identifier") String identifier);

	@EntityGraph(attributePaths = { "roles", "roles.permissions" })
	@Query("""
			SELECT u FROM UserEntity u
			WHERE u.username = :username
			""")
	UserEntity findByUsernameWithRolesAndPermissions(@Param("username") String username);

	// Optimization for Import: Batch check
	List<UserEntity> findByUsernameIn(Collection<String> usernames);

	List<UserEntity> findByEmailIn(Collection<String> emails);

	// Optimization for Export: Fetch with Roles
	@Query("SELECT u FROM UserEntity u LEFT JOIN FETCH u.roles")
	List<UserEntity> findAllWithRoles();
}
