"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const listing_1 = require("./listing");
const user_1 = require("./user");
const db_1 = require("../database/db");
objection_1.Model.knex(db_1.db);
class Review extends objection_1.Model {
    static get tableName() {
        return 'reviews';
    }
    static get relationMappings() {
        return {
            Listing: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: listing_1.Listing,
                join: {
                    from: 'reviews.listings_id',
                    to: 'listings.id'
                }
            },
            User: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: user_1.User,
                join: {
                    from: 'reviews.users_id',
                    to: 'users.id'
                }
            }
        };
    }
}
exports.Review = Review;
