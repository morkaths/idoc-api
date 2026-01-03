package com.idoc.statistics.dto.response;

public class BookStatisticResponse {
    private String bookId;
    private long totalBorrows;

    public BookStatisticResponse() {
    }

    public BookStatisticResponse(String bookId, long totalBorrows) {
        this.bookId = bookId;
        this.totalBorrows = totalBorrows;
    }

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public long getTotalBorrows() {
        return totalBorrows;
    }

    public void setTotalBorrows(long totalBorrows) {
        this.totalBorrows = totalBorrows;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String bookId;
        private long totalBorrows;

        public Builder bookId(String bookId) {
            this.bookId = bookId;
            return this;
        }

        public Builder totalBorrows(long totalBorrows) {
            this.totalBorrows = totalBorrows;
            return this;
        }

        public BookStatisticResponse build() {
            return new BookStatisticResponse(bookId, totalBorrows);
        }
    }

    @Override
    public String toString() {
        return "BookStatisticResponse{" +
                "bookId='" + bookId + '\'' +
                ", totalBorrows=" + totalBorrows +
                '}';
    }
}
