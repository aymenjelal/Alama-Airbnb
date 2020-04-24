import { IResolvers } from 'graphql-tools';
import {
  User,
  NewUserType,
  registerUser,
  getAllUsers,
  getUser,
  UpdateUserType,
  updateUser,
  deleteUser,
  loginUser
} from './models/user';
import {
  getAllListings,
  getListing,
  addListing,
  NewListingType,
  updateListing,
  Listing,
  searchListing,
  getListingByUser,
  getActiveListings,
  deleteListing
} from './models/listing';
import { GraphQLScalarType, Kind } from 'graphql';
import {
  getReviewbyListing,
  ReviewType,
  addNewReview,
  updateReview,
  Review,
  deleteReview
} from './models/review';
import {
  getBookingByListing,
  getBookingByUser,
  Booking,
  addNewBooking,
  BookingType,
  getBookingByListingDate,
  getBookingByUserDate,
  getBooking,
  cancelBooking
} from './models/booking';
import { Request } from 'express';
import { val } from 'objection';
import jwt from 'jsonwebtoken';
import { sendConfirmationEmail } from './services/EmailService';
import {
  createPayment,
  createCancelationPayout
} from './services/PayPalService';
//require('dotenv').config();

export const resolvers: IResolvers = {
  Query: {
    users: async () => getAllUsers(),
    user: async (_, { id }) => getUser(id),
    login: async (_, { email, password }) => loginUser(email, password),
    allListings: async () => getAllListings(),
    activeListings: async () => getActiveListings(),
    listing: async (_, { id }) => getListing(id),
    listingByUser: async (_, { id }) => getListingByUser(id),
    searchListing: async (_, { input }) => searchListing(input),
    reviewByListing: async (_, { id }) => getReviewbyListing(id),
    bookingByListing: async (_, { id }) => getBookingByListing(id),
    bookingByListingDate: async (_, { id, start, end }) =>
      getBookingByListingDate(id, start, end),
    bookingByUser: async (_, { id }) => getBookingByUser(id),
    bookingByUserDate: async (_, { id, start, end }) =>
      getBookingByUserDate(id, start)
  },

  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',

    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      let sendValue = new Date(value);
      return sendValue.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      } else if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      return null;
    }
  }),

  Mutation: {
    registerUsers: async (_, { input }) => {
      let newUser: NewUserType = {
        ...input
      };
      let registeredUser = await registerUser(newUser);

      //email confirmation links
      sendConfirmationEmail(registeredUser);

      return registeredUser;
    },

    updateUser: async (_, { input }, context) => {
      if (!context.req.isAuth) {
        throw new Error('Unauthenticated!!');
      }

      let user: UpdateUserType = {
        ...input
      };

      if (context.req.userId != user.id) {
        throw new Error(
          'Authenticated user is not the same as user to be updated'
        );
      }
      let updatedUser = await updateUser(user);
      return updatedUser;
    },

    deleteUser: async (_, { input }, context) => {
      if (!context.req.isAuth) {
        throw new Error('Unauthenticated!!');
      }

      if (context.req.userId != input) {
        throw new Error(
          'Authenticated user is not the same as user to be updated'
        );
      }

      let deletedUser: Number = await deleteUser(input);
      return {
        deleted: deletedUser
      };
    },

    addNewListing: async (_, { input }, context) => {
      if (!context.req.isAuth) {
        throw new Error('Unauthenticated!!');
      }

      let listing: NewListingType = {
        ...input
      };
      let newListing = await addListing(listing);
      return newListing;
    },

    updateListing: async (_, { input }, context) => {
      if (!context.req.isAuth) {
        throw new Error('Unauthenticated!!');
      }
      let listing: Listing = {
        ...input
      };

      let userId: string = context.req.userId;
      let updatedListing = await updateListing(listing, userId);

      return updatedListing;
    },

    deleteListing: async (_, { input }, context) => {
      if (!context.req.isAuth) {
        throw new Error('Unauthenticated!!');
      }

      let userId: string = context.req.userId;
      let deletedListing: Number = await deleteListing(input, userId);
      return {
        deleted: deletedListing
      };
    },

    addReview: async (_, { input }, context) => {
      if (!context.req.isAuth) {
        throw new Error('Unauthenticated!!');
      }
      let review: ReviewType = {
        ...input
      };

      let newReview = await addNewReview(review);

      return newReview;
    },

    updateReview: async (_, { input }, context) => {
      if (!context.req.isAuth) {
        throw new Error('Unauthenticated!!');
      }
      let review: Review = {
        ...input
      };

      let updatedReview = await updateReview(review);

      return updatedReview;
    },

    deleteReview: async (_, { input }, context) => {
      if (!context.req.isAuth) {
        throw new Error('Unauthenticated!!');
      }
      let deletedReview: Number = await deleteReview(input);
      return deletedReview;
    },

    addBooking: async (_, { input }, context) => {
      if (!context.req.isAuth) {
        throw new Error('Unauthenticated!!');
      }

      let booking: BookingType = {
        ...input
      };

      let newBooking = await addNewBooking(booking);

      return newBooking;
    },

    cancelBooking: async (_, { input }, context) => {
      if (!context.req.isAuth) {
        throw new Error('Unathenticated!!');
      }

      let booking = await getBooking(input.id);

      if (!booking) {
        throw new Error('Booking doesnt exist');
      }

      if (context.req.userId != booking.user.id) {
        throw new Error('Authenticated user is not the same as booking owner');
      }

      //try to cancel booking
      let canceledBooking = await cancelBooking(booking);

      //send payout if booking can be canceled
      await createCancelationPayout(booking);

      return {
        deleted: canceledBooking
      };
    }
  }
};
