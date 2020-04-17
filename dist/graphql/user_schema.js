"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = `
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
exports.inputs = `
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
  }
`;
exports.queries = `
    users: [User]
    user(id: String): User
    login(email:String!, password: String!): AuthData!
`;
exports.mutations = `
    registerUsers(input: NewUserInput): User!
    updateUser(input: UpdateUserInput): User!
    deleteUser(input: String): deletedNumber!
`;
