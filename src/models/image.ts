import { Model } from 'objection';
import { Listing } from './listing';

export class ListingImage extends Model {
  id!: string;
  url!: string;
  static get tableName(): string {
    return 'images';
  }

  static get relationMappings() {
    return {
      Listing: {
        relation: Model.BelongsToOneRelation,
        modelClass: Listing,
        join: {
          from: 'images.listings_id',
          to: 'listings.id'
        }
      }
    };
  }
}
