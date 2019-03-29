const project = (sequelize, DataTypes) => {
  const Project = sequelize.define('project', {
    pin: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 6],
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
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  Project.associate = models => {
    Project.belongsTo(models.User);
    Project.belongsTo(models.Scheme);
  };

  return Project;
};

export default project;
