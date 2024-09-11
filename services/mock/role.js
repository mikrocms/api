module.exports = function (role) {
  if (!role) return null;

  return {
    'id': role.role_id,
    'role_name': role.role_name,
    'redirect': role.redirect
  };
};
