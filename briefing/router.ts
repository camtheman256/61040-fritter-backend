import type {Request, Response} from 'express';
import express from 'express';
import {queryParameters} from '../feed/util';
import {Types} from 'mongoose';
import * as userValidator from '../user/middleware';
import FreetModel from '../freet/model';

const router = express.Router();

router.get('/', [userValidator.isUserLoggedIn], async (req: Request, res: Response) => {
  const hours = parseInt(req.query.hours as string, 10) || 12;
  const userId = new Types.ObjectId(req.session.userId);
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - hours);
  const freets = await FreetModel.find(await queryParameters(userId))
    .find({dateCreated: {$gte: cutoff}}).populate('authorId', 'community');
  res.status(200).json({
    message: 'Briefing fetched successfully.',
    since: cutoff.toISOString(),
    freets
  });
});

export default router;
