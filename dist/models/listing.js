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
const user_1 = require("./user");
const knex_schema_1 = require("./knex_schema");
const review_1 = require("./review");
const image_1 = require("./image");
const anemity_1 = require("./anemity");
const geolocation_1 = require("./geolocation");
const db_1 = require("../database/db");
const booking_1 = require("./booking");
objection_1.Model.knex(db_1.db);
class Listing extends objection_1.Model {
    static get tableName() {
        return 'listings';
    }
    static get relationMappings() {
        return {
            user: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: user_1.User,
                join: {
                    from: 'listings.users_id',
                    to: 'users.id'
                }
            },
            bookings: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: booking_1.Booking,
                join: {
                    from: 'listings.id',
                    to: 'bookings.listings_id'
                }
            },
            reviews: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: review_1.Review,
                join: {
                    from: 'listings.id',
                    to: 'reviews.listings_id'
                }
            },
            images: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: image_1.ListingImage,
                join: {
                    from: 'listings.id',
                    to: 'images.listings_id'
                }
            },
            occupiedDates: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: knex_schema_1.OccupiedDate,
                join: {
                    from: 'listings.id',
                    to: 'occupied_dates.listings_id'
                }
            },
            anemitys: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: anemity_1.Anemity,
                join: {
                    from: 'listings.id',
                    to: 'anemitys.listings_id'
                }
            },
            geolocations: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: geolocation_1.Geolocation,
                join: {
                    from: 'listings.id',
                    to: 'geolocations.listings_id'
                }
            }
        };
    }
}
exports.Listing = Listing;
exports.getAllListings = () => __awaiter(void 0, void 0, void 0, function* () {
    const listings = yield Listing.query()
        .withGraphFetched('user')
        .withGraphFetched('reviews')
        .withGraphFetched('images')
        .withGraphFetched('geolocations')
        .withGraphFetched('anemitys')
        .withGraphFetched('bookings');
    return listings;
});
exports.getActiveListings = () => __awaiter(void 0, void 0, void 0, function* () {
    const listings = yield Listing.query()
        .where('status', 'active')
        .withGraphFetched('user')
        .withGraphFetched('reviews')
        .withGraphFetched('images')
        .withGraphFetched('geolocations')
        .withGraphFetched('anemitys')
        .withGraphFetched('bookings');
    return listings;
});
exports.getListing = (listingId) => __awaiter(void 0, void 0, void 0, function* () {
    const listing = yield Listing.query()
        .findById(listingId)
        .withGraphFetched('user')
        .withGraphFetched('reviews')
        .withGraphFetched('images')
        .withGraphFetched('geolocations')
        .withGraphFetched('anemitys')
        .withGraphFetched('bookings');
    return listing;
});
exports.getListingByIdAndUser = (listingId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const listing = yield Listing.query()
        .findById(listingId)
        .where('users_id', userId);
    return listing;
});
exports.getListingByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const listings = yield Listing.query()
        .where('users_id', userId)
        .withGraphFetched('reviews')
        .withGraphFetched('images')
        .withGraphFetched('geolocations')
        .withGraphFetched('anemitys')
        .withGraphFetched('bookings');
    return listings;
});
exports.addListing = (listing) => __awaiter(void 0, void 0, void 0, function* () {
    listing.createdAt = new Date();
    listing.status = 'active';
    const newListing = yield Listing.query()
        .insertGraph(Object.assign({}, listing), {
        relate: true
    })
        .withGraphFetched('user')
        .withGraphFetched('reviews')
        .withGraphFetched('images')
        .withGraphFetched('geolocations')
        .withGraphFetched('anemitys')
        .withGraphFetched('bookings');
    return newListing;
});
exports.updateListing = (listing, userId) => __awaiter(void 0, void 0, void 0, function* () {
    let checkListing = yield exports.getListingByIdAndUser(listing.id, userId);
    if (!checkListing) {
        throw new Error('Listing doesnt exist for the user');
    }
    const updatedListing = yield Listing.query()
        .upsertGraphAndFetch(Object.assign({}, listing), {
        relate: true
    })
        .withGraphFetched('user')
        .withGraphFetched('reviews')
        .withGraphFetched('images')
        .withGraphFetched('geolocations')
        .withGraphFetched('anemitys')
        .withGraphFetched('bookings');
    return updatedListing;
});
exports.searchListing = (listingSearch) => __awaiter(void 0, void 0, void 0, function* () {
    const listings = yield Listing.query()
        .skipUndefined()
        .where('city', 'like', '%' + listingSearch.city + '%')
        .where('price', '<=', listingSearch.price)
        .where('personCapacity', '>=', listingSearch.personCapacity)
        .where('country', 'like', '%' + listingSearch.country + '%')
        .withGraphFetched('user')
        .withGraphFetched('reviews')
        .withGraphFetched('images')
        .withGraphFetched('geolocations')
        .withGraphFetched('anemitys')
        .withGraphFetched('bookings');
    return listings;
});
exports.deleteListing = (listingId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    let checkListing = yield exports.getListingByIdAndUser(listingId, userId);
    if (!checkListing) {
        throw new Error('Listing doesnt exist for the user');
    }
    let futureBooking = yield booking_1.getFutureBookingByListing(listingId);
    if (futureBooking.length != 0) {
        throw new Error('bookings exist for the listing, cant be deleted');
    }
    let deletedBooking = yield booking_1.deleteBookingByListing(listingId);
    const deletedListing = yield Listing.query().deleteById(listingId);
    return deletedListing;
});
