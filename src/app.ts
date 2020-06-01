import express, { Application, Request, Response } from 'express';
import expressGraphQL from 'express-graphql';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './resolvers';
import { isAuth } from './middleware/is-auth';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { User, updateUser, UpdateUserType } from './models/user';
import { getBooking, checkConfirmation } from './models/booking';
import {
  createPayment,
  executePayment,
  createPayouts
} from './services/PayPalService';
import bodyParser from 'body-parser';
import cors from 'cors';
import cron from 'node-cron';

//declare app
const app: Application = express();
app.use(isAuth);
app.use(bodyParser.json());
app.use(cors());

//Corn Scheduler for payouts
cron.schedule('0 18 * * *', function() {
  createPayouts();
});

cron.schedule('0,29 * * * *', function() {
  checkConfirmation();
});

//route for confirmation email
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

//route for paypal post
app.post('/pay', async (req, res) => {
  if (req.body.bookingId === undefined) {
    return res.status(400).send({
      message: 'Booking id is not defined'
    });
  }
  let bookingId = req.body.bookingId;

  //let bookingId = 'f2a2c884-04b0-4202-96d2-aac12ecc3693';
  let booking = await getBooking(bookingId);

  if (booking.confirmed) {
    return res.status(400).send({
      message: 'booking is already confirmed'
    });
  }

  createPayment(booking.listing, booking, res);
});

//route for paypal success
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

server.applyMiddleware({ app });

app.listen(process.env.PORT || 4000, () => console.log(`server ready `));
