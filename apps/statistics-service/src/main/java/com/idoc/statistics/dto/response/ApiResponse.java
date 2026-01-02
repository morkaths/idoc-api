package com.idoc.statistics.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private int status;
    private String message;
    private T data;
    private PageResponse pagination;

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
