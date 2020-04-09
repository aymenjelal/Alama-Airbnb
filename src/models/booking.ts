import { Model } from 'objection';
import { Listing, getListing } from './listing';
import { User } from './user';
import { db } from '../database/db';

Model.knex(db);

export class Booking extends Model {
  id!: string;
  user!: User;
  listing!: Listing;
  startBookDate!: Date;
  endBookDate!: Date;
  bookingDate!: Date;

  static get tableName(): string {
    return 'bookings';
  }

  static get relationMappings() {
    return {
      listing: {
        relation: Model.BelongsToOneRelation,
        modelClass: Listing,
        join: {
          from: 'bookings.listings_id',
          to: 'listings.id'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'bookings.users_id',
          to: 'users.id'
        }
      }
    };
  }
}

export interface BookingType {
  user: User;
  listing: Listing;
  startBookDate: Date;
  endBookDate: Date;
  bookingDate: Date;
}

export const addNewBooking = async (booking: BookingType): Promise<Booking> => {
  booking.bookingDate = new Date();

  let newBookingStart = new Date(booking.startBookDate);

  let newBookingEnd = new Date(booking.endBookDate);

  let bookingListing = await getListing(booking.listing.id);

  if (daysBetween(newBookingEnd, newBookingStart) < 1) {
    throw new Error('booking dates are less than a day');
  } else if (daysBetween(newBookingStart, new Date()) < 1) {
    throw new Error('booking start date cant be before current date');
  } else if (daysBetween(newBookingEnd, newBookingStart) > 15) {
    throw new Error('booking cant be for more than 15 days ');
  }

  if (!bookingListing) {
    throw new Error('listing doesnt exist');
  } else if (bookingListing.user.id === booking.user.id) {
    throw new Error('Users cant book their own listing');
  }

  const newBooking: Booking = await Booking.query().insertGraph(
    {
      ...booking
    },
    {
      relate: true
    }
  );

  return newBooking;
};

export const getBookingByListing = async (
  listingId: string
): Promise<Booking[]> => {
  const booking: Booking[] = await Booking.query()
    .where('listings_id', listingId)
    .withGraphFetched('listing')
    .withGraphFetched('user');

  return booking;
};

export const getBookingByListingDates = async (
  listingId: string,
  startDate: Date,
  endDate: Date
): Promise<Booking> => {
  const booking: Booking = await Booking.query()
    .where('users_id', listingId)
    .whereBetween('startBookDate', [startDate, endDate])
    .first();

  return booking;
};

export const getBookingByUser = async (userId: string): Promise<Booking[]> => {
  const bookings: Booking[] = await Booking.query()
    .where('users_id', userId)
    .withGraphFetched('listing')
    .withGraphFetched('user');

  return bookings;
};

export const getBookingByUserDates = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Booking> => {
  const booking: Booking = await Booking.query()
    .where('users_id', userId)
    .whereBetween('startBookDate', [startDate, endDate])
    .first();

  return booking;
};

function daysBetween(second: Date, first: Date) {
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
