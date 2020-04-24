import { Model } from 'objection';
import { Listing, getListing } from './listing';
import { User } from './user';
import { db } from '../database/db';
var dateFormat = require('dateformat');

Model.knex(db);

export class Booking extends Model {
  id!: string;
  user!: User;
  listing!: Listing;
  confirmed!: boolean;
  paid!: boolean;
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

export interface UpdateBookingType {
  id: string;
  user: User;
  listing: Listing;
  startBookDate: Date;
  endBookDate: Date;
  bookingDate: Date;
}

//function to add a new booking
export const addNewBooking = async (booking: BookingType): Promise<Booking> => {
  booking.bookingDate = new Date();

  let newBookingStart = new Date(booking.startBookDate);

  let newBookingEnd = new Date(booking.endBookDate);

  let bookingListing = await getListing(booking.listing.id);

  //check booking date constraints
  if (daysBetween(newBookingEnd, newBookingStart) < 1) {
    throw new Error('booking dates are less than a day');
  } else if (daysBetween(newBookingStart, new Date()) < 1) {
    throw new Error('booking start date cant be before current date');
  } else if (daysBetween(newBookingEnd, newBookingStart) > 15) {
    throw new Error('booking cant be for more than 15 days ');
  }

  //check if listing exists
  if (!bookingListing) {
    throw new Error('listing doesnt exist');
  } else if (bookingListing.user.id === booking.user.id) {
    throw new Error('Users cant book their own listing');
  }

  //check for existing bookings at start date
  let existingListingBooking = await getBookingByListingDate(
    booking.listing.id,
    booking.startBookDate,
    booking.endBookDate
  );
  if (existingListingBooking) {
    throw new Error('Booking existing for the listing at the start date');
  }

  //check for existing bookings for the user
  let existingUserBooking = await getBookingByUserDate(
    booking.user.id,
    booking.startBookDate,
    booking.endBookDate
  );
  if (existingUserBooking) {
    throw new Error('Booking at start date exists for user');
  }

  //add new booking to database
  const newBooking: Booking = await Booking.query()
    .insertGraph(
      {
        ...booking
      },
      {
        relate: true
      }
    )
    .withGraphFetched('listing')
    .withGraphFetched('user');

  return newBooking;
};

//function to get a booking by Id
export const getBooking = async (bookingId: string): Promise<Booking> => {
  const booking: Booking = await Booking.query()
    .findById(bookingId)
    .withGraphFetched('listing')
    .withGraphFetched('user');
  return booking;
};

//fuction to get a booking by listing
export const getBookingByListing = async (
  listingId: string
): Promise<Booking[]> => {
  const booking: Booking[] = await Booking.query()
    .where('listings_id', listingId)
    .withGraphFetched('listing')
    .withGraphFetched('user');

  return booking;
};

//function to get booking by listing and start date
export const getBookingByListingDate = async (
  listingId: string,
  startDate: Date,
  endDate: Date
): Promise<Booking> => {
  const booking: Booking = await Booking.query()
    .where('listings_id', listingId)
    .where('endBookDate', '>=', startDate)
    .where('startBookDate', '<=', endDate)
    .first()
    .withGraphFetched('listing')
    .withGraphFetched('user');

  return booking;
};

//function to get booking for user
export const getBookingByUser = async (userId: string): Promise<Booking[]> => {
  const bookings: Booking[] = await Booking.query()
    .where('users_id', userId)
    .withGraphFetched('listing')
    .withGraphFetched('user');

  return bookings;
};

//function to get booking by user and start date
export const getBookingByUserDate = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Booking> => {
  const booking: Booking = await Booking.query()
    .where('users_id', userId)
    .where('endBookDate', '>=', startDate)
    .where('startBookDate', '<', endDate)
    .first()
    .withGraphFetched('listing')
    .withGraphFetched('user');

  return booking;
};

//function to get bookings with start date the same as current date
export const getTodaysCheckins = async (): Promise<Booking[]> => {
  const today = dateFormat(new Date(), 'yyyy-mm-dd');
  const bookings: Booking[] = await Booking.query()
    .where('startBookDate', '=', today)
    .where('paid', false)
    .withGraphFetched('listing')
    .withGraphFetched('user');

  return bookings;
};

//function to get future bookings for a listing
export const getFutureBookingByListing = async (
  listingId: string
): Promise<Booking[]> => {
  const today = dateFormat(new Date(), 'yyyy-mm-dd');

  const futureBookings: Booking[] = await Booking.query()
    .where('listings_id', listingId)
    .where('endBookDate', '>=', today)
    .withGraphFetched('listing')
    .withGraphFetched('user');

  return futureBookings;
};

//function to delete booking
export const deleteBookingByListing = async (
  listingId: string
): Promise<Number> => {
  const deletedBooking: number = await Booking.query()
    .delete()
    .where('listings_id', listingId);

  return deletedBooking;
};

//function to cancel booking
export const cancelBooking = async (booking: Booking): Promise<Number> => {
  const today = new Date();

  //check if booking was confirmed
  if (!booking.confirmed) {
    throw new Error('Booking cant be canceled for unconfirmed booking');
  }

  //check the amount of days before start date
  const dateDifference = daysBetween(booking.startBookDate, today);
  if (dateDifference <= 1) {
    throw new Error('Booking cant be cancled a day or less before start date');
  }

  //cancel booking
  const cancledBooking: number = await Booking.query().deleteById(booking.id);

  return cancledBooking;
};

//function to update booking
export const updateBooking = async (
  booking: UpdateBookingType
): Promise<Booking> => {
  const existingBooking: Booking = await Booking.query().findById(booking.id);

  if (!existingBooking) {
    throw new Error('Booking doesnt exist');
  }

  const updatedBooking: Booking = await Booking.query().patchAndFetchById(
    booking.id,
    {
      ...booking
    }
  );

  return updatedBooking;
};

//function to delete booking that have not been confirmed
export const checkConfirmation = async () => {
  //get bookings that are not confirmed
  let bookings: Booking[] = await Booking.query().where('confirmed', false);
  let today = new Date();

  //delete bookings that hav not been confirmed in an hour
  bookings.forEach(async booking => {
    let hours =
      Math.abs(today.getTime() - booking.bookingDate.getTime()) / 3600000;

    if (hours >= 1) {
      await Booking.query().deleteById(booking.id);
    }
  });
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
