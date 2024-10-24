const { body, validationResult } = require('express-validator');

module.exports = function ({ model, locale }) {
  const modelRole = model('role');
  const modelActivityLog = model('activity_log');

  async function handlerEditRole(req, res) {
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

    const selectedRole = await modelRole.select({
      'role_id': req.body.id
    });

    if (selectedRole === null) {
      result.message = req.trans('mikrocms@api_check_role_not_found');
    } else {
      let editAllowed = true;

      const newerRole = {
        'redirect': req.body.redirect
      };

      if (req.body.role_name) {
        if (selectedRole.role_name !== req.body.role_name) {
          const registeredRole = await modelRole.select({
            'role_name': req.body.role_name
          });

          if (registeredRole) {
            editAllowed = false;
            result.message = req.trans('mikrocms@api_check_role_name_registered');
          } else {
            newerRole.role_name = req.body.role_name;
          }
        }
      }

      if (editAllowed) {
        const updatedRole = await modelRole.update(selectedRole, newerRole);

        if (updatedRole) {
          result.status = 200;
          result.message = req.trans('mikrocms@api_process_role_edit_success');
        } else {
          result.message = req.trans('mikrocms@api_process_role_edit_failed');
        }
      }

      await modelActivityLog.add({
        'activity_label': 'ROLE-EDIT',
        'activity_description': locale(
          'en-US',
          result.status === 200 ? 'mikrocms@api_log_role_edit_success' : 'mikrocms@api_log_role_edit_failed',
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
    body('id')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_role_id_required')
      .isNumeric()
      .withMessage('mikrocms@api_input_role_id_format')
      .toInt(),
    body('role_name')
      .optional({ checkFalsy: true })
      .isLength({ min: 3, max: 256 })
      .withMessage('mikrocms@api_input_role_name_limit'),
    body('redirect')
      .optional({ checkFalsy: true })
      .isLength({ min: 1, max: 512 })
      .withMessage('mikrocms@api_input_role_redirect_limit'),
    handlerEditRole
  ];
};
