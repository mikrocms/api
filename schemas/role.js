module.exports = function (DataTypes) {
  return {
    attributes: {
      'role_id': {
        type: DataTypes.INTEGER({ length: 3 }).UNSIGNED,
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
      'role_name': {
        type: DataTypes.STRING({ length: 256 }),
        allowNull: false,
        unique: true
      },
      'redirect': {
        type: DataTypes.STRING({ length: 512 }),
        allowNull: false,
        defaultValue: '/'
      }
    },
    options: {
      tableName: 'roles',
      timestamps: false
    }
  };
};
