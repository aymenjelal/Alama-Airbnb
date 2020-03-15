"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const listing_1 = require("./listing");
const db_1 = require("../database/db");
objection_1.Model.knex(db_1.db);
class Anemity extends objection_1.Model {
    static get tableName() {
        return 'anemitys';
    }
    static get relationMappings() {
        return {
            Listing: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: listing_1.Listing,
                join: {
                    from: 'anemitys.listings_id',
                    to: 'listings.id'
                }
            }
        };
    }
}
exports.Anemity = Anemity;
