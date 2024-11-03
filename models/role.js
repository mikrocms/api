module.exports = function modelRole({ env, db, schema, model, lib }) {
  const roleSchema = schema('role');
  const rolePermissionSchema = schema('role_permission');

  function migration() {
roleSchema.hasMany(rolePermissionSchema, {
  "as": "permissions",
  "foreignKey": "role_id"
});
  }

  async function add(data) {
    try {
      return await roleSchema.create(data);
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  async function update(selected, newer) {
    try {
      selected.updated_at = new Date();
      selected.updated_by = newer.updated_by;
      selected.role_name = newer.role_name || selected.role_name;
      selected.redirect = newer.redirect || selected.redirect;

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
          { association: 'permissions' },
        ],
        order: [
          ['role_id', sort]
        ]
      };

      if (offset !== null) options.offset = offset;
      if (limit !== null) options.limit = limit;

      options.where = lib.where(queries);

      return roleSchema[method](options);
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
