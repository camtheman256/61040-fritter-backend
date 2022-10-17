import type {Request, Response} from 'express';
import express from 'express';
import {Types} from 'mongoose';
import * as userValidator from '../user/middleware';
import {findOneByCommunityName} from './collection';
import {isCommunityExists, isCommunityNameValid} from './middleware';
import CommunityModel from './model';

const router = express.Router();

// See README for description of all routes

router.post('/', [userValidator.isUserLoggedIn, isCommunityNameValid], async (req: Request, res: Response) => {
  const communityName = req.body.name as string;
  const newCommunity = new CommunityModel({
    name: communityName,
    moderators: [new Types.ObjectId(req.session.userId)]
  });
  await newCommunity.save();

  res.status(200).json({
    message: `Community ${communityName} created successfully.`,
    community: newCommunity
  });
});

router.get('/:name', [isCommunityExists], async (req: Request, res: Response) => {
  const community = await findOneByCommunityName(req.params.name);
  res.status(200).json({
    community
  });
});

export default router;