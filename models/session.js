const { Op } = require('sequelize');

module.exports = function ({ schema }) {
  const UserSchema = schema('user');
  const SessionSchema = schema('session');

  function migration() {
    SessionSchema.belongsTo(UserSchema, {
      as: 'user',
      foreignKey: 'user_id'
    });
  }

  async function add(session) {
    try {
      return await SessionSchema.create(session);
    } catch(err) {
      console.error(err);

      return null;
    }
  }

  async function select(query) {
    try {
      const options = {
        include: [
          {
            association: 'user',
            include: [
              {
                association: 'role',
                include: {
                  association: 'permissions',
                  include: { association: 'permission' }
                }
              }
            ]
          }
        ],
        where: {}
      };

      if (query.session_id) {
        options.where['session_id'] = { [Op.eq]: query.session_id };
      }

      if (query.session_token) {
        options.where['session_token'] = { [Op.eq]: query.session_token };
      }

      return await SessionSchema.findOne(options);
    } catch(err) {
      console.error(err);

      return null;
    }
  }

  async function list(query, offset = 0, limit = 10) {
    try {
      const options = {
        include: [
          {
            association: 'user',
            include: [
              {
                association: 'role',
                include: {
                  association: 'permissions',
                  include: { association: 'permission' }
                }
              },
              { association: 'vendor' }
            ]
          }
        ],
        where: {}
      };

      if (query.session_created_on) {
        options.where['session_created'] = { [Op.eq]: query.session_created_on };
      }

      if (query.session_created_start) {
        options.where['session_created'] = { [Op.gte]: query.session_created_start };
      }

      if (query.session_created_end) {
        options.where['session_created'] = { [Op.lte]: query.session_created_end };
      }

      if (query.session_expired_on) {
        options.where['session_expired'] = { [Op.eq]: query.session_expired_on };
      }

      if (query.session_expired_start) {
        options.where['session_expired'] = { [Op.gte]: query.session_expired_start };
      }

      if (query.session_expired_end) {
        options.where['session_expired'] = { [Op.lte]: query.session_expired_end };
      }

      if (query.session_token) {
        options.where['session_token'] = { [Op.like]: `%${query.session_token}%` };
      }

      if (query.session_device) {
        options.where['session_device'] = { [Op.like]: `%${query.session_device}%` };
      }

      if (query.session_ip) {
        options.where['session_ip'] = { [Op.like]: `%${query.session_ip}%` };
      }

      if (query.session_valid) {
        options.where['session_valid'] = { [Op.eq]: query.session_valid };
      }

      if (query.user_id) {
        options.where['user_id'] = { [Op.eq]: query.user_id };
      }

      if (offset !== null) options.offset = offset;
      if (limit !== null) options.limit = limit;

      return await SessionSchema.findAndCountAll(options);
    } catch(err) {
      console.error(err);

      return null;
    }
  }

  async function update(selected, newer) {
    try {
      selected.session_expired = newer.session_expired || selected.session_expired;
      selected.session_token = newer.session_token || selected.session_token;
      selected.session_device = newer.session_device || selected.session_device;
      selected.session_ip = newer.session_ip || selected.session_ip;
      selected.session_valid = newer.session_valid || selected.session_valid;

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
