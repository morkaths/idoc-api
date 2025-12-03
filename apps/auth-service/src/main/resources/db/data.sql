-- camelcase
INSERT INTO role (code, name) VALUES 
('admin', 'Administrator'), 
('user', 'User'), 
('staff', 'Staff'), 
('manager', 'Manager');

-- <resource>.<action>[.<scope>]
INSERT INTO permission (code, name) VALUES 
('user.view.own', 'View Own User'),
('user.edit.own', 'Edit Own User'),
('user.delete.own', 'Delete Own User'),
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
SELECT r.id, p.id FROM role r, permission p WHERE r.code = 'admin';

-- User chỉ có quyền xem user
INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p WHERE r.code = 'user'
  AND (p.code LIKE '%.own' OR p.code = 'user.view');

-- Staff có quyền xem và sửa staff, xem user
INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p 
WHERE r.code = 'staff'
  AND p.code NOT IN (
    'user.delete',
    'role.edit',
    'role.delete',
    'permission.edit',
    'permission.delete'
  );

-- Manager có quyền duyệt và xem manager, xem user, xem staff
INSERT INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM role r, permission p WHERE r.code = 'manager' 
  AND p.code NOT IN (
    'user.delete',
    'role.delete',
    'permission.delete'
  );