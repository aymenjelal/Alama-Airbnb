import { Model } from 'objection';
import { User } from './user';
import { gql } from 'apollo-server-express';
import { Review } from './review';
import { ListingImage } from './image';
import { Anemity } from './anemity';
import { Geolocation } from './geolocation';
import { db } from '../database/db';
import {
  Booking,
  getFutureBookingByListing,
  deleteBookingByListing,
  getBookingByListing
} from './booking';
import { sendUpdateListingEmail } from '../services/EmailService';

Model.knex(db);

export class Listing extends Model {
  id!: string;
  name!: string;
  price!: number;
  street!: string;
  city!: string;
  country!: string;
  bedrooms!: number;
  bathrooms!: number;
  personCapacity!: number;
  houseType!: string;
  rating!: number;
  status!: string;
  user!: User;
  geolocations!: Geolocation[];
  images!: ListingImage[];
  anemitys!: Anemity[];
  bookings!: Booking[];
  createdAt!: Date;

  static get tableName(): string {
    return 'listings';
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'listings.users_id',
          to: 'users.id'
        }
      },
      bookings: {
        relation: Model.HasManyRelation,
        modelClass: Booking,
        join: {
          from: 'listings.id',
          to: 'bookings.listings_id'
        }
      },
      reviews: {
        relation: Model.HasManyRelation,
        modelClass: Review,
        join: {
          from: 'listings.id',
          to: 'reviews.listings_id'
        }
      },
      images: {
        relation: Model.HasManyRelation,
        modelClass: ListingImage,
        join: {
          from: 'listings.id',
          to: 'images.listings_id'
        }
      },
      anemitys: {
        relation: Model.HasManyRelation,
        modelClass: Anemity,
        join: {
          from: 'listings.id',
          to: 'anemitys.listings_id'
        }
      },
      geolocations: {
        relation: Model.HasManyRelation,
        modelClass: Geolocation,
        join: {
          from: 'listings.id',
          to: 'geolocations.listings_id'
        }
      }
    };
  }
}

interface NewGeolocationType {
  lat: number;
  long: number;
}

interface NewImageType {
  url: string;
}

interface NewAnemityType {
  name: string;
}

interface ListingSearchType {
  city: string;
  country: string;
  price: number;
  personCapacity: number;
}

export interface NewListingType {
  name: string;
  price: number;
  street: string;
  city: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  personCapacity: number;
  houseType: string;
  rating: number;
  user: User;
  geolocations: NewGeolocationType[];
  images: NewImageType[];
  anemitys: NewAnemityType[];
  status: string;
  createdAt: Date;
}

//function to get all listing
export const getAllListings = async (): Promise<Listing[]> => {
  //get all listings from database
  const listings: Listing[] = await Listing.query()
    .withGraphFetched('user')
    .withGraphFetched('reviews')
    .withGraphFetched('images')
    .withGraphFetched('geolocations')
    .withGraphFetched('anemitys')
    .withGraphFetched('bookings')
    .orderBy('createdAt', 'desc');

  return listings;
};

//function to get all active listings
export const getActiveListings = async (): Promise<Listing[]> => {
  const listings: Listing[] = await Listing.query()
    .where('status', 'active')
    .withGraphFetched('user')
    .withGraphFetched('reviews')
    .withGraphFetched('images')
    .withGraphFetched('geolocations')
    .withGraphFetched('anemitys')
    .withGraphFetched('bookings')
    .orderBy('createdAt', 'desc');
  return listings;
};

//function to get a listing by Id
export const getListing = async (listingId: string): Promise<Listing> => {
  const listing: Listing = await Listing.query()
    .findById(listingId)
    .withGraphFetched('user')
    .withGraphFetched('reviews')
    .withGraphFetched('images')
    .withGraphFetched('geolocations')
    .withGraphFetched('anemitys')
    .withGraphFetched('bookings');

  return listing;
};

