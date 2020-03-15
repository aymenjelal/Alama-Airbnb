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
        listings: () => __awaiter(void 0, void 0, void 0, function* () { return listing_1.getAllListings(); }),
        listing: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () { return listing_1.getListing(id); })
    },
    Date: new graphql_1.GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return value.getTime(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === graphql_1.Kind.INT) {
                return parseInt(ast.value, 10); // ast value is always in string format
            }
            return null;
        }
    }),
    Mutation: {
        registerUsers: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            let newUser = Object.assign({}, input);
            let registeredUser = yield user_1.registerUser(newUser);
            return registeredUser;
        }),
        updateUser: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            let user = Object.assign({}, input);
            let updatedUser = yield user_1.updateUser(user);
            return updatedUser;
        }),
        deleteUser: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            let deletedUser = yield user_1.deleteUser(input);
            return {
                deleted: deletedUser
            };
        }),
        addNewListing: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            let listing = Object.assign({}, input);
            let newListing = yield listing_1.addListing(listing);
            return newListing;
        }),
        updateListing: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            let listing = Object.assign({}, input);
            let updatedListing = yield listing_1.updateListing(listing);
            return updatedListing;
        })
    }
};
