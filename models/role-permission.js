module.exports = function modelRolePermission({ env, db, schema, model, lib }) {
  const rolePermissionSchema = schema('role_permission');
  const roleSchema = schema('role');
  const permissionSchema = schema('permission');

  function migration() {
rolePermissionSchema.belongsTo(roleSchema, {
  "as": "roled",
  "foreignKey": "role_id"
});
rolePermissionSchema.belongsTo(permissionSchema, {
  "as": "permission",
  "foreignKey": "permission_id"
});
  }

  async function add(data) {
    try {
      return await rolePermissionSchema.create(data);
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  async function update(selected, newer) {
    try {
      selected.permit_create = newer.permit_create || selected.permit_create;
      selected.permit_read = newer.permit_read || selected.permit_read;
      selected.permit_update = newer.permit_update || selected.permit_update;
      selected.permit_delete = newer.permit_delete || selected.permit_delete;
      selected.role_id = newer.role_id || selected.role_id;
      selected.permission_id = newer.permission_id || selected.permission_id;

      await selected.save();

      return true;
    } catch (err) {
      console.error(err);

      return false;
    }
  }

  async function remove(selected, remover) {
    try {
      await selected.destroy();

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
          {
            "association": "permission"
          }
        ],
        order: [
          ['role_permission_id', sort]
        ]
      };

      if (offset !== null) options.offset = offset;
      if (limit !== null) options.limit = limit;

      options.where = lib.where(queries);

      return rolePermissionSchema[method](options);
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
