package com.idoc.auth.constant;

public enum Permission {
    USER_EDIT("user.edit"),
    USER_DELETE("user.delete");

    private final String value;

    Permission(String value) {
        this.value = value;
    }

    public String authority() {
        return "hasAuthority('" + value + "')";
    }

    public String getValue() {
        return value;
    }
}
