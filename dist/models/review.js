"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
            listing: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: listing_1.Listing,
                join: {
                    from: 'reviews.listings_id',
                    to: 'listings.id'
                }
            },
            user: {
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
exports.addNewReview = (review) => __awaiter(void 0, void 0, void 0, function* () {
    review.createdAt = new Date();
    review.lastUpdatedAt = new Date();
    const newReview = yield Review.query().insertGraph(Object.assign({}, review), {
        relate: true
    });
    return newReview;
});
exports.getReviewbyListing = (listingId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review.query().where('listings_id', listingId);
    return reviews;
});
exports.updateReview = (review) => __awaiter(void 0, void 0, void 0, function* () {
    review.lastUpdatedAt = new Date();
    const updatedReview = yield Review.query().patchAndFetchById(review.id, Object.assign({}, review));
    return updatedReview;
});
exports.deleteReview = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedReview = yield Review.query().deleteById(reviewId);
    return deletedReview;
});
