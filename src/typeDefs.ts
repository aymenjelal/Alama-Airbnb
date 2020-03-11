import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    hello: String!
    users: [User]
  }

  type User {
    id: String
    firstName: String
    lastName: String
    email: String
    country: String
    street: String
    phone: String
    language: String
    ishost: Boolean
    password: String
  }

  input UserInput {
    firstName: String
    lastName: String
    email: String
    country: String
    street: String
    phone: String
    language: String
    ishost: Boolean
    password: String
  }

  type Mutation {
    registerUsers(input: UserInput): User!
  }
`;
