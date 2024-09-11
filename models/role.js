const { Op } = require('sequelize');

module.exports = function ({ schema }) {
  const RoleSchema = schema('role');
  const RolePermissionSchema = schema('role_permission');

  function migration() {
    RoleSchema.hasMany(RolePermissionSchema, {
      as: 'permissions',
      foreignKey: 'role_id'
    });
  }

  async function add(role) {
    try {
      return await RoleSchema.create(role);
    } catch(err) {
      console.error(err);

      return null;
    }
  }

  async function select(query) {
    try {
      const options = {
        where: {}
      };

      if (query.role_id) {
        options.where['role_id'] = { [Op.eq]: query.role_id };
      }

      if (query.role_name) {
        options.where['role_name'] = { [Op.eq]: query.role_name };
      }

      return await RoleSchema.findOne(options);
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  async function list(query, offset = 0, limit = 10) {
    try {
      const options = {
        where: {},
        order: [
          ['role_id', query.sort || 'ASC']
        ]
      };

      if (query.created_at_on) {
        options.where['created_at'] = { [Op.eq]: query.created_at_on };
      }

      if (query.created_at_start) {
        options.where['created_at'] = { [Op.gte]: query.created_at_start };
      }

      if (query.created_at_end) {
        options.where['created_at'] = { [Op.lte]: query.created_at_end };
      }

      if (query.created_by) {
        options.where['created_by'] = { [Op.eq]: query.created_by };
      }

      if (query.updated_at_on) {
        options.where['updated_at'] = { [Op.eq]: query.updated_at_on };
      }

      if (query.updated_at_start) {
        options.where['updated_at'] = { [Op.gte]: query.updated_at_start };
      }

      if (query.updated_at_end) {
        options.where['updated_at'] = { [Op.lte]: query.updated_at_end };
      }

      if (query.updated_by) {
        options.where['updated_by'] = { [Op.eq]: query.updated_by };
      }

      if (query.deleted_at_on) {
        options.where['deleted_at'] = { [Op.eq]: query.deleted_at_on };
      }

      if (query.deleted_at_start) {
        options.where['deleted_at'] = { [Op.gte]: query.deleted_at_start };
      }

      if (query.deleted_at_end) {
        options.where['deleted_at'] = { [Op.lte]: query.deleted_at_end };
      }

      if (query.deleted_by) {
        options.where['deleted_by'] = { [Op.eq]: query.deleted_by };
      }

      if (query.role_name) {
        options.where['role_name'] = { [Op.like]: `%${query.role_name}%` };
      }

      if (query.redirect) {
        options.where['redirect'] = { [Op.like]: `%${query.redirect}%` };
      }

      if (offset !== null) options.offset = offset;
      if (limit !== null) options.limit = limit;

      return await RoleSchema.findAndCountAll(options);
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

  return {
    migration,
    add,
    select,
    list,
    update,
    remove
  };
};
