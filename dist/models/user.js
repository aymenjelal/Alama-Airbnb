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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection = require('../database/knexfile');
const objection_1 = require("objection");
const knex_schema_1 = require("./knex_schema");
const db_1 = require("../database/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const booking_1 = require("./booking");
objection_1.Model.knex(db_1.db);
class User extends objection_1.Model {
    static get tableName() {
        return 'users';
    }
    static get relationMappings() {
        return {
            listings: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: knex_schema_1.Listing,
                join: {
                    from: 'users.id',
                    to: 'listings.users_id'
                }
            },
            reviews: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: knex_schema_1.Review,
                join: {
                    from: 'users.id',
                    to: 'reviews.users_id'
                }
            },
            bookings: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: booking_1.Booking,
                join: {
                    from: 'users.id',
                    to: 'bookings.users_id'
                }
            }
        };
    }
}
exports.User = User;
exports.registerUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield User.query().findOne({ email: user.email });
    if (existingUser) {
        throw new Error('user already exists');
    }
    user.joinedDate = new Date();
    const passwordInput = user.password;
    const hashedPassword = yield bcryptjs_1.default.hash(passwordInput, 12);
    user.password = hashedPassword;
    const registeredUser = yield User.query().insert(Object.assign({}, user));
    return registeredUser;
});
exports.getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User.query()
        .withGraphFetched('listings')
        .withGraphFetched('reviews')
        .withGraphFetched('bookings');
    return users;
});
exports.getUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.query()
        .findById(userId)
        .withGraphFetched('listings')
        .withGraphFetched('reviews')
        .withGraphFetched('bookings');
    return user;
});
exports.updateUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield User.query().patchAndFetchById(user.id, Object.assign({}, user));
    return updatedUser;
});
exports.deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedUser = yield User.query().deleteById(userId);
    return deletedUser;
});
exports.loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.query().findOne({ email: email });
    if (!user) {
        throw new Error('user doesnt exist');
    }
    const passEqual = yield bcryptjs_1.default.compare(password, user.password);
    if (!passEqual) {
        throw new Error('user doesnt exist');
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, 'sercretkeyalamabnb', {
        expiresIn: '1h'
    });
    return {
        userId: user.id,
        token: token,
        tokenExpiration: 1
    };
});
