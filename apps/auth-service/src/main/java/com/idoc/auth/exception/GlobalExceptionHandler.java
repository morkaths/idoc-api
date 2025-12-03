package com.idoc.auth.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
public class GlobalExceptionHandler {

  private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String message) {
    Map<String, Object> response = new LinkedHashMap<>();
    response.put("status", status.value());
    response.put("success", false);
    response.put("message", message);
    return ResponseEntity.status(status).body(response);
  }

  // Handle ResponseStatusException
  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<Map<String, Object>> handleResponseStatus(ResponseStatusException ex) {
    return buildResponse(
        HttpStatus.valueOf(ex.getStatusCode().value()),
        ex.getReason() != null ? ex.getReason() : ex.getMessage());
  }

  // 400 Bad Request for Illegal Arguments
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Map<String, Object>> handleBadRequest(IllegalArgumentException ex) {
    return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
  }

  // 401 Unauthorized for Authentication Failures
  @ExceptionHandler(AuthenticationCredentialsNotFoundException.class)
  public ResponseEntity<Map<String, Object>> handleUnauthorized(AuthenticationCredentialsNotFoundException ex) {
    return buildResponse(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  // 403 Forbidden for Access Denied
  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<Map<String, Object>> handleForbidden(AccessDeniedException ex) {
    return buildResponse(HttpStatus.FORBIDDEN, "Forbidden");
  }

  // 404 Not Found for Missing Resources
  @ExceptionHandler(NoHandlerFoundException.class)
  public ResponseEntity<Map<String, Object>> handleNotFound(NoHandlerFoundException ex) {
    return buildResponse(HttpStatus.NOT_FOUND, "Resource not found");
  }

  // 409 Conflict for Data Integrity Violations
  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
    String message = "Data integrity violation";
    if (ex.getMostSpecificCause() != null) {
      message = ex.getMostSpecificCause().getMessage();
    }
    return buildResponse(HttpStatus.CONFLICT, message);
  }

  // 500 Internal Server Error for Unhandled Exceptions
  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleInternal(Exception ex) {
    return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
  }

}