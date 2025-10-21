package com.idoc.auth.core;

import org.springframework.http.ResponseEntity;

public class BaseController {
	
	/**
	 * OK response with body
	 * @param <T> - type of body
	 * @param body - response body
	 * @return ResponseEntity with OK status and body
	 */
	protected <T> ResponseEntity<T> ok(T body) {
        return ResponseEntity.ok(body);
    }
	
	/**
	 * Error response with message
	 * @param message - error message
	 * @return ResponseEntity with Bad Request status and message
	 */
	protected ResponseEntity<String> error(String message) {
        return ResponseEntity.badRequest().body(message);
    }

}
