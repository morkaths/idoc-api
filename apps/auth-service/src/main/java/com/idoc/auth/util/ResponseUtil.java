package com.idoc.auth.util;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Consumer;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.idoc.auth.dto.response.PageResponse;
import com.idoc.auth.dto.response.UserResponse;
import com.idoc.auth.dto.response.AuthenticationResponse;

public class ResponseUtil {

  private static Map<String, Object> baseBody(boolean success, String message) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", success);
    body.put("message", message);
    return body;
  }

  public static ResponseEntity<Map<String, Object>> custom(HttpStatus status, boolean success, String message, Consumer<Map<String, Object>> customizer) {
    Map<String, Object> body = baseBody(success, message);
    if (customizer != null) customizer.accept(body);
    return ResponseEntity.status(status).body(body);
  }

  public static ResponseEntity<Map<String, Object>> authentication(String message, AuthenticationResponse auth, Object data) {
    return custom(HttpStatus.OK, true, message, body -> {
      body.put("token", auth.getToken());
      body.put("user", auth.getUser());
      if (data != null) body.put("data", data);
    });
  }

  public static ResponseEntity<Map<String, Object>> user(String message, UserResponse user) {
    return custom(HttpStatus.OK, true, message, body -> {
      body.put("user", user);
    });
  }

  public static <T> ResponseEntity<Map<String, Object>> paged(String message, Page<T> page) {
    return custom(HttpStatus.OK, true, message, body -> {
      body.put("data", page.getContent());
      body.put("pagination", new PageResponse(
        page.getTotalElements(),
        page.getSize(),
        page.getNumber(),
        page.getTotalPages()
      ));
    });
  }

  public static ResponseEntity<Map<String, Object>> success(String message, Object data) {
    return custom(HttpStatus.OK, true, message, body -> {
      if (data != null) body.put("data", data);
    });
  }

  public static ResponseEntity<Map<String, Object>> created(String message, Object data) {
    return custom(HttpStatus.CREATED, true, message, body -> {
      if (data != null) body.put("data", data);
    });
  }

  public static ResponseEntity<Map<String, Object>> updated(String message, Object data) {
    return success(message, data);
  }

  public static ResponseEntity<Map<String, Object>> deleted(String message) {
    return success(message, null);
  }

  public static ResponseEntity<Void> noContent() {
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }

  public static ResponseEntity<Map<String, Object>> error(String message, HttpStatus status, Object err) {
    return custom(status, false, message, body -> {
      if (err != null) body.put("error", err);
    });
  }

  // Các hàm error khác có thể gọi lại error() ở trên
  public static ResponseEntity<Map<String, Object>> unauthorized(String message) {
    return error(message, HttpStatus.UNAUTHORIZED, null);
  }

  public static ResponseEntity<Map<String, Object>> forbidden(String message) {
    return error(message, HttpStatus.FORBIDDEN, null);
  }

  public static ResponseEntity<Map<String, Object>> notFound(String message) {
    return error(message, HttpStatus.NOT_FOUND, null);
  }

  public static ResponseEntity<Map<String, Object>> methodNotAllowed(String message) {
    return error(message, HttpStatus.METHOD_NOT_ALLOWED, null);
  }

  public static ResponseEntity<Map<String, Object>> requestTimeout(String message) {
    return error(message, HttpStatus.REQUEST_TIMEOUT, null);
  }

  public static ResponseEntity<Map<String, Object>> duplicate(String message, Object err) {
    return error(message, HttpStatus.CONFLICT, err);
  }

  public static ResponseEntity<Map<String, Object>> gone(String message) {
    return error(message, HttpStatus.GONE, null);
  }

  public static ResponseEntity<Map<String, Object>> unsupportedMediaType(String message) {
    return error(message, HttpStatus.UNSUPPORTED_MEDIA_TYPE, null);
  }

  public static ResponseEntity<Map<String, Object>> unprocessable(String message, Object err) {
    return error(message, HttpStatus.UNPROCESSABLE_ENTITY, err);
  }

  public static ResponseEntity<Map<String, Object>> tooManyRequests(String message) {
    return error(message, HttpStatus.TOO_MANY_REQUESTS, null);
  }

  public static ResponseEntity<Map<String, Object>> internalError(String message, Object err) {
    return error(message, HttpStatus.INTERNAL_SERVER_ERROR, err);
  }

  public static ResponseEntity<Map<String, Object>> notImplemented(String message) {
    return error(message, HttpStatus.NOT_IMPLEMENTED, null);
  }

  public static ResponseEntity<Map<String, Object>> serviceUnavailable(String message) {
    return error(message, HttpStatus.SERVICE_UNAVAILABLE, null);
  }
}