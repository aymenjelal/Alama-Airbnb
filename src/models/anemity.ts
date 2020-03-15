import { Model } from 'objection';
import { Listing } from './listing';
import { db } from '../database/db';

Model.knex(db);

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
