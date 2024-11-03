const { param, validationResult } = require('express-validator');
const mockRole = require('./mock/role');
const mockRolePermission = require('./mock/role-permission');

module.exports = function ({ model, middleware }) {
  const modelRole = model('role');
  const modelRolePermission = model('role_permission');

  function setPermission(req, res, next) {
    req.permission = {
      'ROLE': {
        'permit_read': 'ENABLE'
      }
    };

    return next();
  }

  async function handlerRole(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        'status': 400,
        'message': req.transvalidator(errors.array({ onlyFirstError: true }))
      });
    }

    const result = {
      'status': 200,
      'role': null,
      'permissions': []
    };

    const selectedRole = await modelRole.find({
      queries: {
        'role_id': { 'eq': req.params.roleId }
      }
    });

    if (selectedRole !== null) {
      result.role = mockRole(selectedRole);
    }

    const listPermission = await modelRolePermission.find({
      queries: {
        'role_id': { 'eq': req.params.roleId }
      },
      offset: req.query.offset || null,
      limit: req.query.limit || null,
      sort: req.query.sort,
      method: 'findAndCountAll'
    });

    if (listPermission !== null) {
      for (var permission of listPermission.rows) {
        result.permissions.push(mockRolePermission(permission));
      }
    }

    res.status(result.status).json(result);
  }

  return [
    setPermission,
    middleware(['permission']),
    param('roleId')
      .exists({ checkFalsy: false })
      .withMessage('mikrocms@api_input_role_id_required')
      .isNumeric()
      .withMessage('mikrocms@api_input_role_id_format')
      .toInt(),
    handlerRole
  ];
};
