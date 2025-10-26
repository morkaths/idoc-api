package com.idoc.auth.core;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public abstract class BaseClient<T> {

  @Autowired
  protected RestTemplate restTemplate;

  protected <R> R post(String url, T body, Map<String, String> headersMap, Class<R> responseType) {
    HttpHeaders headers = new HttpHeaders();
    if (headersMap != null) {
      headersMap.forEach(headers::set);
    }
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<T> request = new HttpEntity<>(body, headers);
    ResponseEntity<R> response = restTemplate.postForEntity(url, request, responseType);
    return response.getStatusCode().is2xxSuccessful() ? response.getBody() : null;
  }

  protected <R> R get(String url, Map<String, String> headersMap, Class<R> responseType) {
    HttpHeaders headers = new HttpHeaders();
    if (headersMap != null) {
      headersMap.forEach(headers::set);
    }
    headers.setAccept(List.of(MediaType.APPLICATION_JSON));
    HttpEntity<Void> request = new HttpEntity<>(headers);
    ResponseEntity<R> response = restTemplate.exchange(url, HttpMethod.GET, request, responseType);
    return response.getStatusCode().is2xxSuccessful() ? response.getBody() : null;
  }

}
