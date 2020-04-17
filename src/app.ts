import express, { Application, Request, Response } from 'express';
import expressGraphQL from 'express-graphql';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './resolvers';
import { isAuth } from './middleware/is-auth';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { User, updateUser, UpdateUserType } from './models/user';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'aymen2jelal@gmail.com',
    pass: 'Davidwestside1'
  }
});

const app: Application = express();
app.use(isAuth);

//app.use('/api', apiRouter);

app.get('/confirmation/:token', async (req, res) => {
  let decodedToken: any;
  try {
    decodedToken = jwt.verify(req.params.token, 'topsecret');
    let user: UpdateUserType = {
      ...decodedToken.user
    };
    user.confirmed = true;
    await updateUser(user);
  } catch (error) {
    res.send('error');
  }

  return res.redirect('https://fathomless-refuge-61282.herokuapp.com/login');
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => ({ req, res }),
  introspection: true,
  playground: true
});

const EMAIL_SECRET = 'asdf1093KMnzxcvnkljvasdu09123nlasdasdf';

server.applyMiddleware({ app });

app.listen(process.env.PORT || 4000, () => console.log(`server ready `));

//console.log(process.env.DATABASE);

//app.listen(5000, () => console.log('server running'));
