const { body, validationResult } = require('express-validator');

module.exports = function ({ model }) {
  const modelUser = model('user');

  async function handlerAuthRecovery(req, res) {
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
        'user_username': { 'eq': req.body.username }
      }
    });

    if (selectedUser) {
      result.status = 200;
      result.message = req.trans('mikrocms@api_process_recovery_success');
    } else {
      result.message = req.trans('mikrocms@api_process_recovery_failed');
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
    handlerAuthRecovery
  ];
};
