const { param, validationResult } = require('express-validator');

module.exports = function ({ model, locale, middleware }) {
  const modelRole = model('role');
  const modelActivityLog = model('activity_log');

  function setPermission(req, res, next) {
    req.permission = {
      'ROLE': {
        'permit_delete': 'ENABLE'
      }
    };

    return next();
  }

  async function handlerDeleteRole(req, res) {
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

    const selectedRole = await modelRole.find({
      queries: {
        'role_id': { 'eq': req.params.roleId }
      }
    });

    if (selectedRole === null) {
      result.message = req.trans('mikrocms@api_check_role_not_found');
    } else {
      const deletedRole = await modelRole.remove(selectedRole, {
        'deleted_by': req.locals.session.user.user_id
      });

      if (deletedRole) {
        result.status = 200;
        result.message = req.trans('mikrocms@api_process_role_delete_success');
      } else {
        result.message = req.trans('mikrocms@api_process_role_delete_failed');
      }

      await modelActivityLog.add({
        'activity_label': 'ROLE-DELETE',
        'activity_description': locale(
          'en-US',
          result.status === 200 ? 'mikrocms@api_log_role_delete_success' : 'mikrocms@api_log_role_delete_failed',
          {
            'role_id': selectedRole.role_id,
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
    param('roleId')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_role_id_required')
      .isNumeric()
      .withMessage('mikrocms@api_input_role_id_format')
      .toInt(),
    handlerDeleteRole
  ];
};
