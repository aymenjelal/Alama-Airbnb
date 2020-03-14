import express, { Application, Request, Response } from 'express';
import expressGraphQL from 'express-graphql';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './resolvers';

import apiRouter from './routes/api';
//require('dotenv').config();

const app: Application = express();

//app.use('/api', apiRouter);

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => console.log('server ready at prot 400'));

//console.log(process.env.DATABASE);

//app.listen(5000, () => console.log('server running'));
