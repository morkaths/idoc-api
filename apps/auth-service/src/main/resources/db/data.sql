-- camelcase
INSERT INTO role (code, name) VALUES 
('ADMIN', 'Administrator'),
('MANAGER', 'Manager'), 
('STAFF', 'Staff'),
('USER', 'User');

-- <resource>.<action>
INSERT INTO permission (code, name) VALUES 
('user.view', 'View User'),
('user.edit', 'Edit User'),
('user.delete', 'Delete User'),
('role.view', 'View Role'),
('role.edit', 'Edit Role'),
('role.delete', 'Delete Role'),
('permission.view', 'View Permission'),
('permission.edit', 'Edit Permission'),
('permission.delete', 'Delete Permission');


-- Admin có tất cả quyền
INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p WHERE r.code = 'ADMIN';

-- Manager có quyền duyệt và xem manager, xem user, xem staff
INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p WHERE r.code = 'MANAGER' 
  AND p.code NOT IN (
    'user.delete',
    'role.delete',
    'permission.delete'
  );

-- Staff có quyền xem và sửa staff, xem user
INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p WHERE r.code = 'STAFF'
  AND p.code NOT IN (
    'user.delete',
    'role.edit',
    'role.delete',
    'permission.edit',
    'permission.delete'
  );

-- User chỉ có quyền xem user
INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p WHERE r.code = 'USER'
  AND p.code = 'user.view';