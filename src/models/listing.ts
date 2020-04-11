import { Model } from 'objection';
import { User } from './user';
import { OccupiedDate } from './knex_schema';
import { gql } from 'apollo-server-express';
import { Review } from './review';
import { ListingImage } from './image';
import { Anemity } from './anemity';
import { Geolocation } from './geolocation';
import { db } from '../database/db';
import { Booking } from './booking';

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
      occupiedDates: {
        relation: Model.HasManyRelation,
        modelClass: OccupiedDate,
        join: {
          from: 'listings.id',
          to: 'occupied_dates.listings_id'
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
  createdAt: Date;
}

export const getAllListings = async (): Promise<Listing[]> => {
  const listings: Listing[] = await Listing.query()
    .withGraphFetched('user')
    .withGraphFetched('reviews')
    .withGraphFetched('images')
    .withGraphFetched('geolocations')
    .withGraphFetched('anemitys')
    .withGraphFetched('bookings');
  return listings;
};

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

export const getListingByUser = async (userId: string): Promise<Listing[]> => {
  const listings: Listing[] = await Listing.query()
    .where('users_id', userId)
    .withGraphFetched('reviews')
    .withGraphFetched('images')
    .withGraphFetched('geolocations')
    .withGraphFetched('anemitys')
    .withGraphFetched('bookings');

  return listings;
};

export const addListing = async (listing: NewListingType): Promise<Listing> => {
  listing.createdAt = new Date();
  const newListing: Listing = await Listing.query().insertGraph(
    {
      ...listing
    },
    {
      relate: true
    }
  );

  return newListing;
};

export const updateListing = async (listing: Listing): Promise<Listing> => {
  const updatedListing: Listing = await Listing.query().upsertGraphAndFetch(
    {
      ...listing
    },
    {
      relate: true
    }
  );

  return updatedListing;
};

export const searchListing = async (
  listingSearch: ListingSearchType
): Promise<Listing[]> => {
  const listings: Listing[] = await Listing.query()
    .skipUndefined()
    .where('city', 'like', '%' + listingSearch.city + '%')
    .where('price', '<=', listingSearch.price)
    .where('personCapacity', '>=', listingSearch.personCapacity)
    .where('country', 'like', '%' + listingSearch.country + '%');

  return listings;
};
