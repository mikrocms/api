const { param, validationResult } = require('express-validator');
const mockRole = require('./mock/role');
const mockRolePermission = require('./mock/role-permission');

module.exports = function ({ model }) {
  const modelRole = model('role');
  const modelRolePermission = model('role_permission');

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

    const selectedRole = await modelRole.select({
      'role_id': req.params.roleId
    });

    if (selectedRole !== null) {
      result.role = mockRole(selectedRole);
    }

    const listPermission = await modelRolePermission.list({
      'role_id': req.params.roleId
    }, null, null);

    if (listPermission !== null) {
      for (var permission of listPermission.rows) {
        result.permissions.push(mockRolePermission(permission));
      }
    }

    res.status(result.status).json(result);
  }

  return [
    param('roleId')
      .exists({ checkFalsy: false })
      .withMessage('mikrocms@api_input_role_id_required')
      .isNumeric()
      .withMessage('mikrocms@api_input_role_id_format')
      .toInt(),
    handlerRole
  ];
};
