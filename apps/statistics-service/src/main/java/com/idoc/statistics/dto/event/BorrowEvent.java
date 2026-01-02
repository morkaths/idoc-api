package com.idoc.statistics.dto.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;

public class BorrowEvent {
    private String userId;
    private String bookId;
    private java.util.List<String> categoryIds;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate eventDate;

    private String type; // "BORROW" or "RETURN"

    public BorrowEvent() {
    }

    public BorrowEvent(String userId, String bookId, java.util.List<String> categoryIds, LocalDate eventDate,
            String type) {
        this.userId = userId;
        this.bookId = bookId;
        this.categoryIds = categoryIds;
        this.eventDate = eventDate;
        this.type = type;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public java.util.List<String> getCategoryIds() {
        return categoryIds;
    }

    public void setCategoryIds(java.util.List<String> categoryIds) {
        this.categoryIds = categoryIds;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
