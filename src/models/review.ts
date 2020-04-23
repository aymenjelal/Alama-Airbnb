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

export const addNewReview = async (review: ReviewType): Promise<Review> => {
  review.createdAt = new Date();
  review.lastUpdatedAt = new Date();

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

export const updateReview = async (review: Review): Promise<Review> => {
  review.lastUpdatedAt = new Date();
  const updatedReview: Review = await Review.query()
    .patchAndFetchById(review.id, {
      ...review
    })
    .withGraphFetched('user')
    .withGraphFetched('listing');

  return updatedReview;
};

export const deleteReview = async (reviewId: string): Promise<Number> => {
  const deletedReview: number = await Review.query().deleteById(reviewId);
  return deletedReview;
};
