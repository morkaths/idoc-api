-- camelcase
INSERT INTO role (code, name) VALUES ('admin', 'Administrator'), ('user', 'User');

-- <resource>.<action>[.<scope>]
INSERT INTO permission (code, name) VALUES 
('user.create', 'Create User'),
('user.delete', 'Delete User'),
('user.view', 'View User');

-- Admin có tất cả quyền
INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p WHERE r.code = 'admin';

-- User chỉ có quyền xem user
INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p WHERE r.code = 'user' AND p.code = 'user.view';

-- Staff có quyền xem và sửa staff, xem user
INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p WHERE r.code = 'staff' AND p.code IN ('staff.view', 'staff.edit', 'user.view');

-- Manager có quyền duyệt và xem manager, xem user, xem staff
INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p WHERE r.code = 'manager' AND p.code IN ('manager.approve', 'manager.view', 'user.view', 'staff.view');

-- Thêm user
INSERT INTO user (username, password, email, status) VALUES 
('admin', '...', 'admin@email.com', 1),
('user', '...', 'user@email.com', 1),
('staff', '...', 'staff@email.com', 1),
('manager', '...', 'manager@email.com', 1);

-- Gán role cho user
INSERT INTO user_role (user_id, role_id)
SELECT u.id, r.id FROM user u, role r WHERE u.username = 'admin' AND r.code = 'admin';
INSERT INTO user_role (user_id, role_id)
SELECT u.id, r.id FROM user u, role r WHERE u.username = 'user' AND r.code = 'user';
INSERT INTO user_role (user_id, role_id)
SELECT u.id, r.id FROM user u, role r WHERE u.username = 'staff' AND r.code = 'staff';
INSERT INTO user_role (user_id, role_id)
SELECT u.id, r.id FROM user u, role r WHERE u.username = 'manager' AND r.code = 'manager';