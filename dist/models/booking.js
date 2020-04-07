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
class Booking extends objection_1.Model {
    static get tableName() {
        return 'bookings';
    }
    static get relationMappings() {
        return {
            listing: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: listing_1.Listing,
                join: {
                    from: 'bookings.listings_id',
                    to: 'listings.id'
                }
            },
            user: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: user_1.User,
                join: {
                    from: 'bookings.users_id',
                    to: 'users.id'
                }
            }
        };
    }
}
exports.Booking = Booking;
exports.addNewBooking = (booking) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(booking.startBookDate);
    booking.bookingDate = new Date();
    const newBooking = yield Booking.query().insertGraph(Object.assign({}, booking), {
        relate: true
    });
    return newBooking;
});
exports.getBookingByListing = (listingId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield Booking.query()
        .where('listings_id', listingId);
    return booking;
});
exports.getBookingByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const bookings = yield Booking.query().where('users_id', userId);
    return bookings;
});
