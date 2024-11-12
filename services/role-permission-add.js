const { body, validationResult } = require('express-validator');

module.exports = function ({ model, locale, middleware }) {
  const modelRole = model('role')
  const modelPermission = model('permission');
  const modelRolePermission = model('role_permission');
  const modelActivityLog = model('activity_log');

  function setPermission(req, res, next) {
    req.permission = {
      'PERMISSION': {
        'permit_create': 'ENABLE'
      }
    };

    return next();
  }

  async function handlerAddRolePermission(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        'status': 400,
        'message': req.transvalidator(errors.array({ onlyFirstError: true }))
      });
    }

    const result = {
      'status': 400,
      'message': null,
      'role_permission_id': null
    };

    const selectedRole = await modelRole.find({
      queries: {
        'role_id': { 'eq': req.body.role_id }
      }
    });

    const selectedPermission = await modelPermission.find({
      queries: {
        'permission_id': { 'eq': req.body.permission_id }
      }
    });

    const registeredPermission = await modelRolePermission.find({
      queries: {
        'role_id': { 'eq': req.body.role_id },
        'permission_id': { 'eq': req.body.permission_id }
      }
    });

    if (selectedRole === null) {
      result.message = req.trans('mikrocms@api_check_role_not_found');
    } else if (selectedPermission === null) {
      result.message = req.trans('mikrocms@api_check_permission_not_found');
    } else if (registeredPermission !== null) {
      result.message = req.trans('mikrocms@api_check_role_permission_registered');
    } else {
      const newPermission = {
        'created_by': req.locals.session.user.user_id,
        'role_id': req.body.role_id,
        'permission_id': req.body.permission_id,
        'permit_create': req.body.permit_create || 'DISABLE',
        'permit_read': req.body.permit_read || 'DISABLE',
        'permit_update': req.body.permit_update || 'DISABLE',
        'permit_delete': req.body.permit_delete || 'DISABLE'
      };

      const createdRolePermission = await modelRolePermission.add(newPermission);

      if (createdRolePermission) {
        result.status = 200;
        result.message = req.trans('mikrocms@api_process_permission_add_success');
        result.role_permission_id = createdRolePermission.role_permission_id;
      } else {
        result.message = req.trans('mikrocms@api_process_permission_add_failed');
      }

      await modelActivityLog.add({
        'activity_label': 'ROLE-PERMISSION-ADD',
        'activity_description': locale(
          'en-US',
          result.status === 200 ? 'mikrocms@api_log_permission_add_success' : 'mikrocms@api_log_permission_add_failed',
          {
            'role_permission_id': result.role_permission_id,
            'errors': result.message
          }
        ),
        'session_id': req.locals.session.session_id
      });
    }

    res.status(result.status).json(result);
  }

  return [
    setPermission,
    middleware(['permission']),
    body('role_id')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_role_id_required')
      .isNumeric()
      .withMessage('mikrocms@api_input_role_id_format')
      .toInt(),
    body('permission_id')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_permission_id_required')
      .isNumeric()
      .withMessage('mikrocms@api_input_permission_id_format')
      .toInt(),
    body('permission_id')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_permission_id_required')
      .isNumeric()
      .withMessage('mikrocms@api_input_permission_id_format')
      .toInt(),
    body('permit_create')
      .isIn(['ENABLE', 'DISABLE'])
      .withMessage('mikrocms@api_input_permission_permit_create_format'),
    body('permit_read')
      .isIn(['ENABLE', 'DISABLE'])
      .withMessage('mikrocms@api_input_permission_permit_read_format'),
    body('permit_update')
      .isIn(['ENABLE', 'DISABLE'])
      .withMessage('mikrocms@api_input_permission_permit_update_format'),
    body('permit_delete')
      .isIn(['ENABLE', 'DISABLE'])
      .withMessage('mikrocms@api_input_permission_permit_delete_format'),
    handlerAddRolePermission
  ];
};
