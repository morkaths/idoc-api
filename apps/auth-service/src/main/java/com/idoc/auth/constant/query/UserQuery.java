package com.idoc.auth.constant.query;

public class UserQuery {
	public static final String FIND_BY_USERNAME_WITH_ROLES_AND_PERMISSIONS = """
			SELECT u FROM UserEntity u
			LEFT JOIN FETCH u.roles r
			LEFT JOIN FETCH r.permissions
			WHERE u.username = :username
			""";

	public static final String FIND_BY_USERNAME_OR_EMAIL = """
			SELECT u FROM UserEntity u
			LEFT JOIN FETCH u.roles r
			LEFT JOIN FETCH r.permissions
			WHERE u.username = :identifier OR u.email = :identifier
			""";

}
