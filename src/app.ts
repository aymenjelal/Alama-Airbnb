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

let port = process.env.port || 4000;

app.listen({ port }, () => console.log(`server ready at port ${port}`));

//console.log(process.env.DATABASE);

//app.listen(5000, () => console.log('server running'));
