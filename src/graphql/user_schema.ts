import { gql } from 'apollo-server-express';
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date';

export const types = `
  type User {
    id: String
    firstName: String
    lastName: String
    email: String
    country: String
    street: String
    phone: String
    language: String
    paypalAccount: String
    ishost: Boolean
    confirmed: Boolean
    joinedDate: Date
    listings: [Listing]
    reviews: [Review]
    bookings: [Booking]
  }

  type deletedNumber{
    deleted: Int
  }

  type AuthData{
    userId: String!
    token: String!
    tokenExpiration: Int!
  }
`;

export const inputs = `
    input NewUserInput {
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

    input UpdateUserInput {
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
      paypalAccount: String
  }
`;

export const queries = `
    users: [User]
    user(id: String): User
    login(email:String!, password: String!): AuthData!
`;

export const mutations = `
    registerUsers(input: NewUserInput): User!
    updateUser(input: UpdateUserInput): User!
    deleteUser(input: String): deletedNumber!
`;
