const { body, validationResult } = require('express-validator');

module.exports = function ({ model, locale }) {
  const modelRole = model('role');
  const modelActivityLog = model('activity_log');

  async function handlerAddRole(req, res) {
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
      'role_id': null
    };

    const registeredRole = await modelRole.select({
      'role_name': req.body.role_name
    });

    if (registeredRole) {
      result.message = req.trans('mikrocms@api_check_role_name_registered');
    } else {
      const newRole = {
        'created_by': req.locals.session.user.user_id,
        'role_name': req.body.role_name,
        'redirect': req.body.redirect
      };

      const createdRole = await modelRole.add(newRole);

      if (createdRole) {
        result.status = 200;
        result.message = req.trans('mikrocms@api_process_role_add_success');
        result.role_id = createdRole.role_id;
      } else {
        result.message = req.trans('mikrocms@api_process_role_add_failed');
      }

      await modelActivityLog.add({
        'activity_label': 'ROLE-ADD',
        'activity_description': locale(
          'en-US',
          result.status === 200 ? 'mikrocms@api_log_role_add_success' : 'mikrocms@api_log_role_add_failed',
          {
            'role_id': result.role_id,
            'errors': result.message
          }
        ),
        'session_id': req.locals.session.session_id
      });
    }

    res.status(result.status).json(result);
  }

  return [
    body('role_name')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_role_name_required')
      .isLength({ min: 3, max: 256 })
      .withMessage('mikrocms@api_input_role_name_limit'),
    body('redirect')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_role_redirect_required')
      .isLength({ min: 3, max: 512 })
      .withMessage('mikrocms@api_input_role_redirect_limit'),
    handlerAddRole
  ];
};
