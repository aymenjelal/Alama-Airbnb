import { IResolvers } from 'graphql-tools';
import { User } from './models/User';
//require('dotenv').config();

interface NewUserType {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  street: string;
  phone: string;
  language: string;
  ishost: boolean;
  password: string;
}

const registerUser = async (user: NewUserType) => {
  const registeredUser: User = await User.query().insert({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    country: user.country,
    street: user.street,
    phone: user.phone,
    language: user.language,
    ishost: user.ishost,
    password: user.password
  });

  console.log(registeredUser.id);

  return registeredUser;
};

const getAllUsers = async () => {
  const users = await User.query();
  return users;
};
export const resolvers: IResolvers = {
  Query: {
    hello: () => 'hi',
    users: async () => getAllUsers()
  },

  Mutation: {
    registerUsers: async (_, { input }) => {
      let newUser: NewUserType = {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        country: input.country,
        street: input.street,
        phone: input.street,
        language: input.language,
        ishost: input.ishost,
        password: input.password
      };
      let registeredUser = await registerUser(newUser);
      return registeredUser;
    }
  }
};
