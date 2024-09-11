module.exports = function ({ model }) {
  const modelSession = model('session');

  async function handlerAuthLogout(req, res) {
    const result = {
      'status': 400,
      'message': null
    };

    const deletedSession = await modelSession.update(req.locals.session, {
      'session_expired': new Date(),
      'session_valid': 'TIDAK'
    });

    if (deletedSession) {
      result.status = 200;
      result.message = req.trans('mikrocms@api_process_logout_success');
    } else {
      result.message = req.trans('mikrocms@api_process_logout_failed');
    }

    res.status(result.status).json(result);
  }

  return [
    handlerAuthLogout
  ];
}
