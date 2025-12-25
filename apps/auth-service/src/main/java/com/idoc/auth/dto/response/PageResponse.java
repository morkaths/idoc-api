package com.idoc.auth.dto.response;

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
}
