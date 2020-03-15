import { Model } from 'objection';
import { Listing } from './listing';

export class Anemity extends Model {
  id!: string;
  name!: string;
  static get tableName(): string {
    return 'anemitys';
  }

  static get relationMappings() {
    return {
      Listing: {
        relation: Model.BelongsToOneRelation,
        modelClass: Listing,
        join: {
          from: 'anemitys.listings_id',
          to: 'listings.id'
        }
      }
    };
  }
}
