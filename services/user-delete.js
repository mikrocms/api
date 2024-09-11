const { param, validationResult } = require('express-validator');

module.exports = function ({ model, locale }) {
  const modelUser = model('user');
  const modelActivityLog = model('activity_log');

  async function handlerDeleteUser(req, res) {
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

    const selectedUser = await modelUser.select({
      'user_id': req.params.userId
    });

    if (selectedUser === null) {
      result.message = req.trans('mikrocms@api_check_user_not_found');
    } else {
      const deletedUser = await modelUser.remove(selectedUser, {
        'deleted_by': req.locals.session.user.user_id
      });

      if (deletedUser) {
        result.status = 200;
        result.message = req.trans('mikrocms@api_process_user_delete_success');
      } else {
        result.message = req.trans('mikrocms@api_process_user_delete_failed');
      }

      await modelActivityLog.add({
        'activity_label': 'USER-DELETE',
        'activity_description': locale(
          'en-US',
          result.status === 200 ? 'mikrocms@api_log_user_delete_success' : 'mikrocms@api_log_user_delete_failed',
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
    param('userId')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_user_id_required')
      .isNumeric()
      .withMessage('mikrocms@api_input_user_id_format')
      .toInt(),
    handlerDeleteUser
  ];
};
