package com.idoc.auth.dto.external;

import java.util.Date;

public class ProfileDto {
  private Long userId;
  private String fullName;
  private Date birthday;
  private String avatar;
  private String bio;
  private String location;

  public ProfileDto() {
    super();
  }

  public ProfileDto(Long userId, String fullName, Date birthday, String avatar, String bio, String location) {
    this.userId = userId;
    this.fullName = fullName;
    this.birthday = birthday;
    this.avatar = avatar;
    this.bio = bio;
    this.location = location;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }

  public Date getBirthday() {
    return birthday;
  }

  public void setBirthday(Date birthday) {
    this.birthday = birthday;
  }

  public String getAvatar() {
    return avatar;
  }

  public void setAvatar(String avatar) {
    this.avatar = avatar;
  }

  public String getBio() {
    return bio;
  }

  public void setBio(String bio) {
    this.bio = bio;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }
  
}
