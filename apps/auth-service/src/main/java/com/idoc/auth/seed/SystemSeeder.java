// mvn spring-boot:run -Dspring-boot.run.profiles=mock
package com.idoc.auth.seed;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.idoc.auth.entity.UserEntity;
import com.idoc.auth.entity.PermissionEntity;
import com.idoc.auth.entity.RoleEntity;
import com.idoc.auth.repository.UserRepository;
import com.idoc.auth.repository.PermissionRepository;
import com.idoc.auth.repository.RoleRepository;

@Configuration
@Profile("mock")
public class SystemSeeder {
  
  @Bean
  @SuppressWarnings("unused")
  CommandLineRunner seedAll(UserRepository userRepository, RoleRepository roleRepository,
      PermissionRepository permissionRepository) {
    return args -> {
      // 1. Seed roles
      List<RoleEntity> roles = Arrays.asList(
          new RoleEntity("admin", "Administrator"),
          new RoleEntity("user", "User"),
          new RoleEntity("staff", "Staff"),
          new RoleEntity("manager", "Manager"));
      for (RoleEntity role : roles) {
        if (roleRepository.findByCode(role.getCode()) == null) {
          roleRepository.save(role);
        }
      }

      // 2. Seed permissions
      List<PermissionEntity> permissions = Arrays.asList(
          new PermissionEntity("user.view.own", "View Own User"),
          new PermissionEntity("user.edit.own", "Edit Own User"),
          new PermissionEntity("user.delete.own", "Delete Own User"),
          new PermissionEntity("user.view", "View User"),
          new PermissionEntity("user.edit", "Edit User"),
          new PermissionEntity("user.delete", "Delete User"),
          new PermissionEntity("role.view", "View Role"),
          new PermissionEntity("role.edit", "Edit Role"),
          new PermissionEntity("role.delete", "Delete Role"),
          new PermissionEntity("permission.view", "View Permission"),
          new PermissionEntity("permission.edit", "Edit Permission"),
          new PermissionEntity("permission.delete", "Delete Permission"));
      for (PermissionEntity permission : permissions) {
        if (permissionRepository.findByCode(permission.getCode()) == null) {
          permissionRepository.save(permission);
        }
      }

      // 3. Seed users
      BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

      RoleEntity adminRole = roleRepository.findByCode("admin");
      RoleEntity userRole = roleRepository.findByCode("user");
      RoleEntity staffRole = roleRepository.findByCode("staff");
      RoleEntity managerRole = roleRepository.findByCode("manager");

      if (userRepository.findByUsername("admin") == null) {
        UserEntity admin = new UserEntity();
        admin.setUsername("admin");
        admin.setPassword(encoder.encode("123456"));
        admin.setEmail("admin@email.com");
        admin.setStatus(1);
        admin.getRoles().add(adminRole);
        userRepository.save(admin);
      }
      if (userRepository.findByUsername("user") == null) {
        UserEntity user = new UserEntity();
        user.setUsername("user");
        user.setPassword(encoder.encode("123456"));
        user.setEmail("user@email.com");
        user.setStatus(1);
        user.getRoles().add(userRole);
        userRepository.save(user);
      }
      if (userRepository.findByUsername("staff") == null) {
        UserEntity staff = new UserEntity();
        staff.setUsername("staff");
        staff.setPassword(encoder.encode("123456"));
        staff.setEmail("staff@email.com");
        staff.setStatus(1);
        staff.getRoles().add(staffRole);
        userRepository.save(staff);
      }
      if (userRepository.findByUsername("manager") == null) {
        UserEntity manager = new UserEntity();
        manager.setUsername("manager");
        manager.setPassword(encoder.encode("123456"));
        manager.setEmail("manager@email.com");
        manager.setStatus(1);
        manager.getRoles().add(managerRole);
        userRepository.save(manager);
      }

      // 4. Gán permission cho role

      Set<PermissionEntity> allPermissions = new HashSet<>(permissionRepository.findAll());
      adminRole.setPermissions(allPermissions);
      roleRepository.save(adminRole);

      Set<String> userCodes = new HashSet<>(Arrays.asList(
          "user.view.own", "user.edit.own", "user.delete.own", "user.view"));
      Set<PermissionEntity> userPermissions = permissionRepository.findAll()
          .stream()
          .filter(p -> userCodes.contains(p.getCode()))
          .collect(Collectors.toSet());
      userRole.setPermissions(userPermissions);
      roleRepository.save(userRole);

      Set<PermissionEntity> staffPermissions = new HashSet<>(permissionRepository.findAll());
      staffPermissions.removeIf(p -> Arrays.asList(
          "user.delete", "role.edit", "role.delete", "permission.edit", "permission.delete").contains(p.getCode()));
      staffRole.setPermissions(staffPermissions);
      roleRepository.save(staffRole);

      Set<PermissionEntity> managerPermissions = new HashSet<>(permissionRepository.findAll());
      managerPermissions.removeIf(p -> Arrays.asList(
          "user.delete", "role.delete", "permission.delete").contains(p.getCode()));
      managerRole.setPermissions(managerPermissions);
      roleRepository.save(managerRole);
    };
  }
}