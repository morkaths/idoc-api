package com.idoc.statistics.dto.response;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

public class ApiResponse<T> {
    private boolean success;
    private int status;
    private String message;
    private T data;
    private PageResponse pagination;

    public ApiResponse() {
    }

    public ApiResponse(boolean success, int status, String message, T data, PageResponse pagination) {
        this.success = success;
        this.status = status;
        this.message = message;
        this.data = data;
        this.pagination = pagination;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public PageResponse getPagination() {
        return pagination;
    }

    public void setPagination(PageResponse pagination) {
        this.pagination = pagination;
    }

    public static <T> ApiResponseBuilder<T> builder() {
        return new ApiResponseBuilder<>();
    }

    public static class ApiResponseBuilder<T> {
        private boolean success;
        private int status;
        private String message;
        private T data;
        private PageResponse pagination;

        ApiResponseBuilder() {
        }

        public ApiResponseBuilder<T> success(boolean success) {
            this.success = success;
            return this;
        }

        public ApiResponseBuilder<T> status(int status) {
            this.status = status;
            return this;
        }

        public ApiResponseBuilder<T> message(String message) {
            this.message = message;
            return this;
        }

        public ApiResponseBuilder<T> data(T data) {
            this.data = data;
            return this;
        }

        public ApiResponseBuilder<T> pagination(PageResponse pagination) {
            this.pagination = pagination;
            return this;
        }

        public ApiResponse<T> build() {
            return new ApiResponse<>(success, status, message, data, pagination);
        }

        public String toString() {
            return "ApiResponse.ApiResponseBuilder(success=" + this.success + ", status=" + this.status + ", message="
                    + this.message + ", data=" + this.data + ", pagination=" + this.pagination + ")";
        }
    }

    // ============================================
    // SUCCESS CASES
    // ============================================

    public static <T> ApiResponse<T> success(T data) {
        return success(data, "Success");
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<List<T>> paged(Page<T> page) {
        return ApiResponse.<List<T>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Success")
                .data(page.getContent())
                .pagination(new PageResponse(
                        page.getTotalElements(),
                        page.getSize(),
                        page.getNumber(),
                        page.getTotalPages()))
                .build();
    }

    public static <T> ApiResponse<T> created(T data) {
        return created(data, "Created");
    }

    public static <T> ApiResponse<T> created(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .status(HttpStatus.CREATED.value())
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> updated(T data) {
        return success(data, "Updated successfully");
    }

    public static <T> ApiResponse<T> deleted() {
        return success(null, "Deleted successfully");
    }

    // ============================================
    // ERROR CASES
    // ============================================

    public static <T> ApiResponse<T> error(int status, String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .status(status)
                .message(message)
                .build();
    }

    public static <T> ApiResponse<T> error(HttpStatus status, String message) {
        return error(status.value(), message);
    }

    public static <T> ApiResponse<T> badRequest(String message) {
        return error(HttpStatus.BAD_REQUEST, message);
    }

    public static <T> ApiResponse<T> unauthorized(String message) {
        return error(HttpStatus.UNAUTHORIZED, message);
    }

    public static <T> ApiResponse<T> forbidden(String message) {
        return error(HttpStatus.FORBIDDEN, message);
    }

    public static <T> ApiResponse<T> notFound(String message) {
        return error(HttpStatus.NOT_FOUND, message);
    }

    public static <T> ApiResponse<T> methodNotAllowed(String message) {
        return error(HttpStatus.METHOD_NOT_ALLOWED, message);
    }

    public static <T> ApiResponse<T> requestTimeout(String message) {
        return error(HttpStatus.REQUEST_TIMEOUT, message);
    }

    public static <T> ApiResponse<T> conflict(String message) {
        return error(HttpStatus.CONFLICT, message);
    }

    public static <T> ApiResponse<T> gone(String message) {
        return error(HttpStatus.GONE, message);
    }

    public static <T> ApiResponse<T> unsupportedMediaType(String message) {
        return error(HttpStatus.UNSUPPORTED_MEDIA_TYPE, message);
    }

    public static <T> ApiResponse<T> unprocessableEntity(String message) {
        return error(HttpStatus.UNPROCESSABLE_ENTITY, message);
    }

    public static <T> ApiResponse<T> tooManyRequests(String message) {
        return error(HttpStatus.TOO_MANY_REQUESTS, message);
    }

    public static <T> ApiResponse<T> internalServerError(String message) {
        return error(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }

    public static <T> ApiResponse<T> notImplemented(String message) {
        return error(HttpStatus.NOT_IMPLEMENTED, message);
    }

    public static <T> ApiResponse<T> serviceUnavailable(String message) {
        return error(HttpStatus.SERVICE_UNAVAILABLE, message);
    }
}