//fuction to get a listing by Id and userId
export const getListingByIdAndUser = async (
  listingId: string,
  userId: string
): Promise<Listing> => {
  const listing: Listing = await Listing.query()
    .findById(listingId)
    .where('users_id', userId);

  return listing;
};

//function to get user listings
export const getListingByUser = async (userId: string): Promise<Listing[]> => {
  const listings: Listing[] = await Listing.query()
    .where('users_id', userId)
    .withGraphFetched('reviews')
    .withGraphFetched('images')
    .withGraphFetched('geolocations')
    .withGraphFetched('anemitys')
    .withGraphFetched('bookings')
    .orderBy('createdAt', 'desc');

  return listings;
};

//function to add listing
export const addListing = async (listing: NewListingType): Promise<Listing> => {
  //set created at and status for new listing
  listing.createdAt = new Date();
  listing.status = 'active';

  //create and fetch new listing
  const newListing: Listing = await Listing.query()
    .insertGraph(
      {
        ...listing
      },
      {
        relate: true
      }
    )
    .withGraphFetched('user')
    .withGraphFetched('reviews')
    .withGraphFetched('images')
    .withGraphFetched('geolocations')
    .withGraphFetched('anemitys')
    .withGraphFetched('bookings');

  return newListing;
};

//function to update listing
export const updateListing = async (
  listing: Listing,
  userId: string
): Promise<Listing> => {
  //check if listing exists
  let checkListing = await getListingByIdAndUser(listing.id, userId);
  if (!checkListing) {
    throw new Error('Listing doesnt exist for the user');
  }

  //get future bookings for listing
  let listingBookings = await getFutureBookingByListing(listing.id);

  //get original listing
  let originalListing = await getListing(listing.id);

  //send emails of original listing to booking users
  listingBookings.forEach(booking => {
    sendUpdateListingEmail(booking.user, originalListing);
  });

  //update listing in database
  const updatedListing: Listing = await Listing.query()
    .upsertGraphAndFetch(
      {
        ...listing
      },
      {
        relate: true
      }
    )
    .withGraphFetched('user')
    .withGraphFetched('reviews')
    .withGraphFetched('images')
    .withGraphFetched('geolocations')
    .withGraphFetched('anemitys')
    .withGraphFetched('bookings');

  return updatedListing;
};

//function to search listing
export const searchListing = async (
  listingSearch: ListingSearchType
): Promise<Listing[]> => {
  //check if search parameters are defined
  if (listingSearch.city === undefined || listingSearch.country === undefined) {
    throw new Error('Country or city seems to be null');
  }

  //get listing with search parameters from database
  const listings: Listing[] = await Listing.query()
    .skipUndefined()
    .whereRaw(
      'LOWER(city) LIKE ?',
      '%' + listingSearch.city.toLowerCase() + '%'
    )
    .whereRaw(
      'LOWER(country) LIKE ?',
      '%' + listingSearch.country.toLowerCase().toLowerCase() + '%'
    )
    .where('price', '<=', listingSearch.price)
    .where('personCapacity', '>=', listingSearch.personCapacity)
    .withGraphFetched('user')
    .withGraphFetched('reviews')
    .withGraphFetched('images')
    .withGraphFetched('geolocations')
    .withGraphFetched('anemitys')
    .withGraphFetched('bookings')
    .orderBy('createdAt', 'desc');

  return listings;
};

//function to delete listing
export const deleteListing = async (
  listingId: string,
  userId: string
): Promise<Number> => {
  //check if listing exists
  let checkListing = await getListingByIdAndUser(listingId, userId);
  if (!checkListing) {
    throw new Error('Listing doesnt exist for the user');
  }

  //check if future bookings exists
  let futureBooking = await getFutureBookingByListing(listingId);
  if (futureBooking.length != 0) {
    throw new Error('bookings exist for the listing, cant be deleted');
  }

  let deletedBooking = await deleteBookingByListing(listingId);

  const deletedListing: number = await Listing.query().deleteById(listingId);
  return deletedListing;
};
