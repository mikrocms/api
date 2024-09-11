module.exports = {
  'activity_log': {
    'connection': 'default',
    'structure': require('./activity-log')
  },
  'permission': {
    'connection': 'default',
    'structure': require('./permission')
  },
  'role_permission': {
    'connection': 'default',
    'structure': require('./role-permission')
  },
  'role': {
    'connection': 'default',
    'structure': require('./role')
  },
  'session': {
    'connection': 'default',
    'structure': require('./session')
  },
  'user': {
    'connection': 'default',
    'structure': require('./user')
  }
};
