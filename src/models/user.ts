import Knex from 'knex';
const connection = require('../database/knexfile');
import { Model } from 'objection';
import { Listing, Review } from './knex_schema';
import { gql } from 'apollo-server-express';
import { db } from '../database/db';

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
  password!: string;
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
  password: string;
}

export const registerUser = async (user: NewUserType): Promise<User> => {
  user.joinedDate = new Date();
  const registeredUser: User = await User.query().insert({
    ...user
  });

  return registeredUser;
};

export const getAllUsers = async (): Promise<User[]> => {
  const users: User[] = await User.query().withGraphFetched('listings');
  return users;
};

export const getUser = async (userId: string): Promise<User> => {
  const user: User = await User.query().findById(userId);
  return user;
};

export const updateUser = async (user: UpdateUserType): Promise<User> => {
  const updatedUser: User = await User.query().patchAndFetchById(user.id, {
    ...user
  });

  return updatedUser;
};

export const deleteUser = async (userId: string): Promise<Number> => {
  const deletedUser: number = await User.query().deleteById(userId);
  return deletedUser;
};
