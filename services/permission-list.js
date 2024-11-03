const { query, validationResult } = require('express-validator');
const mockPermission = require('./mock/permission');

module.exports = function ({ model, middleware }) {
  const modelPermission = model('permission');

  function setPermission(req, res, next) {
    req.permission = {
      'PERMISSION': {
        'permit_read': 'ENABLE'
      }
    };

    return next();
  }

  async function handlerListPermission(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        'status': 400,
        'message': req.transvalidator(errors.array({ onlyFirstError: true }))
      });
    }

    const result = {
      'status': 200,
      'message': null,
      'permissions': [],
      'total': 0
    };

    const queries = {};

    if (req.query.permission_name) {
      queries['permission_name'] = { 'like': `%${req.query.permission_name}%` };
    }

    if (req.query.permission_description) {
      queries['permission_description'] = { 'like': `%${req.query.permission_description}%` };
    }

    const listPermissions = await modelPermission.find({
      queries,
      offset: req.query.offset || null,
      limit: req.query.limit || null,
      sort: req.query.sort,
      method: 'findAndCountAll'
    });

    if (listPermissions) {
      for (var permission of listPermissions.rows) {
        result.permissions.push(mockPermission(permission));
      }

      result.total = listPermissions.count;
    }

    res.status(result.status).json(result);
  }

  return [
    setPermission,
    middleware(['permission']),
    query('offset')
      .optional()
      .isNumeric()
      .toInt(),
    query('limit')
      .optional()
      .isNumeric()
      .toInt(),
    query('sort')
      .optional()
      .isIn(['DESC', 'ASC']),
    query('permission_name')
      .optional(),
    query('permission_description')
      .optional(),
    handlerListPermission
  ];
};
