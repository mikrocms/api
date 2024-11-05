module.exports = function (user) {
  if (!user) return null;

  const result = {
    'id': user.user_id,
    'email': user.user_email,
    'username': user.user_username,
    'fullname': user.user_fullname,
    'updated_at': user.updated_at
  };

  if (user.role) {
    result.role_id = user.role.role_id;
    result.role_name = user.role.role_name;
  }

  return result;
};
