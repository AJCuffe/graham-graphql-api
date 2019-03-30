import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isAdmin } from '../authorization';

export default {
  Query: {
    internalPlant: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, args, { models }) =>
        await models.InternalPlantItem.findAll(),
    ),
  },
  Mutation: {
    createInternalPlantItem: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (
        parent,
        {
          categoryId,
          code,
          name,
          internalRate,
          openMarketRate,
          difference,
          comment,
        },
        { models, me },
      ) => {
        // Create new internal plant item
        return await models.InternalPlantItem.create({
          code,
          name,
          internalRate,
          openMarketRate,
          comment,
          difference,
          internalPlantCategoryId: categoryId,
          userId: me.id,
        });
      },
    ),
  },
  InternalPlantItem: {
    createdBy: async (internalPlant, args, { models }) =>
      await models.User.findOne({
        where: {
          id: internalPlant.userId,
        },
      }),
    category: async (internalPlant, args, { models }) => {
      return await models.InternalPlantCategory.findOne({
        where: {
          id: internalPlant.internalPlantCategoryId,
        },
      });
    },
  },
};
