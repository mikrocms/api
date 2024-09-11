module.exports = function (DataTypes) {
  return {
    attributes: {
      'session_id': {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      'session_created': {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: DataTypes.NOW
      },
      'session_expired': {
        type: DataTypes.TIME,
        allowNull: false
      },
      'session_token': {
        type: DataTypes.STRING({ length: 120 }),
        allowNull: false
      },
      'session_device': {
        type: DataTypes.TEXT,
        allowNull: false
      },
      'session_ip': {
        type: DataTypes.STRING({ length: 64 }),
        allowNull: false
      },
      'session_valid': {
        type: DataTypes.ENUM(['AKTIF', 'TIDAK']),
        allowNull: false
      },
      'user_id': {
        type: DataTypes.INTEGER({ length: 16 }).UNSIGNED,
        allowNull: false
      }
    },
    options: {
      tableName: 'sessions',
      timestamps: false
    }
  }
};
