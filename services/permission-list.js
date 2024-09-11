const { query, validationResult } = require('express-validator');
const mockPermission = require('./mock/permission');

module.exports = function ({ model }) {
  const modelPermission = model('permission');

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

    const listPermissions = await modelPermission.list(
      req.query,
      req.query.offset,
      req.query.limit
    );

    if (listPermissions) {
      for (var permission of listPermissions.rows) {
        result.permissions.push(mockPermission(permission));
      }

      result.total = listPermissions.count;
    }

    res.status(result.status).json(result);
  }

  return [
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
