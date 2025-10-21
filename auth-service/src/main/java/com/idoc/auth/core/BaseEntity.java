package com.idoc.auth.core;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.*;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
	
	@CreatedDate
	@Column(name = "created_at", nullable = true, updatable = false)
    private LocalDateTime createdAt;
    
	@LastModifiedDate
    @Column(name = "modified_at", nullable = true)
    private LocalDateTime modifiedAt;
	
	@LastModifiedBy
	@Column(name = "modified_by", nullable = true, length = 100)
	private String modifiedBy;
	
	public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getModifiedAt() {
		return modifiedAt;
    }

	public String getModifiedBy() {
		return modifiedBy;
	}
    
}
