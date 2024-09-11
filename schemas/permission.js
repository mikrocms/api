module.exports = function (DataTypes) {
  return {
    attributes: {
      'permission_id': {
        type: DataTypes.INTEGER({ length: 16 }).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      'permission_name': {
        type: DataTypes.STRING({ length: 64 }),
        allowNull: false,
        unique: true
      },
      'permission_description': {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    options: {
      tableName: 'permissions',
      timestamps: false
    }
  };
};
