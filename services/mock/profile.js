module.exports = function (session) {
  if (!session) return null;

  const profile = {
    'id': session.user_id,
    'username': session.user.user_username,
    'fullname': session.user.user_fullname,
    'updated_at': session.user.updated_at
  };

  if (session.user.role) {
    profile.role_id = session.user.role.role_id;
    profile.role_name = session.user.role.role_name;
    profile.redirect = session.user.role.redirect;
    profile.permissions = [];

    if (session.user.role.permissions) {
      for (var permission of session.user.role.permissions) {
        profile.permissions.push({
          'id': permission.role_permission_id,
          'permission_id': permission.permission.permission_id,
          'permission_name': permission.permission.permission_name,
          'permission_description': permission.permission.permission_description
        });
      }
    }
  }

  return profile;
};
