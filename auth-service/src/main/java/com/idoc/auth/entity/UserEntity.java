package com.idoc.auth.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;

import com.idoc.auth.core.BaseEntity;

@Entity
@Table(name = "user")
public class UserEntity extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "username", nullable = false, unique = true, length = 100)
	private String username;

	@Column(name = "password", nullable = false)
	private String password;

	@Column(name = "email", nullable = false, unique = true, length = 255)
	private String email;

	@Column(name = "status", nullable = false)
	private int status;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
	private Set<RoleEntity> roles = new HashSet<>();

	public UserEntity() {
		super();
		// TODO Auto-generated constructor stub
	}

	public UserEntity(String username, String password, String email, int status, Set<RoleEntity> roles) {
		super();
		this.username = username;
		this.password = password;
		this.email = email;
		this.status = status;
		this.roles = roles;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public Set<RoleEntity> getRoles() {
		return roles;
	}

	public void setRoles(Set<RoleEntity> roles) {
		this.roles = roles;
	}

	public Long getId() {
		return id;
	}

}
