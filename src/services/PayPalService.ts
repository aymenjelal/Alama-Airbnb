import paypal from 'paypal-rest-sdk';
import { Listing, getListing } from '../models/listing';
import {
  Booking,
  updateBooking,
  getBooking,
  getTodaysCheckins
} from '../models/booking';
import { Response } from 'express';
import { User } from '../models/user';
require('dotenv').config();
import dateFormat from 'dateformat';

paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID!,
  client_secret: process.env.PAYPAL_CLIENT_SECRET!
});

//function to create payment for booking confirmation
export const createPayment = (
  listing: Listing,
  booking: Booking,
  res: Response
) => {
  //calculate total payout
  const amountOfDays = daysBetween(booking.endBookDate, booking.startBookDate);

  let totalPrice = amountOfDays * listing.price;

  //pick url
  const productionURL = 'https://alama-airbnb.herokuapp.com';
  const developmentURL = 'http://localhost:4000';
  const url = process.env.NODE_ENV ? productionURL : developmentURL;

  //create payment json
  const create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: `${url}/success/${booking.id}`,
      cancel_url: `${url}/cancel`
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: 'Booking',
              sku: '001',
              price: listing.price.toString(),
              currency: 'USD',
              quantity: amountOfDays
            }
          ]
        },
        amount: {
          currency: 'USD',
          total: totalPrice.toString()
        },
        description: 'Payment for a booking in Addis BnB'
      }
    ]
  };

  //send approval link for response
  paypal.payment.create(create_payment_json, function(
    error: paypal.SDKError,
    payment: any
  ) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.send(payment.links[i].href);
        }
      }
    }
  });
};

//function to execute payment
export const executePayment = (
  booking: Booking,
  payerId: any,
  paymentId: any,
  res: Response
) => {
  const amountOfDays = daysBetween(booking.endBookDate, booking.startBookDate);

  let totalPrice = amountOfDays * booking.listing.price;
  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: 'USD',
          total: totalPrice.toString()
        }
      }
    ]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function(
    error,
    payment
  ) {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
      //console.log(JSON.stringify(payment));
      booking.confirmed = true;
      updateBooking(booking);
      res.redirect('https://fathomless-refuge-61282.herokuapp.com/bookings');
    }
  });
};

//function to create payouts for listing owners
export const createPayouts = async () => {
  //get bookings with start days the same as today
  let bookings: Booking[] = await getTodaysCheckins();

  //create pyout for each booking and update booking
  bookings.forEach(async booking => {
    await createPayout(booking);
    booking.paid = true;
    await updateBooking(booking);
  });
};

//function to create a single payout for a listing
const createPayout = async (booking: Booking) => {
  let listing: Listing = await getListing(booking.listing.id);
  let user: User = listing.user;

  //calculate total payout
  const amountOfDays = daysBetween(booking.endBookDate, booking.startBookDate);

  let totalPayout =
    amountOfDays * listing.price - amountOfDays * listing.price * 0.1;

  var sender_batch_id = Math.random()
    .toString(36)
    .substring(9);

  //create payout json
  var create_payout_json = {
    sender_batch_header: {
      sender_batch_id: sender_batch_id,
      email_subject: 'You have a payment'
    },
    items: [
      {
        recipient_type: 'EMAIL',
        amount: {
          value: totalPayout,
          currency: 'USD'
        },
        receiver: user.paypalAccount,
        note: `Payment for your ${listing.name} listing `,
        sender_item_id: booking.id.toString()
      }
    ]
  };

  var sync_mode = 'flase';

  paypal.payout.create(create_payout_json, sync_mode, function(
    error: { response: any },
    payout: any
  ) {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
      console.log('Create Single Payout Response');
      console.log(payout);
    }
  });
};

//function to create cancelation payout
export const createCancelationPayout = async (booking: Booking) => {
  let listing: Listing = await getListing(booking.listing.id);
  let user: User = booking.user;

  //calculat total amount by substracting an single nights price
  const amountOfDays = daysBetween(booking.endBookDate, booking.startBookDate);

  let totalPayout = amountOfDays * listing.price - listing.price;

  var sender_batch_id = Math.random()
    .toString(36)
    .substring(9);

  // create payout json
  var create_payout_json = {
    sender_batch_header: {
      sender_batch_id: sender_batch_id,
      email_subject: 'You have a payment for cancelation'
    },
    items: [
      {
        recipient_type: 'EMAIL',
        amount: {
          value: totalPayout,
          currency: 'USD'
        },
        receiver: user.paypalAccount,
        note: `Payment for your ${listing.name} cancelation `,
        sender_item_id: booking.id.toString()
      }
    ]
  };

  var sync_mode = 'flase';

  paypal.payout.create(create_payout_json, sync_mode, function(
    error: { response: any },
    payout: any
  ) {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
      console.log('Create Single Payout Response');
      console.log(payout);
    }
  });
};

function daysBetween(second: Date, first: Date) {
  // Copy date parts of the timestamps, discarding the time parts.
  var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
  var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

  // Do the math.
  var millisecondsPerDay = 1000 * 60 * 60 * 24;
  var millisBetween = two.getTime() - one.getTime();
  var days = millisBetween / millisecondsPerDay;

  // Round down.
  return Math.floor(days);
}
