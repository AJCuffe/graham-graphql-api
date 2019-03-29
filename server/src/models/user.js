import bcrypt from 'bcrypt';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 42],
      },
    },
    role: {
      type: DataTypes.STRING,
    },
  });

  User.associate = models => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
    User.hasMany(models.Scheme);
    User.hasMany(models.Project);
  };

  User.findByLogin = async login => {
    let currentUser = await User.findOne({
      where: { username: login },
    });

    if (!currentUser) {
      currentUser = await User.findOne({
        where: { email: login },
      });
    }

    return currentUser;
  };

  // eslint-disable-next-line func-names
  User.prototype.generatePasswordHash = async function() {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
  };

  // eslint-disable-next-line func-names
  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  User.beforeCreate(async userObject => {
    // eslint-disable-next-line no-param-reassign
    userObject.password = await userObject.generatePasswordHash();
  });

  return User;
};

export default user;
