module.exports = function modelUser({ env, db, schema, model, lib }) {
  const userSchema = schema('user');
  const roleSchema = schema('role');

  function migration() {
userSchema.belongsTo(roleSchema, {
  "as": "role",
  "foreignKey": "role_id"
});
  }

  async function add(data) {
    try {
      return await userSchema.create(data);
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  async function update(selected, newer) {
    try {
      selected.updated_at = new Date();
      selected.updated_by = newer.updated_by;
      selected.user_email = newer.user_email || selected.user_email;
      selected.user_username = newer.user_username || selected.user_username;
      selected.user_password = newer.user_password || selected.user_password;
      selected.user_fullname = newer.user_fullname || selected.user_fullname;
      selected.role_id = newer.role_id || selected.role_id;

      await selected.save();

      return true;
    } catch (err) {
      console.error(err);

      return false;
    }
  }

  async function remove(selected, remover) {
    try {
      selected.deleted_at = new Date();
      selected.deleted_by = remover.deleted_by;

      await selected.save();

      return true;
    } catch (err) {
      console.error(err);

      return false;
    }
  }

  async function find({
    queries,
    offset = 0,
    limit = 10,
    sort = 'ASC',
    method = 'findOne'
  }) {
    try {
      const options = {
      include: [
          { association: 'role' },
        ],
        order: [
          ['user_id', sort]
        ]
      };

      if (offset !== null) options.offset = offset;
      if (limit !== null) options.limit = limit;

      options.where = lib.where(queries);

      return userSchema[method](options);
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  return {
    migration,
    add,
    update,
    remove,
    find
  };
};
