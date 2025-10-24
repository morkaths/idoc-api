package com.idoc.auth.model;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import com.idoc.auth.entity.UserEntity;

public class AuthUser extends User {

	private static final long serialVersionUID = 1L;
	private Long id;
	private String email;

	public AuthUser(UserEntity user, Collection<? extends GrantedAuthority> authorities) {
		super(user.getUsername(), user.getPassword(), user.getStatus() == 1, true, true, true, authorities);
		this.id = user.getId();
		this.email = user.getEmail();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

}
