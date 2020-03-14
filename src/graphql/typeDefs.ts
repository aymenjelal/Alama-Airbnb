import { gql } from 'apollo-server-express';
import * as User from './user_schema';
import * as Listing from './listing_schema';
import { DocumentNode } from 'graphql';

const types: string[] = [];
const queries: string[] = [];
const inputs: string[] = [];
const mutations: string[] = [];

const schemas = [User, Listing];

schemas.forEach(s => {
  types.push(s.types);
  queries.push(s.queries);
  inputs.push(s.inputs);
  mutations.push(s.mutations);
});
export const typeDefs = gql`

  ${types.join('\n')}
  ${inputs.join('\n')}
  type Query {
    ${queries.join('\n')}
  }

  type Mutation{
    ${mutations.join('\n')}
  }


`;
