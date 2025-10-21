package com.idoc.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.idoc.auth.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
	boolean existsByUsername(String username);
	boolean existsByEmail(String email);
	UserEntity findByUsername(String username);
	UserEntity findByEmail(String email);
	UserEntity findOneByUsernameAndStatus(String username, int status);
}
