import { Model } from 'objection';
import { Listing } from './listing';
import { User } from './user';
import { db } from '../database/db';

Model.knex(db);

export class Booking extends Model {
  id!: string;
  user!: User;
  isting!: Listing;
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
  isting: Listing;
  startBookDate: Date;
  endBookDate: Date;
  bookingDate: Date;
}

export const addNewBooking = async (booking: BookingType): Promise<Booking> => {
  console.log(booking.startBookDate);
  booking.bookingDate = new Date();

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
  .where('listings_id', listingId);

  return booking;
};

export const getBookingByUser = async (userId: string): Promise<Booking[]> => {
  const bookings: Booking[] = await Booking.query().where('users_id', userId);

  return bookings;
};
