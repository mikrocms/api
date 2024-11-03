module.exports = function () {
  function handlerPermission(req, res, next) {
    for (var index in req.permission) {
      for (var permissionIndex in req.locals.session.user.role.permissions) {
        if (index === req.locals.session.user.role.permissions[permissionIndex].permission.permission_name) {
          for (var permitIndex in req.permission[index]) {
            if (req.permission[index][permitIndex] === req.locals.session.user.role.permissions[permissionIndex][permitIndex]) {
              req.permission.match = {
                [index]: req.permission[index]
              };

              return next();
            }
          }
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
