package com.idoc.auth.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.idoc.auth.entity.UserEntity;
import com.idoc.auth.model.Role;
import com.idoc.auth.model.User;
import com.idoc.auth.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@GetMapping
	public ResponseEntity<Map<String, Object>> getAllUsers() {
		List<UserEntity> entities = userService.findAllUser();

		List<User> data = entities.stream().map(entity -> {
        return new User(
            entity.getId(),
            entity.getUsername(),
            entity.getEmail(),
            entity.getStatus(),
            entity.getRoles().stream()
                .map(role -> new Role(role.getId(), role.getCode(), role.getName()))
                .collect(Collectors.toSet())
        );
    }).toList();
		
		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");
		response.put("message", "Users retrieved successfully");
		response.put("data", data);
		return ResponseEntity.ok(response);
	}
	
}
