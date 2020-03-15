import { Model } from 'objection';
import { User } from './user';
import { OccupiedDate } from './knex_schema';
import { gql } from 'apollo-server-express';
import { Review } from './review';
import { ListingImage } from './image';
import { Anemity } from './anemity';
import { Geolocation } from './geolocation';
import { db } from '../database/db';

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
  const listings: Listing[] = await Listing.query().withGraphFetched('reviews');
  return listings;
};

export const getListing = async (listingId: string): Promise<Listing> => {
  const listing: Listing = await Listing.query()
    .findById(listingId)
    .withGraphFetched('reviews')
    .withGraphFetched('images')
    .withGraphFetched('geolocations')
    .withGraphFetched('anemitys');

  return listing;
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