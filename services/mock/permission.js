module.exports = function (permission) {
  if (!permission) return null;

  return {
    'id': permission.permission_id,
    'permission_name': permission.permission_name,
    'permission_description': permission.permission_description
  };
};
