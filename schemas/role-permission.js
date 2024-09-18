module.exports = function ({ DataTypes }) {
  return {
    attributes: {
      'role_permission_id': {
        type: DataTypes.INTEGER({ length: 16 }).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      'role_id': {
        type: DataTypes.INTEGER({ length: 3 }).UNSIGNED,
        allowNull: false
      },
      'permission_id': {
        type: DataTypes.INTEGER({ length: 16 }).UNSIGNED,
        allowNull: false
      }
    },
    options: {
      tableName: 'role_permission',
      timestamps: false
    }
  };
};
