package com.idoc.auth.util;

import org.springframework.http.ResponseEntity;

import com.idoc.auth.dto.UserDto;

import org.springframework.http.HttpStatus;

import java.util.Map;
import java.util.LinkedHashMap;

public class ResponseUtil {

  public static ResponseEntity<Map<String, Object>> user(String message, UserDto user) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", true);
    body.put("message", message);
    body.put("user", user);
    return ResponseEntity.status(HttpStatus.OK).body(body);
  }

  public static ResponseEntity<Map<String, Object>> success(String message, Object data) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", true);
    body.put("message", message);
    if (data != null)
      body.put("data", data);
    return ResponseEntity.status(HttpStatus.OK).body(body);
  }

  public static ResponseEntity<Map<String, Object>> created(String message, Object data) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", true);
    body.put("message", message);
    if (data != null)
      body.put("data", data);
    return ResponseEntity.status(HttpStatus.CREATED).body(body);
  }

  public static ResponseEntity<Map<String, Object>> updated(String message, Object data) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", true);
    body.put("message", message);
    if (data != null)
      body.put("data", data);
    return ResponseEntity.status(HttpStatus.OK).body(body);
  }

  public static ResponseEntity<Map<String, Object>> deleted(String message) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", true);
    body.put("message", message);
    return ResponseEntity.status(HttpStatus.OK).body(body);
  }

  public static ResponseEntity<Void> noContent() {
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }

  public static ResponseEntity<Map<String, Object>> error(String message, int statusCode, Object err) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", false);
    body.put("message", message);
    if (err != null)
      body.put("error", err);
    return ResponseEntity.status(statusCode).body(body);
  }

  public static ResponseEntity<Map<String, Object>> unauthorized(String message) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", false);
    body.put("message", message);
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
  }

  public static ResponseEntity<Map<String, Object>> forbidden(String message) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", false);
    body.put("message", message);
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
  }

  public static ResponseEntity<Map<String, Object>> notFound(String message) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", false);
    body.put("message", message);
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
  }

  public static ResponseEntity<Map<String, Object>> methodNotAllowed(String message) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", false);
    body.put("message", message);
    return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(body);
  }

  public static ResponseEntity<Map<String, Object>> requestTimeout(String message) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", false);
    body.put("message", message);
    return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT).body(body);
  }

  public static ResponseEntity<Map<String, Object>> duplicate(String message, Object err) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", false);
    body.put("message", message);
    if (err != null)
      body.put("error", err);
    return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
  }

  public static ResponseEntity<Map<String, Object>> gone(String message) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", false);
    body.put("message", message);
    return ResponseEntity.status(HttpStatus.GONE).body(body);
  }

  public static ResponseEntity<Map<String, Object>> unsupportedMediaType(String message) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", false);
    body.put("message", message);
    return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(body);
  }

  public static ResponseEntity<Map<String, Object>> unprocessable(String message, Object err) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", false);
    body.put("message", message);
    if (err != null)
      body.put("error", err);
    return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(body);
  }

  public static ResponseEntity<Map<String, Object>> tooManyRequests(String message) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", false);
    body.put("message", message);
    return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(body);
  }

  public static ResponseEntity<Map<String, Object>> internalError(String message, Object err) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", false);
    body.put("message", message);
    if (err != null)
      body.put("error", err);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
  }

  public static ResponseEntity<Map<String, Object>> notImplemented(String message) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", false);
    body.put("message", message);
    return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(body);
  }

  public static ResponseEntity<Map<String, Object>> serviceUnavailable(String message) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("success", false);
    body.put("message", message);
    return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(body);
  }
}