package com.idoc.auth.constant;

public enum Role {
    ADMIN("ADMIN"),
    USER("USER"),
    STAFF("STAFF"),
    MANAGER("MANAGER");

    private final String value;

    Role(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
