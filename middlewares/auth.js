const { header, validationResult } = require('express-validator');

module.exports = function ({ model }) {
  const modelSession = model('session');

  async function handlerAuth(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        'message': req.transvalidator(errors.array({ onlyFirstError: true }))
      });
    }

    const result = {
      'status': 403,
      'message': null
    };

    const token = req.header('Authorization')?.split(' ')[1] || null;

    if (token) {
      const currentSession = await modelSession.find({
        queries: {
          'session_token': { 'eq': token }
        }
      });
  
      if (currentSession !== null) {
        const currentDate = Date.now();
        const expiredDate = (new Date(currentSession.session_expired)).getTime();
  
        if (currentDate < expiredDate) {
          req.locals = {
            session: currentSession
          };
  
          return next();
        } else {
          result.message = req.trans('mikrocms@api_check_access');
        }
      } else {
        result.message = req.trans('mikrocms@api_check_access');
      }
    } else {
      result.status = 400;
      result.message = req.trans('mikrocms@api_input_token_format');
    }
  
    res.status(result.status).json(result);
  }
 
  return [
    header('Authorization')
      .exists({ checkFalsy: true })
      .withMessage('mikrocms@api_input_token_required')
      .isLength({ min: 32, max: 120 })
      .withMessage('mikrocms@api_input_token_limit'),
    handlerAuth
  ];
};
