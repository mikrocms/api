module.exports = function modelPermission({ env, db, schema, model, lib }) {
  const permissionSchema = schema('permission');

  function migration() {
  }

  async function add(data) {
    try {
      return await permissionSchema.create(data);
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
          ['permission_id', sort]
        ]
      };

      if (offset !== null) options.offset = offset;
      if (limit !== null) options.limit = limit;

      options.where = lib.where(queries);

      return permissionSchema[method](options);
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
