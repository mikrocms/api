const { param, validationResult } = require('express-validator');
const mockUser = require('./mock/user');

module.exports = function ({ model }) {
  const modelUser = model('user');

  async function handlerUser(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        'status': 400,
        'message': req.transvalidator(errors.array({ onlyFirstError: true }))
      });
    }

    const result = {
      'status': 200,
      'message': null,
      'user': null
    };

    const selectedUser = await modelUser.select({
      'user_id': req.params.userId
    });

    if (selectedUser !== null) {
      result.user = mockUser(selectedUser);
    }

    res.status(result.status).json(result);
  }

  return [
    param('userId')
      .exists({ checkFalsy: false })
      .withMessage('mikrocms@api_input_user_id_required')
      .isNumeric()
      .withMessage('mikrocms@api_input_user_id_format')
      .toInt(),
    handlerUser
  ];
};
