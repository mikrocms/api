module.exports = function ({ DataTypes }) {
  return {
    attributes: {
      'role_permission_id': {
        type: DataTypes.INTEGER({ length: 16 }).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      'permit_create': {
        type: DataTypes.ENUM('ENABLE', 'DISABLE'),
        allowNull: false,
        defaultValue: 'DISABLE'
      },
      'permit_read': {
        type: DataTypes.ENUM('ENABLE', 'DISABLE'),
        allowNull: false,
        defaultValue: 'DISABLE'
      },
      'permit_update': {
        type: DataTypes.ENUM('ENABLE', 'DISABLE'),
        allowNull: false,
        defaultValue: 'DISABLE'
      },
      'permit_delete': {
        type: DataTypes.ENUM('ENABLE', 'DISABLE'),
        allowNull: false,
        defaultValue: 'DISABLE'
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
