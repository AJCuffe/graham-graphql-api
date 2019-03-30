import { gql } from 'apollo-server-express';

import userSchema from './user';
import messageSchema from './message';
import schemeSchema from './scheme';
import projectSchema from './project';
import internalPlantItemSchema from './plant/internalPlantItem';
import internalPlantCategorySchema from './plant/internalPlantCategory';

const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [
  linkSchema,
  userSchema,
  messageSchema,
  schemeSchema,
  projectSchema,
  internalPlantItemSchema,
  internalPlantCategorySchema,
];
