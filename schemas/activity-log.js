module.exports = function ({ DataTypes }) {
  return {
    attributes: {
      'activity_id': {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      'activity_created': {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      'activity_label': {
        type: DataTypes.STRING({ length: 256 }),
        allowNull: false
      },
      'activity_description': {
        type: DataTypes.TEXT,
        allowNull: false
      },
      'session_id': {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      }
    },
    options: {
      tableName: 'activity_logs',
      timestamps: false
    }
  };
};
