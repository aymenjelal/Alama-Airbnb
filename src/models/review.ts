import { Model } from 'objection';
import { Listing } from './listing';
import { User } from './user';

export class Review extends Model {
  static get tableName(): string {
    return 'reviews';
  }

  static get relationMappings() {
    return {
      Listing: {
        relation: Model.BelongsToOneRelation,
        modelClass: Listing,
        join: {
          from: 'reviews.listings_id',
          to: 'listings.id'
        }
      },
      User: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'reviews.users_id',
          to: 'users.id'
        }
      }
    };
  }
}
