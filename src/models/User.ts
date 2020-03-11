import Knex from 'knex';
const connection = require('../database/knexfile');
import { Model } from 'objection';
import { Listing, Review } from './knex_schema';

const knexConnection = Knex(connection);
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
