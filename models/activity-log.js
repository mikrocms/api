module.exports = function modelActivityLog({ env, db, schema, model, lib }) {
  const activityLogSchema = schema('activity_log');

  function migration() {
  }

  async function add(data) {
    try {
      return await activityLogSchema.create(data);
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  async function update(selected, newer) {
    try {
      selected.activity_created = newer.activity_created || selected.activity_created;
      selected.activity_label = newer.activity_label || selected.activity_label;
      selected.activity_description = newer.activity_description || selected.activity_description;
      selected.session_id = newer.session_id || selected.session_id;

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
        order: [
          ['activity_id', sort]
        ]
      };

      if (offset !== null) options.offset = offset;
      if (limit !== null) options.limit = limit;

      options.where = lib.where(queries);

      return activityLogSchema[method](options);
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
