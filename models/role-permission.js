const { Op } = require('sequelize');

module.exports = function ({ schema }) {
  const RoleSchema = schema('role');
  const RolePermissionSchema = schema('role_permission');
  const PermissionSchema = schema('permission');

  function migration() {
    RolePermissionSchema.belongsTo(RoleSchema, {
      as: 'roled',
      foreignKey: 'role_id'
    });

    RolePermissionSchema.belongsTo(PermissionSchema, {
      as: 'permission',
      foreignKey: 'permission_id'
    });
  }

  async function add(rolePermission) {
    try {
      return await RolePermissionSchema.create(rolePermission);
    } catch(err) {
      console.error(err);

      return null;
    }
  }

  async function select(query) {
    try {
      const options = {
        include: [
          { association: 'roled' },
          { association: 'permission' }
        ],
        where: {}
      };

      if (query.role_permission_id) {
        options.where['role_permission_id'] = { [Op.eq]: query.role_permission_id };
      }

      if (query.role_id) {
        options.where['role_id'] = { [Op.eq]: query.role_id };
      }

      if (query.permission_id) {
        options.where['permission_id'] = { [Op.eq]: query.permission_id };
      }

      return await RolePermissionSchema.findOne(options);
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  async function list(query, offset = 0, limit = 10) {
    try {
      const options = {
        include: [
          { association: 'roled' },
          { association: 'permission' }
        ],
        where: {},
        order: [
          ['role_permission_id', query.sort || 'ASC']
        ]
      };

      if (query.role_id) {
        options.where['role_id'] = { [Op.eq]: query.role_id };
      }

      if (query.permission_id) {
        options.where['permission_id'] = { [Op.eq]: query.permission_id };
      }

      if (offset !== null) options.offset = offset;
      if (limit !== null) options.limit = limit;

      return await RolePermissionSchema.findAndCountAll(options);
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  async function update(selected, newer) {
    try {
      selected.role_id = newer.role_id || selected.role_id;
      selected.permission_id = newer.permission_id || selected.permission_id;

      await selected.save();

      return true;
    } catch (err) {
      console.error(err);

      return false;
    }
  }

  async function remove(selected) {
    try {
      await selected.destroy();

      return true;
    } catch (err) {
      console.error(err);

      return false;
    }
  }

  return {
    migration,
    add,
    select,
    list,
    update,
    remove
  };
};
