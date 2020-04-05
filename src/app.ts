import express, { Application, Request, Response } from 'express';
import expressGraphQL from 'express-graphql';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './resolvers';
import { isAuth } from './middleware/is-auth';

const app: Application = express();
app.use(isAuth);

//app.use('/api', apiRouter);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => ({ req, res }),
  introspection: true,
  playground: true
});

server.applyMiddleware({ app });

app.listen(process.env.PORT || 4000, () => console.log(`server ready `));

//console.log(process.env.DATABASE);

//app.listen(5000, () => console.log('server running'));
