import { combineResolvers } from 'graphql-resolvers';
import { UserInputError } from 'apollo-server';
import upperCaseFirst from 'upper-case-first';
import { isAuthenticated, isAdmin } from '../authorization';

// ====== CREATE =====

// Create Internal Plant Item

// ======= READ =======

// Return a list of all Internal Plant Items
// Return list containing a single Internal Plant Item by ID
// Return list containing a single Internal Plant Item by Code

// ====== UPDATE ======

// Update Internal Plant Item by ID
// Update Internal Plant Item by Code

// ====== DELETE ======

// Delete an Internal Plant Item by its ID
// Delete an Internal Plant Item by its Code

// ***********************************************************
// **    DELETE INTERNAL PLANT ITEM BY BOTH CODE AND ID
// ***********************************************************

async function deleteInternalPlantItem(criteriaObject, { models }) {
  const whereCriteria = {};

  if (Object.prototype.hasOwnProperty.call(criteriaObject, 'code')) {
    whereCriteria.code = criteriaObject.code;
  } else {
    whereCriteria.id = criteriaObject.id;
  }

  const deleted = await models.InternalPlantItem.destroy({
    where: whereCriteria,
  });
  if (!deleted) {
    return false;
  }
  return true;
}

// ***********************************************************
// **     UPDATE INTERNAL PLANT ITEM BY CODE AND ID
// ***********************************************************

async function updateInternalPlantItem(criteriaObject, { models }, args) {
  const whereCriteria = {};

  if (Object.prototype.hasOwnProperty.call(criteriaObject, 'code')) {
    whereCriteria.code = criteriaObject.code;
  } else {
    whereCriteria.id = criteriaObject.id;
  }

  const internalPlantItem = await models.InternalPlantItem.findOne({
    where: whereCriteria,
  });

  if (!internalPlantItem) {
    throw new UserInputError(
      `No such plant item with the ${upperCaseFirst(
        Object.keys(whereCriteria)[0],
      )} specified.`,
    );
  }

  const affectedRows = await models.InternalPlantItem.update(args, {
    where: whereCriteria,
    returning: true,
    plain: true,
  });

  return affectedRows[1];
}

export default {
  Query: {
    internalPlant: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, args, { models }) =>
        await models.InternalPlantItem.findAll(),
    ),
    internalPlantById: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { id }, { models }) =>
        await models.InternalPlantItem.findOne({ where: { id } }),
    ),
    internalPlantByCode: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { code }, { models }) =>
        await models.InternalPlantItem.findOne({ where: { code } }),
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
    updateInternalPlantItemById: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, args, { models }) => {
        return await updateInternalPlantItem({ id: args.id }, { models }, args);
      },
    ),
    updateInternalPlantItemByCode: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, args, { models }) => {
        return await updateInternalPlantItem(
          { code: args.code },
          { models },
          args,
        );
      },
    ),
    deleteInternalPlantItemById: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { id }, { models }) => {
        const deleted = await deleteInternalPlantItem({ id }, { models });
        if (!deleted) {
          return false;
        }
        return true;
      },
    ),
    deleteInternalPlantItemByCode: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { code }, { models }) => {
        const deleted = await deleteInternalPlantItem({ code }, { models });
        if (!deleted) {
          return false;
        }
        return true;
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
