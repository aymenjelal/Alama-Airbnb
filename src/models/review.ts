import { Model } from 'objection';
import { Listing } from './listing';
import { User } from './user';
import { db } from '../database/db';

Model.knex(db);

export class Review extends Model {
  id!: string;
  content!: string;
  user!: User;
  isting!: Listing;
  createdAt!: Date;
  lastUpdatedAt!: Date;

  static get tableName(): string {
    return 'reviews';
  }

  static get relationMappings() {
    return {
      listing: {
        relation: Model.BelongsToOneRelation,
        modelClass: Listing,
        join: {
          from: 'reviews.listings_id',
          to: 'listings.id'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'reviews.users_id',
          to: 'users.id'
        }
      }
    };
  }
}

export interface ReviewType {
  content: string;
  user: User;
  listing: Listing;
  createdAt: Date;
  lastUpdatedAt: Date;
}

//function to add new review
export const addNewReview = async (review: ReviewType): Promise<Review> => {
  //set createdAt and lastUpdatedAt for new review
  review.createdAt = new Date();
  review.lastUpdatedAt = new Date();

  //create new review in database
  const newReview: Review = await Review.query()
    .insertGraph(
      {
        ...review
      },
      {
        relate: true
      }
    )
    .withGraphFetched('user')
    .withGraphFetched('listing');

  return newReview;
};

//function to get reviews for a listing
export const getReviewbyListing = async (
  listingId: string
): Promise<Review[]> => {
  const reviews: Review[] = await Review.query()
    .where('listings_id', listingId)
    .withGraphFetched('user')
    .withGraphFetched('listing')
    .orderBy('lastUpdatedAt', 'desc');
  return reviews;
};

//function to update review
export const updateReview = async (review: Review): Promise<Review> => {
  //set review last updated date
  review.lastUpdatedAt = new Date();

  //update review in the database
  const updatedReview: Review = await Review.query()
    .patchAndFetchById(review.id, {
      ...review
    })
    .withGraphFetched('user')
    .withGraphFetched('listing');

  return updatedReview;
};

//function to delete review by Id
export const deleteReview = async (reviewId: string): Promise<Number> => {
  const deletedReview: number = await Review.query().deleteById(reviewId);
  return deletedReview;
};
