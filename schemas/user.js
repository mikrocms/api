module.exports = function ({ DataTypes }) {
  return {
    attributes: {
      'user_id': {
        type: DataTypes.INTEGER({ length: 16 }).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      'created_at': {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: DataTypes.NOW
      },
      'created_by': {
        type: DataTypes.INTEGER({ length: 16 }).UNSIGNED,
        allowNull: false
      },
      'updated_at': {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: null
      },
      'updated_by': {
        type: DataTypes.INTEGER({ length: 16 }).UNSIGNED,
        allowNull: true,
        defaultValue: null
      },
      'deleted_at': {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: null
      },
      'deleted_by': {
        type: DataTypes.INTEGER({ length: 16 }).UNSIGNED,
        allowNull: true,
        defaultValue: null
      },
      'user_email': {
        type: DataTypes.STRING({ length: 256 }),
        allowNull: false,
        unique: true
      },
      'user_username': {
        type: DataTypes.STRING({ length: 64 }),
        allowNull: false,
        unique: true
      },
      'user_password': {
        type: DataTypes.STRING({ length: 64 }),
        allowNull: false
      },
      'user_fullname': {
        type: DataTypes.STRING({ length: 256 }),
        allowNull: false
      },
      'role_id': {
        type: DataTypes.INTEGER({ length: 3 }).UNSIGNED,
        allowNull: false
      }
    },
    options: {
      tableName: 'users',
      timestamps: false
    }
  };
};
