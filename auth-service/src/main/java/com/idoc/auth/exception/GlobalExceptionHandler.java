package com.idoc.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

  // 400 Bad Request
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Map<String, Object>> handleBadRequest(IllegalArgumentException ex) {
    Map<String, Object> response = new HashMap<>();
    response.put("status", "error");
    response.put("message", ex.getMessage());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
  }

  // 401 Unauthorized
  @ExceptionHandler(AuthenticationCredentialsNotFoundException.class)
  public ResponseEntity<Map<String, Object>> handleUnauthorized(AuthenticationCredentialsNotFoundException ex) {
    Map<String, Object> response = new HashMap<>();
    response.put("status", "error");
    response.put("message", "Unauthorized");
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
  }

  // 403 Forbidden
  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<Map<String, Object>> handleForbidden(AccessDeniedException ex) {
    Map<String, Object> response = new HashMap<>();
    response.put("status", "error");
    response.put("message", "Forbidden");
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
  }

  // 404 Not Found
  @ExceptionHandler(NoHandlerFoundException.class)
  public ResponseEntity<Map<String, Object>> handleNotFound(NoHandlerFoundException ex) {
    Map<String, Object> response = new HashMap<>();
    response.put("status", "error");
    response.put("message", "Resource not found");
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
  }

  // 500 Internal Server Error
  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleInternal(Exception ex) {
    Map<String, Object> response = new HashMap<>();
    response.put("status", "error");
    response.put("message", "Internal server error");
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
  }
}