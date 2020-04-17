"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
require('dotenv').config();
const oauth2Client = new google_auth_library_1.OAuth2Client('398163420113-kl9bqrgh28rih6nqjmd5j1g47vodtvud.apps.googleusercontent.com', 'cVuLYpfEgIX3ZaqpWKnSbM0T', 'https://developers.google.com/oauthplayground');
oauth2Client.setCredentials({
    refresh_token: '1//04tfgZpaDjq2MCgYIARAAGAQSNwF-L9IryTc1QkRT131141c3GJbgmfRF6WLlG5NKBezPUBxT8NtY80SIUaRs4f4zpRXe1ci2wCQ'
});
// const getAccessToken = async() =>{
//   return await oauth2Client.getAccessToken();
// }
// const createTransporter = async() =>{
//   const accessToken = await getAccessToken()
// }
const transporter = nodemailer_1.default.createTransport({
    service: 'Gmail',
    auth: {
        type: 'OAuth2',
        user: 'aymen2jelal@gmail.com',
        clientId: '398163420113-kl9bqrgh28rih6nqjmd5j1g47vodtvud.apps.googleusercontent.com',
        clientSecret: 'cVuLYpfEgIX3ZaqpWKnSbM0T',
        refreshToken: '1//04tfgZpaDjq2MCgYIARAAGAQSNwF-L9IryTc1QkRT131141c3GJbgmfRF6WLlG5NKBezPUBxT8NtY80SIUaRs4f4zpRXe1ci2wCQ'
    }
});
// const smtpTransport = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     type: 'OAuth2',
//     user: 'your.gmail.here@gmail.com',
//     clientId: 'Your ClientID Here',
//     clientSecret: 'Your Client Secret Here',
//     refreshToken: 'Your Refresh Token Here',
//     accessToken: accessToken
//   }
// });
exports.sendConfirmationEmail = (user) => {
    const emailToken = jsonwebtoken_1.default.sign({
        user: user
    }, 'topsecret');
    const productionURL = 'https://alama-airbnb.herokuapp.com';
    const developmentURL = 'http://localhost:4000';
    const url = process.env.NODE_ENV ? productionURL : developmentURL;
    const confirmURL = `${url}/confirmation/${emailToken}`;
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
