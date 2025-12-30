package com.idoc.auth.dto.request;

import java.util.Set;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public class UserRequest {

    private Long id;

    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters long")
    private String username;

    @Email(message = "Email is not valid")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    private int status;

    private Set<Long> roleIds;

    public UserRequest() {
    }

    public UserRequest(Long id, String username, String email, String password, int status) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Set<Long> getRoleIds() {
        return roleIds;
    }

    public void setRoleIds(Set<Long> roleIds) {
        this.roleIds = roleIds;
    }

}