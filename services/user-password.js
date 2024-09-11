const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');

module.exports = function ({ env, model, locale }) {
  const secret = env['mikrocms@api']?.secret || 'mikrocms';
  const salt = env['mikrocms@api']?.salt || 10;
  const modelUser = model('user');
  const modelActivityLog = model('activity_log');

  async function handlerEditUserPassword(req, res) {
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

    const passwordOld = crypto.createHmac('sha256', secret)
                          .update(req.body.password_old)
                          .digest('hex');

    const passwordOldMatched = await bcrypt.compare(
      passwordOld,
      req.locals.session.user.user_password
    );

    if (passwordOldMatched) {
      const passwordNew = await bcrypt.hash(
                            crypto.createHmac('sha256', secret)
                              .update(req.body.password_new)
                              .digest('hex'),
                            salt
                          );

      const newerUser = {
        'updated_by': req.locals.session.user.user_id,
        'user_password': passwordNew
      };

      const updatedUser = await modelUser.update(req.locals.session.user, newerUser);

      if (updatedUser) {
        result.status = 200;
        result.message = req.trans('mikrocms@api_process_password_update_success');
      } else {
        result.message = req.trans('mikrocms@api_process_password_update_failed');
      }

      await modelActivityLog.add({
        'activity_label': 'USER-PASSWORD',
        'activity_description': locale(
          'en-US',
          result.status === 200 ? 'mikrocms@api_log_password_update_success' : 'mikrocms@api_log_password_update_failed',
          {
            'user_id': req.locals.session.user.user_id
          }
        ),
        'session_id': req.locals.session.session_id
      });
    } else {
      result.message = req.trans('mikrocms@api_check_password_old');
    }

    res.status(result.status).json(result);
  }

  return [
    body('password_old')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_password_required')
      .isLength({ min: 3, max: 64 })
      .withMessage('mikrocms@api_input_password_limit'),
    body('password_new')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_password_required')
      .isLength({ min: 3, max: 64 })
      .withMessage('mikrocms@api_input_password_limit'),
    handlerEditUserPassword
  ];
};
