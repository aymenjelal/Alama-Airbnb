import { Model } from 'objection';
import { Listing } from './listing';
import { db } from '../database/db';

Model.knex(db);

export class Geolocation extends Model {
  id!: string;
  lat!: number;
  long!: number;
  static get tableName(): string {
    return 'geolocations';
  }

  static get relationMappings() {
    return {
      Listing: {
        relation: Model.BelongsToOneRelation,
        modelClass: Listing,
        join: {
          from: 'geolocations.listings_id',
          to: 'listings.id'
        }
      }
    };
  }
}
