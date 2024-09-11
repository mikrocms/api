const { Op } = require('sequelize');

module.exports = function ({ schema }) {
  const PermissionSchema = schema('permission');

  async function add(permission) {
    try {
      return await PermissionSchema.create(permission);
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  async function select(query) {
    try {
      const options = {
        where: {}
      };

      if (query.permission_id) {
        options.where['permission_id'] = { [Op.eq]: query.permission_id };
      }

      return await PermissionSchema.findOne(options);
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
          ['permission_id', query.sort || 'ASC']
        ]
      };

      if (query.permission_name) {
        options.where['permission_name'] = { [Op.like]: `%${query.permission_name}%` };
      }
    
      if (query.permission_description) {
        options.where['permission_description'] = { [Op.like]: `%${query.permission_description}%` };
      }

      if (offset !== null) options.offset = offset;
      if (limit !== null) options.limit = limit;

      return await PermissionSchema.findAndCountAll(options);
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  async function update(selected, newer) {
    try {
      selected.permission_name = newer.permission_name || selected.permission_name;
      selected.permission_description = newer.permission_description || selected.permission_description;

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
    add,
    select,
    list,
    update,
    remove
  };
};
