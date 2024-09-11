const { Op } = require('sequelize');

module.exports = function ({ schema }) {
  const ActivityLogSchema = schema('activity_log');

  async function add(activity) {
    try {
      return await ActivityLogSchema.create(activity);
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

      if (query.activity_id) {
        options.where['activity_id'] = { [Op.eq]: query.activity_id };
      }

      if (query.session_id) {
        options.where['session_id'] = { [Op.eq]: query.session_id };
      }

      return await ActivityLogSchema.findOne(options);
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
          ['activity_id', query.sort || 'ASC']
        ]
      };

      if (query.activity_created_on) {
        options.where['activity_created'] = { [Op.eq]: query.activity_created_on };
      }

      if (query.activity_created_start) {
        options.where['activity_created'] = { [Op.gte]: query.activity_created_start };
      }

      if (query.activity_created_end) {
        options.where['activity_created'] = { [Op.lte]: query.activity_created_end };
      }

      if (query.activity_label) {
        options.where['activity_label'] = { [Op.like]: `%${query.activity_label}%` };
      }

      if (query.activity_description) {
        options.where['activity_description'] = { [Op.like]: `%${query.activity_description}%` };
      }

      if (offset !== null) options.offset = offset;
      if (limit !== null) options.limit = limit;

      return await ActivityLogSchema.find(options);
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  async function update(selected, newer) {
    try {
      selected.activity_label = newer.activity_label || selected.activity_label;
      selected.activity_description = newer.activity_description || selected.activity_description;

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
