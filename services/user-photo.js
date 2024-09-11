const { validationResult } = require('express-validator');
const multer = require('multer');

module.exports = function ({ model }) {
  const modelUser = model('user');

  const uploadImageConfig = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'public/images/users');
      },
      filename: function (req, file, cb) {
        cb(null, `${req.locals.session.user.user_id}.png`);
      }
    }),
    limits: {
      fileSize: 5242880
    },
    fileFilter: function (req, file, cb) {
      const allowedImage = [
        'image/png',
        'image/jpg',
        'image/jpeg'
      ];

      if (allowedImage.indexOf(file.mimetype) < 0) {
        cb(req.trans('mikrocms@api_input_userphoto_format'), false);
      } else {
        cb(null, true);
      }
    }
  });

  const uploadImageResource = uploadImageConfig.single('photo');

  function handlerImageUpload(req, res, next) {
    uploadImageResource(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.status(400).json({
          'status': 400,
          'message': err.message
        });
      } else if (typeof err === 'string') {
        res.status(400).json({
          'status': 400,
          'message': err
        });
      } else {
        next();
      }
    });
  }

  async function handlerUserPhoto(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        'status': 400,
        'message': req.transvalidator(errors.array({ onlyFirstError: true }))
      });
    }

    const result = {
      'status': 200,
      'message': null
    };

    const newerUser = {
      'updated_by': req.locals.session.user.user_id
    };

    const updatedUser = await modelUser.update(req.locals.session.user, newerUser);

    if (updatedUser) {
      result.message = req.trans('mikrocms@api_process_userphoto_upload_success');
    } else {
      result.message = req.trans('mikrocms@api_process_userphoto_upload_failed');
    }

    res.status(result.status).json(result);
  }

  return [
    handlerImageUpload,
    handlerUserPhoto
  ];
};
