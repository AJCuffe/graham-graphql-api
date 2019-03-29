import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isAdmin } from './authorization';

// Return list of all schemes
// Return list containing a single Scheme by its ID

export default {
  Query: {
    // Return list of all schemes
    schemes: combineResolvers(
      isAuthenticated,
      async (parent, args, { models }) => await models.Scheme.findAll(),
    ),
    // Return info on a single scheme
    scheme: combineResolvers(
      isAuthenticated,
      async (parent, { id }, { models }) =>
        await models.Scheme.findOne({ where: { id } }),
    ),
  },
  Mutation: {
    createScheme: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { code, name }, { models, me }) => {
        const scheme = await models.Scheme.create({
          code,
          name,
          userId: me.id,
        });
        return scheme;
      },
    ),
  },
  Scheme: {
    createdBy: async (scheme, args, { models }) =>
      await models.User.findOne({
        where: {
          id: scheme.userId,
        },
      }),
    projects: async (scheme, args, { models }) => {
      const returnedProjects = await models.Project.findAll({
        where: {
          schemeId: scheme.id,
        },
      });
      return returnedProjects;
    },
  },
};
