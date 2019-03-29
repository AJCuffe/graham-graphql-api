const scheme = (sequelize, DataTypes) => {
  const Scheme = sequelize.define('scheme', {
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [4, 4],
      },
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Scheme.associate = models => {
    Scheme.belongsTo(models.User);
    Scheme.hasMany(models.Project);
  };

  return Scheme;
};

export default scheme;
