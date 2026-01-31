package com.idoc.statistics.dto.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.util.List;

public class BorrowEvent {
    private String userId;
    private String bookId;
    private List<String> categoryIds;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate eventDate;

    public BorrowEvent(String userId, String bookId, List<String> categoryIds, LocalDate eventDate) {
        this.userId = userId;
        this.bookId = bookId;
        this.categoryIds = categoryIds;
        this.eventDate = eventDate;
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

    public List<String> getCategoryIds() {
        return categoryIds;
    }

    public void setCategoryIds(List<String> categoryIds) {
        this.categoryIds = categoryIds;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }
}
