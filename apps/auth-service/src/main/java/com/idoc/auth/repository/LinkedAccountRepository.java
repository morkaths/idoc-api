package com.idoc.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.idoc.auth.entity.LinkedAccountEntity;

@Repository
public interface LinkedAccountRepository extends JpaRepository<LinkedAccountEntity, Long> {
    Optional<LinkedAccountEntity> findByProviderAndProviderId(String provider, String providerId);
}
