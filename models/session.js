module.exports = function modelSession({ env, db, schema, model, lib }) {
  const sessionSchema = schema('session');
  const userSchema = schema('user');

  function migration() {
sessionSchema.belongsTo(userSchema, {
  "as": "user",
  "foreignKey": "user_id"
});
  }

  async function add(data) {
    try {
      return await sessionSchema.create(data);
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  async function update(selected, newer) {
    try {
      selected.session_created = newer.session_created || selected.session_created;
      selected.session_expired = newer.session_expired || selected.session_expired;
      selected.session_token = newer.session_token || selected.session_token;
      selected.session_device = newer.session_device || selected.session_device;
      selected.session_ip = newer.session_ip || selected.session_ip;
      selected.session_valid = newer.session_valid || selected.session_valid;
      selected.user_id = newer.user_id || selected.user_id;

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
            "association": "user",
            "include": {
              "association": "role",
              "include": {
                "association": "permissions",
                "include": {
                  "association": "permission"
                }
              }
            }
          }
        ],
        order: [
          ['session_id', sort]
        ]
      };

      if (offset !== null) options.offset = offset;
      if (limit !== null) options.limit = limit;

      options.where = lib.where(queries);

      return sessionSchema[method](options);
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
