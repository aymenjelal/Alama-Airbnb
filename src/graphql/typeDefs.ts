import { gql } from 'apollo-server-express';
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date';
import * as User from './user_schema';
import * as Listing from './listing_schema';
import * as Review from './review_schema';
import * as Anemity from './anemity_schema';
import * as Geolocation from './geolocation_schema';
import * as Image from './image_schema';
import * as Booking from './booking_schema';
import { DocumentNode } from 'graphql';

const types: string[] = [];
const queries: string[] = [];
const inputs: string[] = [];
const mutations: string[] = [];

const schemas = [User, Listing, Review, Image, Geolocation, Anemity, Booking];

schemas.forEach(s => {
  types.push(s.types);
  queries.push(s.queries);
  inputs.push(s.inputs);
  mutations.push(s.mutations);
});
export const typeDefs = gql`

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
