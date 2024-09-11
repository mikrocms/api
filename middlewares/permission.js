module.exports = function () {
  function handlerPermission(req, res, next) {
    for (var index in req.permission) {
      for (var permissionIndex in req.locals.session.user.role.permissions) {
        if (req.permission[index] === req.locals.session.user.role.permissions[permissionIndex].permission.permission_name) {
          req.permission.match = req.locals.session.user.role.permissions[permissionIndex];

          return next();
        }
      }
    }

    res.status(403).json({
      'status': 403,
      'message': req.trans('mikrocms@api_access_denied')
    });
  }

  return [
    handlerPermission
  ];
};
