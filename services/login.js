const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');

module.exports = function ({ env, model }) {
  const secret = env['mikrocms@api']?.secret || 'mikrocms';
  const modelUser = model('user');
  const modelSession = model('session');

  async function handlerLogin(req, res) {
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
      'token': null,
      'redirect': null
    };

    const username = req.body.username;
    const password = crypto.createHmac('sha256', secret)
                      .update(req.body.password)
                      .digest('hex');

    const selectedUser = await modelUser.select({
      'user_username': username
    });

    if (selectedUser) {
      const passwordMatched = await bcrypt.compare(password, selectedUser.user_password);

      if (passwordMatched) {
        const expired = new Date(Date.now() + (1000 * 60 * 60 * 24));
        const clientDevice = req.get('user-agent');
        const clientIP = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
        const token = crypto.createHmac('sha256', secret)
                        .update(crypto.randomBytes(120).toString())
                        .digest('hex');

        const newSession = {
          'session_expired': expired,
          'session_token': token,
          'session_device': clientDevice,
          'session_ip': clientIP,
          'session_valid': 'AKTIF',
          'user_id': selectedUser.user_id
        };

        const createdSession = await modelSession.add(newSession);

        if (createdSession) {
          result.status = 200;
          result.message = req.trans('mikrocms@api_process_login_success');
          result.token = token;
          result.redirect = selectedUser.role?.redirect;
        } else {
          result.message = req.trans('mikrocms@api_process_login_failed');
        }
      } else {
        result.message = req.trans('mikrocms@api_process_invalid_user');
      }
    } else {
      result.message = req.trans('mikrocms@api_process_invalid_user');
    }

    res.status(result.status).json(result);
  }

  return [
    body('username')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_username_required')
      .isLength({ min: 3, max: 64 })
      .withMessage('mikrocms@api_input_username_limit')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('mikrocms@api_input_username_format'),
    body('password')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_password_required')
      .isLength({ min: 3, max: 64 })
      .withMessage('mikrocms@api_input_password_limit'),
    handlerLogin
  ];
};
