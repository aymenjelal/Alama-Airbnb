import { gql } from 'apollo-server-express';

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
    ishost: Boolean
    password: String
    listings: [Listing]
  }

  type deletedNumber{
    deleted: Int
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
  }
`;

export const queries = `
    users: [User]
    user(id: String): User
`;

export const mutations = `
    registerUsers(input: NewUserInput): User!
    updateUser(input: UpdateUserInput): User!
    deleteUser(input: String): deletedNumber!
`;
