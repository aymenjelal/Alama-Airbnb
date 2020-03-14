import { Model } from 'objection';
import { User } from './user';
import {
  Review,
  ListingImage,
  OccupiedDate,
  Anemity,
  Geolocation
} from './knex_schema';
import { gql } from 'apollo-server-express';

export class Listing extends Model {
  static get tableName(): string {
    return 'listings';
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'listings.users_id',
          to: 'users.id'
        }
      },
      reviews: {
        relation: Model.HasManyRelation,
        modelClass: Review,
        join: {
          from: 'listings.id',
          to: 'reviews.listings_id'
        }
      },
      images: {
        relation: Model.HasManyRelation,
        modelClass: ListingImage,
        join: {
          from: 'listings.id',
          to: 'images.listings_id'
        }
      },
      occupiedDates: {
        relation: Model.HasManyRelation,
        modelClass: OccupiedDate,
        join: {
          from: 'listings.id',
          to: 'occupied_dates.listings_id'
        }
      },
      anemitys: {
        relation: Model.HasManyRelation,
        modelClass: Anemity,
        join: {
          from: 'listings.id',
          to: 'anemitys.listings_id'
        }
      },
      geolocations: {
        relation: Model.HasManyRelation,
        modelClass: Geolocation,
        join: {
          from: 'listings.id',
          to: 'geolocations.listings_id'
        }
      }
    };
  }
}

export const typeDef = gql`
  type listing {
    id: String
    name: String
  }
`;
