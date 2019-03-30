import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from './user';
import messageResolvers from './message';
import schemeResolvers from './scheme';
import projectResolvers from './project';
import internalPlantItemResolvers from './plant/internalPlantItem';
import internalPlantCategoryResolvers from './plant/internalPlantCategory';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  customScalarResolver,
  userResolvers,
  messageResolvers,
  schemeResolvers,
  projectResolvers,
  internalPlantItemResolvers,
  internalPlantCategoryResolvers,
];
