const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');

module.exports = function ({ env, model, locale }) {
  const secret = env['mikrocms@api']?.secret || 'mikrocms';
  const salt = env['mikrocms@api']?.salt || 10;
  const modelUser = model('user');
  const modelRole = model('role');
  const modelActivityLog = model('activity_log');

  async function handlerAddUser(req, res) {
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
      'user_id': null
    };

    const registeredEmail = await modelUser.select({
      'user_email': req.body.email
    });

    const registeredUsername = await modelUser.select({
      'user_username': req.body.username
    });

    const selectedRole = await modelRole.select({
      'role_id': req.body.role_id
    });

    if (registeredEmail !== null) {
      result.message = req.trans('mikrocms@api_check_email_registered');
    } else if (registeredUsername !== null) {
      result.message = req.trans('mikrocms@api_check_username_registered');
    } else if (selectedRole === null) {
      result.message = req.trans('mikrocms@api_check_role_not_found');
    } else {
      const password = await bcrypt.hash(
                        crypto.createHmac('sha256', secret)
                          .update(req.body.password)
                          .digest('hex'),
                        salt
                       );

      const newUser = {
        'created_by': req.locals.session.user.user_id,
        'user_email': req.body.email,
        'user_username': req.body.username,
        'user_password': password,
        'user_fullname': req.body.fullname,
        'role_id': req.body.role_id
      };

      const createdUser = await modelUser.add(newUser);

      if (createdUser) {
        result.status = 200;
        result.message = req.trans('mikrocms@api_process_user_add_success');
        result.user_id = createdUser.user_id;
      } else {
        result.message = req.trans('mikrocms@api_process_user_add_failed');
      }

      await modelActivityLog.add({
        'activity_label': 'USER-ADD',
        'activity_description': locale(
          'en-US',
          result.status === 200 ? 'mikrocms@api_log_user_add_success' : 'mikrocms@api_log_user_add_failed',
          {
            'user_id': result.user_id,
            'errors': result.message
          }
        ),
        'session_id': req.locals.session.session_id
      });
    }

    res.status(result.status).json(result);
  }

  return [
    body('email')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_user_email_required')
      .isLength({ min: 1, max: 256 })
      .withMessage('mikrocms@api_input_user_email_limit'),
    body('username')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_user_username_required')
      .isLength({ min: 3, max: 64 })
      .withMessage('mikrocms@api_input_user_username_limit')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('mikrocms@api_input_user_username_format'),
    body('password')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_user_password_required')
      .isLength({ min: 3, max: 64 })
      .withMessage('mikrocms@api_input_user_password_limit'),
    body('fullname')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_user_fullname_required')
      .isLength({ min: 1, max: 256 })
      .withMessage('mikrocms@api_input_user_fullname_limit'),
    body('role_id')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_role_id_required')
      .isNumeric()
      .withMessage('mikrocms@api_input_role_id_format')
      .toInt(),
    handlerAddUser
  ];
};
