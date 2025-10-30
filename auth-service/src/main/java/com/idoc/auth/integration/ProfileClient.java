package com.idoc.auth.integration;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.idoc.auth.core.BaseClient;
import com.idoc.auth.dto.external.ProfileDto;

@Component
public class ProfileClient extends BaseClient<ProfileDto> {

  @Value("${service.profile.url}")
  private String profileServiceUrl;

  @Value("${service.key}")
  private String apiKey;

  public ProfileDto createProfile(ProfileDto profile, String token) {
    String url = profileServiceUrl;
    Map<String, String> headers = Map.of(
        "x-api-key", apiKey,
        "Authorization", "Bearer " + token
    );
    return post(url, profile, headers, ProfileDto.class);
  }

}
