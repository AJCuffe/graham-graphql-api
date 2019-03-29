import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    scheme(id: ID!): Scheme
    schemes: [Scheme!]
  }
  extend type Mutation {
    createScheme(code: String!, name: String!): Scheme!
  }
  type Scheme {
    code: String!
    name: String!
    createdAt: Date!
    createdBy: User!
    projects: [Project!]
  }
`;
