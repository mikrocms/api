const cors = require('cors');

module.exports = function ({ env, locale }) {
  const allowedOrigin = env['mikrocms@api']?.cors || [];

  return [
    cors({
      origin: function (origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin || origin === 'null') return callback(null, true);

        if (allowedOrigin.indexOf(origin) === -1) {
          return callback(
            new Error(locale('en-US', 'mikrocms@api_cors')),
            false
          );
        }

        return callback(null, true);
      }
    })
  ];
};
