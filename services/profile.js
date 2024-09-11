const mockProfile = require('./mock/profile');

module.exports = function () {
  async function handlerProfile(req, res) {
    res.status(200).json({
      'status': 200,
      'message': null,
      'user': mockProfile(req.locals.session)
    });
  }

  return [
    handlerProfile
  ];
};
