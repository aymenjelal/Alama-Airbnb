import nodemailer from 'nodemailer';
import { User, NewUserType } from '../models/user';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { Listing } from '../models/listing';
require('dotenv').config();

const oauth2Client = new OAuth2Client(
  '398163420113-kl9bqrgh28rih6nqjmd5j1g47vodtvud.apps.googleusercontent.com',
  'cVuLYpfEgIX3ZaqpWKnSbM0T',
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token:
    '1//04tfgZpaDjq2MCgYIARAAGAQSNwF-L9IryTc1QkRT131141c3GJbgmfRF6WLlG5NKBezPUBxT8NtY80SIUaRs4f4zpRXe1ci2wCQ'
});

//create nodemailer for transport
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    type: 'OAuth2',
    user: 'aymen2jelal@gmail.com',
    clientId:
      '398163420113-kl9bqrgh28rih6nqjmd5j1g47vodtvud.apps.googleusercontent.com',
    clientSecret: 'cVuLYpfEgIX3ZaqpWKnSbM0T',
    refreshToken:
      '1//04tfgZpaDjq2MCgYIARAAGAQSNwF-L9IryTc1QkRT131141c3GJbgmfRF6WLlG5NKBezPUBxT8NtY80SIUaRs4f4zpRXe1ci2wCQ'
  }
});

export const sendConfirmationEmail = (user: User) => {
  //create email token
  const emailToken = jwt.sign(
    {
      user: user
    },
    'topsecret'
  );

  //pick url
  const productionURL = 'https://alama-airbnb.herokuapp.com';
  const developmentURL = 'http://localhost:4000';
  const url = process.env.NODE_ENV ? productionURL : developmentURL;
  const confirmURL = `${url}/confirmation/${emailToken}`;

  //use the transporter to send confirmation email
  transporter
    .sendMail({
      to: user.email,
      subject: 'Confirm Email',
      html: `Please click this email to confirm your email: <a href="${confirmURL}">${confirmURL}</a>`
    })
    .then(() => {
      console.log('email sent');
    })
    .catch(() => {
      console.log('problem sending email');
    });
};

//send listing updated email
export const sendUpdateListingEmail = (user: User, listing: Listing) => {
  transporter
    .sendMail({
      to: user.email,
      subject: 'Updated Listing',
      html: `The booking you made at ${listing.name} has been updated. 
      <br />
      <br />
      At the time of your booking the price was ${listing.price} dollars <br />
       - ${listing.bedrooms} bedrooms <br />
       - ${listing.bathrooms} bathrooms <br />
       - ${listing.personCapacity} person capacity <br />
       - with anemities <br />
         ${listing.anemitys.map(anemity => {
           return anemity.name;
         })} <br/>

        <b> Please make sure all these are fulfilled </b>
      `
    })
    .then(() => {
      console.log('email sent');
    })
    .catch(() => {
      console.log('problem sending email');
    });
};
