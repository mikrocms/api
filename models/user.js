const { Op } = require('sequelize');

module.exports = function ({ schema }) {
  const UserSchema = schema('user');
  const RoleSchema = schema('role');

  function migration() {
    UserSchema.belongsTo(RoleSchema, {
      as: 'role',
      foreignKey: 'role_id'
    });
  }

  async function add(user) {
    try {
      return await UserSchema.create(user);
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  async function select(query) {
    try {
      const options = {
        include: {
          association: 'role'
        },
        where: {}
      };

      if (query.user_id) {
        options.where['user_id'] = { [Op.eq]: query.user_id };
      }

      if (query.user_email) {
        options.where['user_email'] = { [Op.eq]: query.user_email };
      }

      if (query.user_username) {
        options.where['user_username'] = { [Op.eq]: query.user_username };
      }

      return UserSchema.findOne(options);
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  async function list(query, offset = 0, limit = 10) {
    try {
      const options = {
        include: {
          association: 'role'
        },
        where: {},
        order: [
          ['user_id', query.sort || 'ASC']
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

      if (query.user_email) {
        options.where['user_email'] = { [Op.like]: `%${query.user_email}%` };
      }

      if (query.user_username) {
        options.where['user_username'] = { [Op.like]: `${query.user_username}%` };
      }

      if (query.user_fullname) {
        options.where['user_fullname'] = { [Op.like]: `${query.user_fullname}%` };
      }

      if (query.role_id) {
        options.where['role_id'] = { [Op.eq]: query.role_id };
      }

      if (offset !== null) options.offset = offset;
      if (limit !== null) options.limit = limit;

      return UserSchema.findAndCountAll(options);
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

  return {
    migration,
    add,
    select,
    list,
    update,
    remove
  };
};
