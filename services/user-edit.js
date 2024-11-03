const { body, validationResult } = require('express-validator');

module.exports = function ({ model, locale, middleware }) {
  const modelUser = model('user');
  const modelRole = model('role');
  const modelActivityLog = model('activity_log');

  function setPermission(req, res, next) {
    req.permission = {
      'USER': {
        'permit_update': 'ENABLE'
      }
    };

    return next();
  }

  async function handlerEditUser(req, res) {
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

    const selectedUser = await modelUser.find({
      queries: {
        'user_id': { 'eq': req.body.id }
      }
    });

    if (selectedUser === null) {
      result.message = req.trans('mikrocms@api_check_user_not_found');
    } else {
      let editAllowed = true;

      const newerUser = {
        'user_fullname': req.body.fullname
      };

      if (req.body.role_id) {
        if (selectedUser.role_id !== req.body.role_id) {
          const selectedRole = await modelRole.find({
            queries: {
              'role_id': { 'eq': req.body.role_id }
            }
          });

          if (selectedRole !== null) {
            newerUser.role_id = selectedRole.role_id;
          } else {
            editAllowed = false;
            result.message = req.trans('mikrocms@api_check_role_not_found');
          }
        }
      }

      if (req.body.email) {
        if (selectedUser.user_email !== req.body.email) {
          const registeredEmail = await modelUser.find({
            queries: {
              'user_email': { 'eq': req.body.email }
            }
          });

          if (registeredEmail === null) {
            newerUser.user_email = req.body.email;
          } else {
            editAllowed = false;
            result.message = req.trans('mikrocms@api_check_email_registered');
          }
        }
      }

      if (req.body.username) {
        if (selectedUser.user_username !== req.body.username) {
          const registeredUser = await modelUser.find({
            queries: {
              'user_username': { 'eq': req.body.username }
            }
          });

          if (registeredUser === null) {
            newerUser.user_username = req.body.username;            
          } else {
            editAllowed = false;
            result.message = req.trans('mikrocms@api_check_username_registered');
          }
        }
      }

      if (editAllowed) {
        const updatedUser = await modelUser.update(selectedUser, newerUser);

        if (updatedUser) {
          result.status = 200;
          result.message = req.trans('mikrocms@api_process_user_edit_success');
        } else {
          result.message = req.trans('mikrocms@api_process_user_edit_failed');
        }
      }

      await modelActivityLog.add({
        'activity_label': 'USER-EDIT',
        'activity_description': locale(
          'en-US',
          result.status === 200 ? 'mikrocms@api_log_user_edit_success' : 'mikrocms@api_log_user_edit_failed',
          {
            'user_id': selectedUser.user_id,
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
    body('id')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_user_id_required')
      .isNumeric()
      .withMessage('mikrocms@api_input_user_id_format')
      .toInt(),
    body('email')
      .optional({ checkFalsy: true })
      .isLength({ min: 1, max: 256 })
      .withMessage('mikrocms@api_input_user_email_limit'),
    body('username')
      .optional({ checkFalsy: true })
      .isLength({ min: 3, max: 64 })
      .withMessage('mikrocms@api_input_user_username_limit')
      .isAlphanumeric()
      .withMessage('mikrocms@api_input_user_username_format'),
    body('fullname')
      .optional({ checkFalsy: true })
      .isLength({ min: 1, max: 256 })
      .withMessage('mikrocms@api_input_user_fullname_limit'),
    body('role_id')
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage('mikrocms@api_input_role_id_format')
      .toInt(),
    handlerEditUser
  ];
};
