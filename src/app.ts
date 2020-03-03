import express, { Application, Request, Response } from 'express';
import apiRouter from './routes/api';
require('dotenv').config();

const app: Application = express();

app.use('/api', apiRouter);

console.log(process.env.DATABASE);

app.listen(5000, () => console.log('server running'));
