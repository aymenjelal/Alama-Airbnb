import { IResolvers } from 'graphql-tools';
import {
  User,
  NewUserType,
  registerUser,
  getAllUsers,
  getUser,
  UpdateUserType,
  updateUser,
  deleteUser
} from './models/user';
import {
  getAllListings,
  getListing,
  addListing,
  NewListingType,
  updateListing,
  Listing
} from './models/listing';
import { GraphQLScalarType, Kind } from 'graphql';
//require('dotenv').config();

// interface NewUserType {
//   firstName: string;
//   lastName: string;
//   email: string;
//   country: string;
//   street: string;
//   phone: string;
//   language: string;
//   ishost: boolean;
//   password: string;
// }

// const registerUser = async (user: NewUserType) => {
//   const registeredUser: User = await User.query().insert({
//     ...user
//   });

//   return registeredUser;
// };

// const getAllUsers = async () => {
//   const users = await User.query().withGraphFetched('listings');
//   return users;
// };
export const resolvers: IResolvers = {
  Query: {
    users: async () => getAllUsers(),
    user: async (_, { id }) => getUser(id),
    listings: async () => getAllListings(),
    listing: async (_, { id }) => getListing(id)
  },

  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    }
  }),

  Mutation: {
    registerUsers: async (_, { input }) => {
      let newUser: NewUserType = {
        ...input
      };
      let registeredUser = await registerUser(newUser);
      return registeredUser;
    },

    updateUser: async (_, { input }) => {
      let user: UpdateUserType = {
        ...input
      };
      let updatedUser = await updateUser(user);
      return updatedUser;
    },

    deleteUser: async (_, { input }) => {
      let deletedUser = await deleteUser(input);
      return {
        deleted: deletedUser
      };
    },

    addNewListing: async (_, { input }) => {
      let listing: NewListingType = {
        ...input
      };
      let newListing = await addListing(listing);
      return newListing;
    },

    updateListing: async (_, { input }) => {
      let listing: Listing = {
        ...input
      };

      let updatedListing = await updateListing(listing);

      return updatedListing;
    }
  }
};
