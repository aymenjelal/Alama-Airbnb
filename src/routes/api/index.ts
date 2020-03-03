import express, { Router } from 'express';
import todoRouter from './todo';

const apiRouter: Router = express.Router();

apiRouter.use('/todo', todoRouter);

export = apiRouter;
