import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { isAuthenticated, isAdmin } from './authorization';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign(
    {
      id,
      email,
      username,
      role,
    },
    secret,
    {
      expiresIn,
    },
  );
};

export default {
  Query: {
    users: async (parent, args, { models }) => await models.User.findAll(),
    user: async (parent, { id }, { models }) =>
      await models.User.findOne({ where: { id } }),
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }
      return await models.User.findOne({ where: { id: me.id } });
    },
  },

  Mutation: {
    /** ***********************************************************
     * Register a new user
     ** ********************************************************* */
    signUp: async (
      parent,
      { username, email, password },
      { models, secret },
    ) => {
      const user = await models.User.create({
        username,
        email,
        password,
      });

      return { token: createToken(user, secret, '30m') };
    },

    /** ***********************************************************
     * Sign in a user
     ** ********************************************************* */

    signIn: async (parent, { login, password }, { models, secret }) => {
      const user = await models.User.findByLogin(login);
      if (!user) {
        throw new UserInputError(
          'No user found with the provided login credentials.',
        );
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return { token: createToken(user, secret, '30m') };
    },

    /** ***********************************************************
     * Delete a user if user is authenticated and is an admin
     ** ********************************************************* */

    deleteUser: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { id }, { models }) =>
        await models.User.destroy({
          where: { id },
        }),
    ),
  },

  User: {
    messages: async (user, args, { models }) =>
      await models.Message.findAll({
        where: {
          userId: user.id,
        },
      }),
  },
};
