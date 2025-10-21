package com.idoc.auth.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;

@Entity
@Table(name = "permission")
public class PermissionEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "code", nullable = false, unique = true, length = 100)
	private String code;
	
	@Column(name = "name", nullable = false, length = 255)
	private String name;
	
	@ManyToMany(mappedBy = "permissions")
	private Set<RoleEntity> roles = new HashSet<>();

}
