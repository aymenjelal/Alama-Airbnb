"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const User = __importStar(require("./user_schema"));
const Listing = __importStar(require("./listing_schema"));
const Review = __importStar(require("./review_schema"));
const Anemity = __importStar(require("./anemity_schema"));
const Geolocation = __importStar(require("./geolocation_schema"));
const Image = __importStar(require("./image_schema"));
const Booking = __importStar(require("./booking_schema"));
const types = [];
const queries = [];
const inputs = [];
const mutations = [];
const schemas = [User, Listing, Review, Image, Geolocation, Anemity, Booking];
schemas.forEach(s => {
    types.push(s.types);
    queries.push(s.queries);
    inputs.push(s.inputs);
    mutations.push(s.mutations);
});
exports.typeDefs = apollo_server_express_1.gql `

  scalar Date

  ${types.join('\n')}
  ${inputs.join('\n')}
  type Query {
    ${queries.join('\n')}
  }

  type Mutation{
    ${mutations.join('\n')}
  }


`;
