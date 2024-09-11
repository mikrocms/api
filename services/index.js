module.exports = [
  {
    'router': '/api/v1',
    'handler': {
      '/login': {
        'post': require('./login')
      },
      '/recovery': {
        'post': require('./recovery')
      }
    }
  },
  {
    'router': '/api/v1/u',
    'handler': {
      '/logout': {
        'post': require('./logout')
      },
      '/profile': {
        'get': require('./profile')
      },
      '/profile/photo': {
        'post': require('./user-photo')
      },
      '/profile/password': {
        'post': require('./user-password')
      },
      '/roles': {
        'get': require('./role-list')
      },
      '/role': {
        'post': require('./role-add'),
        'put': require('./role-edit')
      },
      '/role/:roleId': {
        'get': require('./role'),
        'delete': require('./role-delete')
      },
      '/permissions': {
        'get': require('./permission-list')
      },
      '/role-permission': {
        'post': require('./role-permission-add')
      },
      '/role-permission/:rolePermissionId': {
        'delete': require('./role-permission-delete')
      },
      '/users': {
        'get': require('./user-list')
      },
      '/user': {
        'post': require('./user-add'),
        'put': require('./user-edit')
      },
      '/user/:userId': {
        'get': require('./user'),
        'delete': require('./user-delete')
      }
    }
  }
];
