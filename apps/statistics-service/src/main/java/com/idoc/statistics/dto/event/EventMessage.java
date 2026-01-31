package com.idoc.statistics.dto.event;

public class EventMessage<T> {
    private String id;
    private String type;
    private String source;
    private String occurredAt;
    private T payload;

    public EventMessage() {
    }

    public EventMessage(String id, String type, String source, String occurredAt, T payload) {
        this.id = id;
        this.type = type;
        this.source = source;
        this.occurredAt = occurredAt;
        this.payload = payload;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getOccurredAt() {
        return occurredAt;
    }

    public void setOccurredAt(String occurredAt) {
        this.occurredAt = occurredAt;
    }

    public T getPayload() {
        return payload;
    }

    public void setPayload(T payload) {
        this.payload = payload;
    }
}
