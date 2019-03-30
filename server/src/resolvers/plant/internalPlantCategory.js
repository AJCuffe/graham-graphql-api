import { combineResolvers } from 'graphql-resolvers';
import { UserInputError } from 'apollo-server';
import { isAuthenticated, isAdmin } from '../authorization';

// ====== CREATE =====

// Create a new Plant Category

// ======= READ =======

// Return a list of all Plant Categories
// Return a Plant Category by ID

// ====== UPDATE ======

// Update a Plant Category by ID

// ====== DELETE ======

// Delete a Plant Category by ID

export default {
  Query: {
    internalPlantCategories: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, args, { models }) =>
        await models.InternalPlantCategory.findAll(),
    ),
    internalPlantCategoryById: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { id }, { models }) => {
        const category = await models.InternalPlantCategory.findOne({
          where: { id },
        });
        if (!category) {
          throw new UserInputError('No such category with the specified ID.');
        }
        return category;
      },
    ),
  },
  Mutation: {
    createInternalPlantCategory: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { name }, { models, me }) => {
        return await models.InternalPlantCategory.create({
          name,
          userId: me.id,
        });
      },
    ),
    updateInternalPlantCategory: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { id, name }, { models }) => {
        const category = await models.InternalPlantCategory.findOne({
          where: { id },
        });
        if (!category) {
          throw new UserInputError(
            'There is no category with the specified ID.',
          );
        }
        const affectedRows = await models.InternalPlantCategory.update(
          { name },
          { where: { id }, returning: true, plain: true },
        );

        return affectedRows[1];
      },
    ),
    deleteInternalPlantCategory: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { id }, { models }) =>
        await models.InternalPlantCategory.destroy({ where: { id } }),
    ),
  },
  InternalPlantCategory: {
    createdBy: async (internalPlantCategory, args, { models }) =>
      await models.User.findOne({
        where: {
          id: internalPlantCategory.userId,
        },
      }),
    internalPlantItems: async (internalPlantCategory, args, { models }) =>
      await models.InternalPlantItem.findAll({
        where: {
          internalPlantCategoryId: internalPlantCategory.id,
        },
      }),
  },
};
