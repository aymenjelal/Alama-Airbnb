import paypal from 'paypal-rest-sdk';
import { Listing } from '../models/listing';
import { Booking, updateBooking } from '../models/booking';
import { Response } from 'express';

paypal.configure({
  mode: 'sandbox',
  client_id:
    'AQQNCR2R1RhY4t_PtGCVB-4edklQC4iTStUOHrszdIcvjZqFeVCG0gv8vK7Pp6b7ffxnOfJ7-VfUDnDO',
  client_secret:
    'EIU87KzlxKc6OzAwqaYn00vdvF47WKdL5e807h-y_wCoA4K7kfuxdR57OAxbxxjQu1uF_wWU_BZhz28M'
});

export const createPayment = (
  listing: Listing,
  booking: Booking,
  res: Response
) => {
  const amountOfDays = daysBetween(booking.endBookDate, booking.startBookDate);

  let totalPrice = amountOfDays * listing.price;

  const productionURL = 'https://alama-airbnb.herokuapp.com';
  const developmentURL = 'http://localhost:4000';
  const url = process.env.NODE_ENV ? productionURL : developmentURL;

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
        description: 'Payment for a booking'
      }
    ]
  };

  console.log(create_payment_json.transactions);

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
