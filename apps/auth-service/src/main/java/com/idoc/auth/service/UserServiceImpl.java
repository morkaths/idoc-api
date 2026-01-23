package com.idoc.auth.service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.idoc.libs.common.excel.ExcelHelper;
import java.io.ByteArrayInputStream;
import java.io.IOException;

import com.idoc.libs.common.core.BaseServiceImpl;
import com.idoc.auth.dto.external.ProfileRequest;
import com.idoc.auth.dto.request.UserRequest;
import com.idoc.auth.dto.response.UserResponse;
import com.idoc.auth.entity.RoleEntity;
import com.idoc.auth.entity.UserEntity;
import com.idoc.auth.integration.ProfileClient;
import com.idoc.auth.mapper.UserMapper;
import com.idoc.auth.repository.RoleRepository;
import com.idoc.auth.repository.UserRepository;
import com.idoc.auth.spec.UserSpecification;
import com.idoc.auth.util.PasswordUtil;
import com.idoc.auth.util.SpecificationBuilder;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
@Transactional(readOnly = true)
public class UserServiceImpl
		extends BaseServiceImpl<UserRequest, UserResponse, UserEntity, Long>
		implements UserService {

	private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final UserMapper userMapper;
	private final ProfileClient profileClient;

	public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, RoleRepository roleRepository,
			ProfileClient profileClient) {
		super(userRepository, userRepository, userMapper);
		this.userRepository = userRepository;
		this.userMapper = userMapper;
		this.roleRepository = roleRepository;
		this.profileClient = profileClient;
	}

	@Override
	public Page<UserResponse> find(Pageable pageable, Map<String, Object> filter) {
		String sortBy = (String) filter.getOrDefault("sortBy", "id");
		String sortOrder = (String) filter.getOrDefault("sortOrder", "asc");
		Sort sort = sortOrder.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		Pageable pageRequest = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
		Specification<UserEntity> spec = UserSpecification.filter(filter);
		return this.paginate(pageRequest, spec);
	}

	@Override
	public UserResponse findByUsernameOrEmail(String identifier) {
		UserEntity user = userRepository.findByUsernameOrEmail(identifier);
		if (user == null) {
			throw new IllegalArgumentException("User not found with identifier: " + identifier);
		}
		return userMapper.toResponse(user);
	}

	@Override
	public List<UserResponse> search(Map<String, Object> filter) {
		SpecificationBuilder<UserEntity> builder = SpecificationBuilder.<UserEntity>builder()
				.queryFields("username", "email")
				.likeFields("username", "email", "status")
				.manyToManyField("roles", "code")
				.build();
		Specification<UserEntity> specification = builder.build(filter);
		return userRepository.findAll(specification)
				.stream()
				.map(userMapper::toResponse)
				.toList();
	}

	@Override
	@Transactional
	public UserResponse assign(Long userId, Set<Long> roleIds) {
		UserEntity user = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));
		Set<RoleEntity> roles = roleRepository.findAllById(roleIds)
				.stream()
				.collect(Collectors.toSet());
		user.setRoles(roles);
		return userMapper.toResponse(userRepository.save(user));
	}

	@Override
	@Transactional
	public UserResponse save(UserRequest dto) {
		if (dto.getId() == null) {
			if (userRepository.existsByUsername(dto.getUsername())) {
				throw new IllegalArgumentException("Username already exists: " + dto.getUsername());
			}
			if (userRepository.existsByEmail(dto.getEmail())) {
				throw new IllegalArgumentException("Email already exists: " + dto.getEmail());
			}
		}
		UserEntity entity = userMapper.toEntity(dto);
		if (dto.getRoleIds() != null && !dto.getRoleIds().isEmpty()) {
			Set<RoleEntity> roles = new HashSet<>(roleRepository.findAllById(dto.getRoleIds()));
			entity.setRoles(roles);
		}
		UserEntity saved = userRepository.save(entity);
		return userMapper.toResponse(saved);
	}

	@Override
	@Transactional
	public UserResponse create(UserRequest dto, Long createdBy) {
		if (userRepository.existsByUsername(dto.getUsername())) {
			throw new IllegalArgumentException("Username already exists: " + dto.getUsername());
		}
		if (userRepository.existsByEmail(dto.getEmail())) {
			throw new IllegalArgumentException("Email already exists: " + dto.getEmail());
		}
		dto.setPassword(PasswordUtil.hash(dto.getPassword()));
		UserEntity entity = userMapper.toEntity(dto);
		if (dto.getRoleIds() != null && !dto.getRoleIds().isEmpty()) {
			Set<RoleEntity> roles = new HashSet<>(roleRepository.findAllById(dto.getRoleIds()));
			entity.setRoles(roles);
		}
		UserEntity saved = userRepository.save(entity);
		ProfileRequest profile = new ProfileRequest(
				saved.getId(),
				"User " + saved.getUsername(),
				null,
				null,
				null,
				null);
		String accessToken = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();
		try {
			profileClient.create(profile, accessToken);
		} catch (Exception ex) {
			System.err.println("Error when creating profile: " + ex.getMessage());
		}
		return userMapper.toResponse(saved);
	}

	@Override
	@Transactional
	public UserResponse partial(Long id, Map<String, Object> fields) {
		UserEntity user = userRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));
		if (fields.containsKey("roleIds")) {
			List<?> rawRoleIds = (List<?>) fields.get("roleIds");
			List<Long> roleIds = rawRoleIds.stream()
					.map(val -> Long.valueOf(val.toString()))
					.collect(Collectors.toList());
			Set<RoleEntity> roles = new HashSet<>(roleRepository.findAllById(roleIds));
			user.setRoles(roles);
			fields.remove("roleIds");
		}
		return super.partial(id, fields);
	}

	@Override
	@Transactional
	public void importExcel(MultipartFile file) {
		if (!ExcelHelper.hasExcelFormat(file)) {
			throw new IllegalArgumentException("Please upload an excel file!");
		}

		try {
			// Pre-fetch roles map: Code -> ID (Normalize to Uppercase)
			Map<String, Long> roleMap = roleRepository.findAll().stream()
					.collect(Collectors.toMap(r -> r.getCode().toUpperCase(), RoleEntity::getId));

			List<UserRequest> userRequests = ExcelHelper.importFromExcel(file.getInputStream(), (row, headerMap) -> {
				UserRequest req = new UserRequest();

				// Helper to get string value by header name safely
				BiFunction<String, String, String> getValue = (header, defaultValue) -> {
					Integer idx = headerMap.get(header);
					if (idx == null)
						return defaultValue;
					String val = ExcelHelper.getCellStringValue(row, idx);
					return val != null ? val : defaultValue;
				};

				// "Username"
				req.setUsername(getValue.apply("Username", null));

				// "Email"
				req.setEmail(getValue.apply("Email", null));

				// "Password" (default 123456)
				req.setPassword(getValue.apply("Password", "123456"));

				// "Status" (default 1)
				String statusStr = getValue.apply("Status", "1");
				try {
					req.setStatus(Integer.parseInt(statusStr));
				} catch (NumberFormatException e) {
					req.setStatus(1);
				}

				// "Roles"
				String roleCodes = getValue.apply("Roles", null);
				Set<Long> roleIds = new HashSet<>();
				if (roleCodes != null && !roleCodes.isEmpty()) {
					String[] codes = roleCodes.split(",");
					for (String code : codes) {
						String cleanCode = code.trim().toUpperCase();
						Long roleId = roleMap.get(cleanCode);
						if (roleId != null) {
							roleIds.add(roleId);
						}
					}
				}
				// Default role if empty? e.g. USER
				if (roleIds.isEmpty() && roleMap.containsKey("USER")) {
					roleIds.add(roleMap.get("USER"));
				}
				req.setRoleIds(roleIds);

				return req;
			});

			// 1. Filter valid requests (must have username and email)
			List<UserRequest> validRequests = userRequests.stream()
					.filter(req -> req.getUsername() != null && req.getEmail() != null)
					.collect(Collectors.toList());

			if (validRequests.isEmpty()) {
				return;
			}

			// 2. Batch check existence
			Set<String> usernames = validRequests.stream().map(UserRequest::getUsername).collect(Collectors.toSet());
			Set<String> emails = validRequests.stream().map(UserRequest::getEmail).collect(Collectors.toSet());

			Set<String> existingUsernames = userRepository.findByUsernameIn(usernames).stream()
					.map(UserEntity::getUsername).collect(Collectors.toSet());

			Set<String> existingEmails = userRepository.findByEmailIn(emails).stream()
					.map(UserEntity::getEmail).collect(Collectors.toSet());

			// 3. Prepare entities to save
			List<UserEntity> entitiesToSave = new java.util.ArrayList<>();
			for (UserRequest req : validRequests) {
				if (existingUsernames.contains(req.getUsername())) {
					log.warn("Skipping import for existing username: {}", req.getUsername());
					continue;
				}
				if (existingEmails.contains(req.getEmail())) {
					log.warn("Skipping import for existing email: {}", req.getEmail());
					continue;
				}

				// Map to entity
				req.setPassword(PasswordUtil.hash(req.getPassword()));
				UserEntity entity = userMapper.toEntity(req);

				if (req.getRoleIds() != null && !req.getRoleIds().isEmpty()) {
					Set<RoleEntity> roles = new HashSet<>(roleRepository.findAllById(req.getRoleIds()));
					entity.setRoles(roles);
				}

				entitiesToSave.add(entity);
			}

			// 4. Batch Save
			if (!entitiesToSave.isEmpty()) {
				List<UserEntity> savedUsers = userRepository.saveAll(entitiesToSave);
				log.info("Imported {} users successfully", savedUsers.size());

				// 5. Create Profiles (External Call - Bulk)
				String accessToken = "";
				try {
					if (SecurityContextHolder.getContext().getAuthentication() != null) {
						accessToken = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();
					}
				} catch (Exception e) {
				}

				try {
					List<ProfileRequest> profiles = savedUsers.stream()
							.map(saved -> new ProfileRequest(
									saved.getId(),
									"User " + saved.getUsername(),
									null,
									null,
									null,
									null))
							.collect(Collectors.toList());

					profileClient.createMany(profiles, accessToken);
					log.info("Created profiles for {} users", profiles.size());
				} catch (Exception e) {
					log.error("Failed to create profiles: {}", e.getMessage());
				}
			}

		} catch (IOException e) {
			throw new RuntimeException("fail to store key file data: " + e.getMessage());
		}
	}

	@Override
	public ByteArrayInputStream exportExcel() {
		List<UserResponse> users = userRepository.findAllWithRoles().stream()
				.map(userMapper::toResponse)
				.collect(Collectors.toList());
		String[] headers = { "ID", "Username", "Email", "Status", "Roles" };

		return ExcelHelper.exportToExcel(users, "Users", headers, user -> {
			String roles = user.getRoles() != null
					? user.getRoles().stream().map(role -> role.getCode()).collect(Collectors.joining(", "))
					: "";

			return new Object[] {
					user.getId(),
					user.getUsername(),
					user.getEmail(),
					user.getStatus(),
					roles
			};
		});
	}

}
