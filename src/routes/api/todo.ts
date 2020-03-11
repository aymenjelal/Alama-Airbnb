import express, { Router, Request, Response } from 'express';
import { Listing } from '../../models/knex_schema';

var todoRouter: Router = express.Router();

todoRouter.get(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    const listings: Listing[] = await Listing.query().eager('geolocations');
    res.json(listings);
  }
);

export = todoRouter;
