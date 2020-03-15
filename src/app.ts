import express, { Application, Request, Response } from 'express';
import expressGraphQL from 'express-graphql';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './resolvers';

const app: Application = express();

//app.use('/api', apiRouter);

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.applyMiddleware({ app });

app.listen(process.env.PORT || 4000, () => console.log(`server ready `));

//console.log(process.env.DATABASE);

//app.listen(5000, () => console.log('server running'));
