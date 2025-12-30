package com.idoc.auth.dto.request;

import java.util.Set;

public class RoleRequest {
    private Long id;
    private String code;
    private String name;
    private Set<Long> permissionIds;

    public RoleRequest() {
    }

    public RoleRequest(Long id, String code, String name, Set<Long> permissionIds) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.permissionIds = permissionIds;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Long> getPermissionIds() {
        return permissionIds;
    }

    public void setPermissionIds(Set<Long> permissionIds) {
        this.permissionIds = permissionIds;
    }

}
