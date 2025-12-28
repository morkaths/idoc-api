package com.idoc.auth.constant;

public enum Role {
    ADMIN("admin"),
    USER("user"),
    STAFF("staff"),
    MANAGER("manager");

    private final String value;

    Role(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
