module.exports = function (rolePermission) {
  if (!rolePermission) return null;

  const result = {
    'id': rolePermission.role_permission_id,
    'permit_create': rolePermission.permit_create,
    'permit_read': rolePermission.permit_read,
    'permit_update': rolePermission.permit_update,
    'permit_delete': rolePermission.permit_delete
  };

  if (rolePermission.permission) {
    result.permission_id = rolePermission.permission.permission_id;
    result.permission_name = rolePermission.permission.permission_name;
    result.permission_description = rolePermission.permission.permission_description;
  }

  return result;
};
