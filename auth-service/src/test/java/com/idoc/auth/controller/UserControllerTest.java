package com.idoc.auth.controller;

import com.idoc.auth.entity.RoleEntity;
import com.idoc.auth.entity.UserEntity;
import com.idoc.auth.security.jwt.JwtTokenProvider;
import com.idoc.auth.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Set;

import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private UserService userService;

	@MockBean
	private JwtTokenProvider jwtTokenProvider;

	@Test
	void getAllUsers_shouldReturnListOfUsers() throws Exception {
		RoleEntity role = new RoleEntity();
		ReflectionTestUtils.setField(role, "id", 1L);
		role.setCode("ADMIN");
		role.setName("Administrator");

		UserEntity user = new UserEntity();
		ReflectionTestUtils.setField(user, "id", 1L);
		user.setUsername("admin");
		user.setEmail("admin@email.com");
		user.setStatus(1);
		user.setRoles(Set.of(role));

		Mockito.when(userService.findAllUser()).thenReturn(List.of(user));

		mockMvc.perform(get("/api/users")).andExpect(status().isOk())
				.andExpect(jsonPath("$.data[0].username").value("admin"))
				.andExpect(jsonPath("$.data[0].roles[0].code").value("ADMIN"));
	}

	@Test
	void getAllUsers_shouldReturnEmptyList() throws Exception {
		Mockito.when(userService.findAllUser()).thenReturn(List.of());

		mockMvc.perform(get("/api/users")).andExpect(status().isOk()).andExpect(jsonPath("$.data").isArray())
				.andExpect(jsonPath("$.data").isEmpty());
	}

	@Test
	void getAllUsers_shouldReturnInternalServerError() throws Exception {
		Mockito.when(userService.findAllUser()).thenThrow(new RuntimeException("DB error"));

		mockMvc.perform(get("/api/users")).andExpect(status().isInternalServerError());
	}

	@Test
	void getAllUsers_shouldReturnUnauthorized_whenNoAuth() throws Exception {
		mockMvc.perform(get("/api/users")).andExpect(status().isOk());
	}
}