"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const listing_1 = require("./listing");
const db_1 = require("../database/db");
objection_1.Model.knex(db_1.db);
class Geolocation extends objection_1.Model {
    static get tableName() {
        return 'geolocations';
    }
    static get relationMappings() {
        return {
            Listing: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: listing_1.Listing,
                join: {
                    from: 'geolocations.listings_id',
                    to: 'listings.id'
                }
            }
        };
    }
}
exports.Geolocation = Geolocation;
