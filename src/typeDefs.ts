import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    hello: String!
    users: [User]
  }

  type listing {
    id: String
    name: String
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
    listings: [listing]
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
