module.exports = function (rolePermission) {
  if (!rolePermission) return null;

  const result = {
    'id': rolePermission.role_permission_id
  };

  if (rolePermission.permission) {
    result.permission_id = rolePermission.permission.permission_id;
    result.permission_name = rolePermission.permission.permission_name;
    result.permission_description = rolePermission.permission.permission_description;
  }

  return result;
};
