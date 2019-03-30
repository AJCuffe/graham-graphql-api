import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    internalPlant: [InternalPlantItem!]
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
