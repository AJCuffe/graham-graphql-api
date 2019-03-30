import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    internalPlantCategories: [InternalPlantCategory!]
    internalPlantCategoryById(id: ID!): InternalPlantCategory!
  }
  extend type Mutation {
    createInternalPlantCategory(name: String!): InternalPlantCategory!
    updateInternalPlantCategory(id: ID!, name: String!): InternalPlantCategory!
    deleteInternalPlantCategory(id: ID!): Boolean!
  }
  type InternalPlantCategory {
    name: String!
    internalPlantItems: [InternalPlantItem!]
    createdAt: Date!
    updatedAt: Date!
    createdBy: User!
  }
`;
