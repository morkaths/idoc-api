package com.idoc.auth.constant.query;

public class PermissionQuery {
  public static final String FIND_BY_ROLE_ID = """
      SELECT p FROM PermissionEntity p
      JOIN p.roles r
      WHERE r.id = :roleId
      """;
}
