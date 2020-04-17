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
const user_1 = require("./models/user");
const listing_1 = require("./models/listing");
const graphql_1 = require("graphql");
const review_1 = require("./models/review");
const booking_1 = require("./models/booking");
const EmailService_1 = require("./services/EmailService");
//require('dotenv').config();
// interface NewUserType {
//   firstName: string;
//   lastName: string;
//   email: string;
//   country: string;
//   street: string;
//   phone: string;
//   language: string;
//   ishost: boolean;
//   password: string;
// }
// const registerUser = async (user: NewUserType) => {
//   const registeredUser: User = await User.query().insert({
//     ...user
//   });
//   return registeredUser;
// };
// const getAllUsers = async () => {
//   const users = await User.query().withGraphFetched('listings');
//   return users;
// };
exports.resolvers = {
    Query: {
        users: () => __awaiter(void 0, void 0, void 0, function* () { return user_1.getAllUsers(); }),
        user: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () { return user_1.getUser(id); }),
        login: (_, { email, password }) => __awaiter(void 0, void 0, void 0, function* () { return user_1.loginUser(email, password); }),
        allListings: () => __awaiter(void 0, void 0, void 0, function* () { return listing_1.getAllListings(); }),
        activeListings: () => __awaiter(void 0, void 0, void 0, function* () { return listing_1.getActiveListings(); }),
        listing: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () { return listing_1.getListing(id); }),
        listingByUser: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () { return listing_1.getListingByUser(id); }),
        searchListing: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () { return listing_1.searchListing(input); }),
        reviewByListing: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () { return review_1.getReviewbyListing(id); }),
        bookingByListing: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () { return booking_1.getBookingByListing(id); }),
        bookingByListingDate: (_, { id, start, end }) => __awaiter(void 0, void 0, void 0, function* () { return booking_1.getBookingByListingDate(id, start); }),
        bookingByUser: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () { return booking_1.getBookingByUser(id); }),
        bookingByUserDate: (_, { id, start, end }) => __awaiter(void 0, void 0, void 0, function* () { return booking_1.getBookingByUserDate(id, start); })
    },
    Date: new graphql_1.GraphQLScalarType({
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
            if (ast.kind === graphql_1.Kind.INT) {
                return parseInt(ast.value, 10); // ast value is always in string format
            }
            else if (ast.kind === graphql_1.Kind.STRING) {
                return ast.value;
            }
            return null;
        }
    }),
    Mutation: {
        registerUsers: (_, { input, transporter, models, EMAIL_SECRET }) => __awaiter(void 0, void 0, void 0, function* () {
            let newUser = Object.assign({}, input);
            let registeredUser = yield user_1.registerUser(newUser);
            EmailService_1.sendConfirmationEmail(registeredUser);
            // jwt.sign(
            //   {
            //     user: registeredUser.id,
            //   },
            //   EMAIL_SECRET,
            //   {
            //     expiresIn: '1d',
            //   },
            //   (err, emailToken) => {
            //     const url = `http://localhost:3000/confirmation/${emailToken}`;
            //     transporter.sendMail({
            //       to: newUser.email,
            //       subject: 'Confirm Email',
            //       html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
            //     });
            //   },
            // );
            return registeredUser;
        }),
        updateUser: (_, { input }, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.req.isAuth) {
                throw new Error('Unauthenticated!!');
            }
            let user = Object.assign({}, input);
            let updatedUser = yield user_1.updateUser(user);
            return updatedUser;
        }),
        deleteUser: (_, { input }, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.req.isAuth) {
                throw new Error('Unauthenticated!!');
            }
            let deletedUser = yield user_1.deleteUser(input);
            return {
                deleted: deletedUser
            };
        }),
        addNewListing: (_, { input }, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.req.isAuth) {
                throw new Error('Unauthenticated!!');
            }
            let listing = Object.assign({}, input);
            let newListing = yield listing_1.addListing(listing);
            return newListing;
        }),
        updateListing: (_, { input }, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.req.isAuth) {
                throw new Error('Unauthenticated!!');
            }
            let listing = Object.assign({}, input);
            let userId = context.req.userId;
            let updatedListing = yield listing_1.updateListing(listing, userId);
            return updatedListing;
        }),
        deleteListing: (_, { input }, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.req.isAuth) {
                throw new Error('Unauthenticated!!');
            }
            let userId = context.req.userId;
            let deletedListing = yield listing_1.deleteListing(input, userId);
            return {
                deleted: deletedListing
            };
        }),
        addReview: (_, { input }, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.req.isAuth) {
                throw new Error('Unauthenticated!!');
            }
            let review = Object.assign({}, input);
            let newReview = yield review_1.addNewReview(review);
            return newReview;
        }),
        updateReview: (_, { input }, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.req.isAuth) {
                throw new Error('Unauthenticated!!');
            }
            let review = Object.assign({}, input);
            let updatedReview = yield review_1.updateReview(review);
            return updatedReview;
        }),
        deleteReview: (_, { input }, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.req.isAuth) {
                throw new Error('Unauthenticated!!');
            }
            let deletedReview = yield review_1.deleteReview(input);
            return deletedReview;
        }),
        addBooking: (_, { input }, context) => __awaiter(void 0, void 0, void 0, function* () {
            //console.log(input.startBookDate);
            if (!context.req.isAuth) {
                throw new Error('Unauthenticated!!');
            }
            let booking = Object.assign({}, input);
            let newBooking = yield booking_1.addNewBooking(booking);
            return newBooking;
        })
    }
};
