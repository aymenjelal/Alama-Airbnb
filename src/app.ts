import express, { Application, Request, Response } from 'express';
import expressGraphQL from 'express-graphql';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './resolvers';
import { isAuth } from './middleware/is-auth';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { User, updateUser, UpdateUserType } from './models/user';
import { getBooking } from './models/booking';
import { createPayment, executePayment } from './services/PayPalService';
import bodyParser from 'body-parser';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'aymen2jelal@gmail.com',
    pass: 'Davidwestside1'
  }
});

const app: Application = express();
app.use(isAuth);
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  res.send('success');
});
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

app.post('/pay', async (req, res) => {
  if (req.body.bookingId === undefined) {
    return res.status(400).send({
      message: 'Booking id is not defined'
    });
  }
  let bookingId = req.body.bookingId;

  //let bookingId = 'f2a2c884-04b0-4202-96d2-aac12ecc3693';
  let booking = await getBooking(bookingId);

  console.log(booking.confirmed);

  if (booking.confirmed) {
    return res.status(400).send({
      message: 'booking is already confirmed'
    });
  }

  createPayment(booking.listing, booking, res);
});

app.get('/success/:bookingId', async (req, res) => {
  const payerId = req.query.PayerID;
  const paymentID = req.query.paymentId;
  const bookingId = req.params.bookingId;

  let booking = await getBooking(bookingId);

  executePayment(booking, payerId, paymentID, res);
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
