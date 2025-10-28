package com.idoc.auth.util;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;

public class ResponseUtil {

  /**
   * Builds a success message response.
   * 
   * @param message - the success message
   * @return ResponseEntity with success status and message
   */
  public static ResponseEntity<Map<String, Object>> buildSuccessMessage(String message) {
    Map<String, Object> response = new LinkedHashMap<>();
    response.put("status", 200);
    response.put("success", true);
    response.put("message", message);
    return ResponseEntity.ok(response);
  }

  public static ResponseEntity<Map<String, Object>> buildSuccessResponse(String message, Object data) {
    return buildSuccessResponse(message, data, null);
  }

  /**
   * Builds a success response with data.
   * 
   * @param message - the success message
   * @param data    - the data to include in the response
   * @return ResponseEntity with success status, message, and data
   */
  public static ResponseEntity<Map<String, Object>> buildSuccessResponse(String message, Object data, Object user) {
    Map<String, Object> response = new LinkedHashMap<>();
    response.put("status", 200);
    response.put("success", true);
    response.put("message", message);
    if (data != null)
      response.put("data", data);
    if (user != null)
      response.put("user", user);
    return ResponseEntity.ok(response);
  }

  /**
   * Builds a 201 Created response with a success message and data.
   * 
   * @param message - the success message
   * @param data    - the data to include in the response
   * @return ResponseEntity with 201 status, message, and data
   */
  public static ResponseEntity<Map<String, Object>> buildCreatedResponse(String message, Object data) {
    Map<String, Object> response = new LinkedHashMap<>();
    response.put("status", 201);
    response.put("success", true);
    response.put("message", message);
    response.put("data", data);
    return ResponseEntity.status(201).body(response);
  }

  /**
   * Builds a 202 Accepted response with a success message.
   * 
   * @param message - the success message
   * @return ResponseEntity with 202 status and message
   */
  public static ResponseEntity<Map<String, Object>> buildAcceptedResponse(String message) {
    Map<String, Object> response = new LinkedHashMap<>();
    response.put("status", 202);
    response.put("success", true);
    response.put("message", message);
    return ResponseEntity.status(202).body(response);
  }

  /**
   * Builds a 204 No Content response.
   * 
   * @return ResponseEntity with 204 status
   */
  public static ResponseEntity<Map<String, Object>> buildNoContentResponse() {
    Map<String, Object> response = new LinkedHashMap<>();
    response.put("status", 204);
    response.put("success", true);
    response.put("message", "No content");
    return ResponseEntity.status(204).body(response);
  }

}
