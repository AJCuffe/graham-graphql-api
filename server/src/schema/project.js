import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    projects: [Project!]
    projectsBySchemeId(id: ID!): [Project!]
    projectsBySchemeCode(code: String!): [Project!]
    projectById(id: ID!): Project!
    projectByPin(pin: Int!): Project!
    activeProjects: [Project!]
    activeProjectsBySchemeId(id: ID!): [Project!]
    activeProjectsBySchemeCode(code: String!): [Project!]
    inactiveProjects: [Project!]
    inactiveProjectsBySchemeId(id: ID!): [Project!]
    inactiveProjectsBySchemeCode(code: String!): [Project!]
    projectsCreatedByUserID(id: ID!): [Project!]
  }
  extend type Mutation {
    createProject(pin: Int!, name: String!, schemeCode: String!): Project!
    updateProjectById(id: ID!, pin: Int, name: String, code: String): Project!
    updateProjectByPin(pin: Int!, name: String, code: String): Project!
    toggleActiveStatusById(id: ID!, active: Boolean!): Boolean!
    toggleActiveStatusByPin(pin: Int!, active: Boolean!): Boolean!
    deleteProjectById(id: ID!): Boolean!
    deleteProjectByPin(pin: Int!): Boolean!
  }
  type Project {
    pin: Int!
    name: String!
    active: Boolean!
    createdAt: Date!
    createdBy: User!
  }
`;
