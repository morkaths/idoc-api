package com.idoc.statistics.dto.response;

public class PageResponse {
    private Long total;
    private int limit;
    private int page;
    private int pages;

    public PageResponse() {
    }

    public PageResponse(Long total, int limit, int page, int pages) {
        this.total = total;
        this.limit = limit;
        this.page = page;
        this.pages = pages;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getPages() {
        return pages;
    }

    public void setPages(int pages) {
        this.pages = pages;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long total;
        private int limit;
        private int page;
        private int pages;

        public Builder total(Long total) {
            this.total = total;
            return this;
        }

        public Builder limit(int limit) {
            this.limit = limit;
            return this;
        }

        public Builder page(int page) {
            this.page = page;
            return this;
        }

        public Builder pages(int pages) {
            this.pages = pages;
            return this;
        }

        public PageResponse build() {
            return new PageResponse(total, limit, page, pages);
        }
    }

    @Override
    public String toString() {
        return "PageResponse{" +
                "total=" + total +
                ", limit=" + limit +
                ", page=" + page +
                ", pages=" + pages +
                '}';
    }
}
