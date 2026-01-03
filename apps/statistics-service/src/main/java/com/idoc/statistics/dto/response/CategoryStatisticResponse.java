package com.idoc.statistics.dto.response;

public class CategoryStatisticResponse {
    private String categoryId;
    private long totalBorrows;

    public CategoryStatisticResponse() {
    }

    public CategoryStatisticResponse(String categoryId, long totalBorrows) {
        this.categoryId = categoryId;
        this.totalBorrows = totalBorrows;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
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
        private String categoryId;
        private long totalBorrows;

        public Builder categoryId(String categoryId) {
            this.categoryId = categoryId;
            return this;
        }

        public Builder totalBorrows(long totalBorrows) {
            this.totalBorrows = totalBorrows;
            return this;
        }

        public CategoryStatisticResponse build() {
            return new CategoryStatisticResponse(categoryId, totalBorrows);
        }
    }

    @Override
    public String toString() {
        return "CategoryStatisticResponse{" +
                "categoryId='" + categoryId + '\'' +
                ", totalBorrows=" + totalBorrows +
                '}';
    }
}
