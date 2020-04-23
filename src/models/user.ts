import Knex from 'knex';
const connection = require('../database/knexfile');
import { Model } from 'objection';
import { Listing, Review } from './knex_schema';
import { gql } from 'apollo-server-express';
import { db } from '../database/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Booking } from './booking';

Model.knex(db);

export class User extends Model {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  country!: string;
  street!: string;
  phone!: string;
  language!: string;
  ishost!: boolean;
  confirmed!: boolean;
  password!: string;
  paypalAccount!: string;
  joinedDate!: Date;

  static get tableName(): string {
    return 'users';
  }

  static get relationMappings() {
    return {
      listings: {
        relation: Model.HasManyRelation,
        modelClass: Listing,
        join: {
          from: 'users.id',
          to: 'listings.users_id'
        }
      },
      reviews: {
        relation: Model.HasManyRelation,
        modelClass: Review,
        join: {
          from: 'users.id',
          to: 'reviews.users_id'
        }
      },
      bookings: {
        relation: Model.HasManyRelation,
        modelClass: Booking,
        join: {
          from: 'users.id',
          to: 'bookings.users_id'
        }
      }
    };
  }
}

export interface NewUserType {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  street: string;
  phone: string;
  language: string;
  ishost: boolean;
  password: string;
  joinedDate: Date;
}

export interface UpdateUserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  street: string;
  phone: string;
  language: string;
  ishost: boolean;
  confirmed: boolean;
  password: string;
}

export interface AuthDataType {
  userId: string;
  token: string;
  tokenExpiration: number;
}

export const registerUser = async (user: NewUserType): Promise<User> => {
  const existingUser: User = await User.query().findOne({ email: user.email });
  if (existingUser) {
    throw new Error('user already exists');
  }
  user.joinedDate = new Date();
  const passwordInput = user.password;
  const hashedPassword = await bcrypt.hash(passwordInput, 12);
  user.password = hashedPassword;
  const registeredUser: User = await User.query().insert({
    ...user
  });

  return registeredUser;
};

export const getAllUsers = async (): Promise<User[]> => {
  const users: User[] = await User.query()
    .withGraphFetched('listings')
    .withGraphFetched('reviews')
    .withGraphFetched('bookings')
    .orderBy('joinedDate', 'desc');
  return users;
};

export const getUser = async (userId: string): Promise<User> => {
  const user: User = await User.query()
    .findById(userId)
    .withGraphFetched('listings')
    .withGraphFetched('reviews')
    .withGraphFetched('bookings');
  return user;
};

export const updateUser = async (user: UpdateUserType): Promise<User> => {
  const existingUser: User = await User.query().findById(user.id);

  if (!existingUser) {
    throw new Error('user doesnt exist');
  }
  const updatedUser: User = await User.query().patchAndFetchById(user.id, {
    ...user
  });

  return updatedUser;
};

export const deleteUser = async (userId: string): Promise<Number> => {
  const deletedUser: number = await User.query().deleteById(userId);
  return deletedUser;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthDataType> => {
  const user: User = await User.query().findOne({ email: email });
  if (!user) {
    throw new Error('user doesnt exist');
  }

  if (!user.confirmed) {
    throw new Error('user is not confirmed');
  }

  const passEqual = await bcrypt.compare(password, user.password);
  if (!passEqual) {
    throw new Error('user doesnt exist');
  }

  const token = jwt.sign({ userId: user.id }, 'sercretkeyalamabnb', {
    expiresIn: '1h'
  });
  return {
    userId: user.id,
    token: token,
    tokenExpiration: 1
  };
};
