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
    booking.bookingDate = new Date();
    let newBookingStart = new Date(booking.startBookDate);
    let newBookingEnd = new Date(booking.endBookDate);
    let bookingListing = yield listing_1.getListing(booking.listing.id);
    if (daysBetween(newBookingEnd, newBookingStart) < 1) {
        throw new Error('booking dates are less than a day');
    }
    else if (daysBetween(newBookingStart, new Date()) < 1) {
        throw new Error('booking start date cant be before current date');
    }
    else if (daysBetween(newBookingEnd, newBookingStart) > 15) {
        throw new Error('booking cant be for more than 15 days ');
    }
    if (!bookingListing) {
        throw new Error('listing doesnt exist');
    }
    else if (bookingListing.user.id === booking.user.id) {
        throw new Error('Users cant book their own listing');
    }
    let existingListingBooking = yield exports.getBookingByListingDate(booking.listing.id, booking.startBookDate);
    if (existingListingBooking) {
        throw new Error('Booking existing for the listing at the start date');
    }
    let existingUserBooking = yield exports.getBookingByUserDate(booking.user.id, booking.startBookDate);
    if (existingUserBooking) {
        throw new Error('Booking at start date exists for user');
    }
    const newBooking = yield Booking.query()
        .insertGraph(Object.assign({}, booking), {
        relate: true
    })
        .withGraphFetched('listing')
        .withGraphFetched('user');
    return newBooking;
});
exports.getBookingByListing = (listingId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield Booking.query()
        .where('listings_id', listingId)
        .withGraphFetched('listing')
        .withGraphFetched('user');
    return booking;
});
exports.getBookingByListingDate = (listingId, startDate) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield Booking.query()
        .where('listings_id', listingId)
        .where('endBookDate', '>=', startDate)
        .first()
        .withGraphFetched('listing')
        .withGraphFetched('user');
    return booking;
});
exports.getBookingByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const bookings = yield Booking.query()
        .where('users_id', userId)
        .withGraphFetched('listing')
        .withGraphFetched('user');
    return bookings;
});
exports.getBookingByUserDate = (userId, startDate) => __awaiter(void 0, void 0, void 0, function* () {
    const newStartDate = new Date('2020-04-12');
    const newEndDate = new Date('2020-04-16');
    console.log(newStartDate.getTime);
    console.log(newEndDate.getTime);
    const booking = yield Booking.query()
        .where('users_id', userId)
        .where('endBookDate', '>=', startDate)
        .first()
        .withGraphFetched('listing')
        .withGraphFetched('user');
    return booking;
});
function daysBetween(second, first) {
    // Copy date parts of the timestamps, discarding the time parts.
    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());
    // Do the math.
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = two.getTime() - one.getTime();
    var days = millisBetween / millisecondsPerDay;
    // Round down.
    return Math.floor(days);
}
