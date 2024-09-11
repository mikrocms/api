const { query, validationResult } = require('express-validator');
const mockRole = require('./mock/role');

module.exports = function ({ model }) {
  const modelRole = model('role');

  async function handlerListRole(req, res) {
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
      'roles': [],
      'total': 0
    };

    const listRole = await modelRole.list(
      req.query,
      req.query.offset || null,
      req.query.limit || null
    );

    if (listRole) {
      for (var role of listRole.rows) {
        result.roles.push(mockRole(role));
      }

      result.total = listRole.count;
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
    query('created_at_on')
      .optional()
      .isISO8601()
      .withMessage('mikrocms@api_input_date_format'),
    query('created_at_start')
      .optional()
      .isISO8601()
      .withMessage('mikrocms@api_input_date_format'),
    query('created_at_end')
      .optional()
      .isISO8601()
      .withMessage('mikrocms@api_input_date_format'),
    query('created_by')
      .optional()
      .isNumeric()
      .withMessage('mikrocms@api_input_created_by_format')
      .toInt(),
    query('updated_at_on')
      .optional()
      .isISO8601()
      .withMessage('mikrocms@api_input_date_format'),
    query('updated_at_start')
      .optional()
      .isISO8601()
      .withMessage('mikrocms@api_input_date_format'),
    query('updated_at_end')
      .optional()
      .isISO8601()
      .withMessage('mikrocms@api_input_date_format'),
    query('updated_by')
      .optional()
      .isNumeric()
      .withMessage('mikrocms@api_input_updated_by_format')
      .toInt(),
    query('deleted_at_on')
      .optional()
      .isISO8601()
      .withMessage('mikrocms@api_input_date_format'),
    query('deleted_at_start')
      .optional()
      .isISO8601()
      .withMessage('mikrocms@api_input_date_format'),
    query('deleted_at_end')
      .optional()
      .isISO8601()
      .withMessage('mikrocms@api_input_date_format'),
    query('deleted_by')
      .optional()
      .isNumeric()
      .withMessage('mikrocms@api_input_deleted_by_format')
      .toInt(),
    query('role_name')
      .optional(),
    query('redirect')
      .optional(),
    handlerListRole
  ];
};
