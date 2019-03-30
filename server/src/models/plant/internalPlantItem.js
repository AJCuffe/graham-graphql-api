const internalPlantItem = (sequelize, DataTypes) => {
  const InternalPlantItem = sequelize.define('internalPlantItem', {
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    internalRate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    openMarketRate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    difference: {
      type: DataTypes.DOUBLE,
    },
  });

  InternalPlantItem.associate = models => {
    InternalPlantItem.belongsTo(models.User);
    InternalPlantItem.belongsTo(models.InternalPlantCategory);
  };

  InternalPlantItem.beforeCreate(async internalPlantObject => {
    // eslint-disable-next-line no-param-reassign
    internalPlantObject.difference =
      internalPlantObject.openMarketRate - internalPlantObject.internalRate;
  });

  return InternalPlantItem;
};

export default internalPlantItem;
