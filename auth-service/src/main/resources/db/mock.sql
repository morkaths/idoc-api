-- Thêm role
INSERT INTO role (code, name) VALUES ('ADMIN', 'Administrator'), ('USER', 'User');

-- Thêm permission
INSERT INTO permission (code, name) VALUES 
('PERM_CREATE_USER', 'Create User'),
('PERM_DELETE_USER', 'Delete User'),
('PERM_VIEW_USER', 'View User');

-- Gán permission cho role
INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p WHERE r.code = 'ADMIN';

INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p WHERE r.code = 'USER' AND p.code = 'PERM_VIEW_USER';

-- Thêm user
INSERT INTO user (username, password, email, status) VALUES 
('admin', '$2a$10$7QJ8QkQkQkQkQkQkQkQkQeQkQkQkQkQkQkQkQkQkQkQkQkQkQkQk', 'admin@email.com', 1),
('user1', '$2a$10$7QJ8QkQkQkQkQkQkQkQkQeQkQkQkQkQkQkQkQkQkQkQkQkQkQkQk', 'user1@email.com', 1);

-- Gán role cho user
INSERT INTO user_role (user_id, role_id)
SELECT u.id, r.id FROM user u, role r WHERE u.username = 'admin' AND r.code = 'ADMIN';

INSERT INTO user_role (user_id, role_id)
SELECT u.id, r.id FROM user u, role r WHERE u.username = 'user1' AND r.code = 'USER';