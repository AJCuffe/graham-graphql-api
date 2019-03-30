import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    internalPlant: [InternalPlantItem!]
    internalPlantById(id: ID!): InternalPlantItem!
    internalPlantByCode(code: String!): InternalPlantItem!
  }
  extend type Mutation {
    createInternalPlantItem(
      categoryId: Int!
      code: String!
      name: String!
      internalRate: Float!
      openMarketRate: Float!
      difference: Float
      comment: String
    ): InternalPlantItem!
    updateInternalPlantItemById(
      id: ID!
      code: String
      name: String
      internalRate: Float
      openMarketRate: Float
      comment: String
    ): InternalPlantItem!
    updateInternalPlantItemByCode(
      code: String!
      name: String
      internalRate: Float
      openMarketRate: Float
      comment: String
    ): InternalPlantItem!
    deleteInternalPlantItemById(id: ID!): Boolean!
    deleteInternalPlantItemByCode(code: String!): Boolean!
  }
  type InternalPlantItem {
    category: InternalPlantCategory!
    code: String!
    name: String!
    openMarketRate: Float!
    internalRate: Float!
    difference: Float!
    comment: String
    createdBy: User!
  }
`;
