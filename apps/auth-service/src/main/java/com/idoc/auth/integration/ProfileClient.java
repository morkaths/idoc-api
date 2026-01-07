package com.idoc.auth.integration;

import java.util.Map;

import org.springframework.stereotype.Component;

import com.idoc.auth.core.BaseClient;
import com.idoc.auth.dto.external.ProfileRequest;

import com.idoc.auth.config.AppProperties;

@Component
public class ProfileClient extends BaseClient<ProfileRequest> {

  private final String service = "/profiles";
  private final AppProperties appProperties;

  public ProfileClient(AppProperties appProperties) {
    this.appProperties = appProperties;
  }

  public ProfileRequest create(ProfileRequest profile, String token) {
    String url = appProperties.getService().getUrl() + service;
    String apiKey = appProperties.getService().getKey();
    Map<String, String> headers = Map.of(
        "x-api-key", apiKey,
        "Authorization", "Bearer " + token);
    return post(url, profile, headers, ProfileRequest.class);
  }

}
