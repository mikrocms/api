const { param, validationResult } = require('express-validator');

module.exports = function ({ model, locale }) {
  const modelRolePermission = model('role_permission');
  const modelActivityLog = model('activity_log');

  async function handlerDeleteRolePermission(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        'status': 400,
        'message': req.transvalidator(errors.array({ onlyFirstError: true }))
      });
    }

    const result = {
      'status': 400,
      'message': null
    };
  
    const selectedRolePermission = await modelRolePermission.select({
      'role_permission_id': req.params.rolePermissionId
    });

    if (selectedRolePermission === null) {
      result.message = req.trans('mikrocms@api_check_role_permission_not_found');
    } else {
      const deletedRolePermission = await modelRolePermission.remove(selectedRolePermission);

      if (deletedRolePermission) {
        result.status = 200;
        result.message = req.trans('mikrocms@api_process_permission_delete_success');
      } else {
        result.message = req.trans('mikrocms@api_process_permission_delete_failed');
      }

      await modelActivityLog.add({
        'activity_label': 'ROLE-PERMISSION-DELETE',
        'activity_description': locale(
          'en-US',
          result.status === 200 ? 'mikrocms@api_log_permission_delete_success' : 'mikrocms@api_log_permission_delete_failed',
          {
            'role_permission_id': selectedRolePermission.role_permission_id,
            'errors': result.message
          }
        ),
        'session_id': req.locals.session.session_id
      });
    }

    res.status(result.status).json(result);
  }

  return [
    param('rolePermissionId')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_role_permission_id_required')
      .isNumeric()
      .withMessage('mikrocms@api_input_role_permission_id_format')
      .toInt(),
    handlerDeleteRolePermission
  ];
};
