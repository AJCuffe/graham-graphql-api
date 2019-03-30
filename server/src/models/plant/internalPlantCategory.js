const internalPlantCategory = (sequelize, DataTypes) => {
  const InternalPlantCategory = sequelize.define('internalPlantCategory', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  InternalPlantCategory.associate = models => {
    InternalPlantCategory.hasMany(models.InternalPlantItem);
    InternalPlantCategory.belongsTo(models.User);
  };

  return InternalPlantCategory;
};

export default internalPlantCategory;
