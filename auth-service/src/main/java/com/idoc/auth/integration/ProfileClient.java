package com.idoc.auth.integration;

import java.util.Map;

import com.idoc.auth.core.BaseClient;
import com.idoc.auth.dto.external.ProfileDto;

public class ProfileClient extends BaseClient<ProfileDto> {

  public ProfileDto createProfile(String token, ProfileDto profile) {
    String url = "http://profile-service/api/profile";
    return post(url, profile, Map.of("Authorization", "Bearer " + token), ProfileDto.class);
  }

}
