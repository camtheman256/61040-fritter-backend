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
    moderators: [new Types.ObjectId(req.session.userId)],
    members: [new Types.ObjectId(req.session.userId)]
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

router.put('/:name', [userValidator.isUserLoggedIn, isCommunityExists], async (req: Request, res: Response) => {
  const community = await findOneByCommunityName(req.params.name);
  const userId = new Types.ObjectId(req.session.userId);
  if (community.banned.includes(userId)) {
    res.status(403).json({
      error: `User is banned in community ${req.params.name}.`
    });
    return;
  }

  if (!community.members.includes(userId)) {
    community.members.push(userId);
  }

  await community.save();
  res.status(200).json({
    message: `Joined ${req.params.name} successfully.`
  });
});

router.delete('/:name', [userValidator.isUserLoggedIn, isCommunityExists], async (req: Request, res: Response) => {
  const community = await findOneByCommunityName(req.params.name);
  const userId = new Types.ObjectId(req.session.userId);
  community.members = community.members.filter(id => !id.equals(userId));
  await community.save();
  res.status(200).json({
    message: `Left ${req.params.name} successfully.`
  });
});

export default router;
