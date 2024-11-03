const { query, validationResult } = require('express-validator');
const mockUser = require('./mock/user');

module.exports = function ({ model, middleware }) {
  const modelUser = model('user');

  function setPermission(req, res, next) {
    req.permission = {
      'USER': {
        'permit_read': 'ENABLE'
      }
    };

    return next();
  }

  async function handlerListUser(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        'status': 400,
        'message': req.transvalidator(errors.array({ onlyFirstError: true }))
      });
    }

    const result = {
      'status': 200,
      'users': [],
      'total': 0
    };

    const queries = {};

    if (req.query.created_at_on) {
      queries['created_at'] = { 'eq': req.query.created_at_on };
    }

    if (req.query.created_at_start) {
      queries['created_at'] = { 'gte': req.query.created_at_start };
    }

    if (req.query.created_at_end) {
      queries['created_at'] = { 'lte': req.query.created_at_end };
    }

    if (req.query.created_by) {
      queries['created_by'] = { 'eq': req.query.created_by };
    }

    if (req.query.updated_at_on) {
      queries['updated_at'] = { 'eq': req.query.updated_at_on };
    }

    if (req.query.updated_at_start) {
      queries['updated_at'] = { 'gte': req.query.updated_at_start };
    }

    if (req.query.updated_at_end) {
      queries['updated_at'] = { 'lte': req.query.updated_at_end };
    }

    if (req.query.updated_by) {
      queries['updated_by'] = { 'eq': req.query.updated_by };
    }

    if (req.query.deleted_at_on) {
      queries['deleted_at'] = { 'eq': req.query.deleted_at_on };
    }

    if (req.query.deleted_at_start) {
      queries['deleted_at'] = { 'gte': req.query.deleted_at_start };
    }

    if (req.query.deleted_at_end) {
      queries['deleted_at'] = { 'lte': req.query.deleted_at_end };
    }

    if (req.query.deleted_by) {
      queries['deleted_by'] = { 'eq': req.query.deleted_by };
    }

    if (req.query.user_email) {
      queries['user_email'] = { 'like': `%${req.query.user_email}%` };
    }

    if (req.query.user_username) {
      queries['user_username'] = { 'like': `%${req.query.user_username}%` };
    }

    if (req.query.user_fullname) {
      queries['user_fullname'] = { 'like': `%${req.query.user_fullname}%` };
    }

    const listUser = await modelUser.find({
      queries,
      offset: req.query.offset || null,
      limit: req.query.limit || null,
      sort: req.query.sort,
      method: 'findAndCountAll'
    });

    if (listUser) {
      for (var user of listUser.rows) {
        result.users.push(mockUser(user));
      }

      result.total = listUser.count;
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
    query('user_email')
      .optional(),
    query('user_username')
      .optional(),
    query('user_fullname')
      .optional(),
    handlerListUser
  ];
};
