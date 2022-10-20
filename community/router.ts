import type {Request, Response} from 'express';
import express from 'express';
import {Types} from 'mongoose';
import * as userValidator from '../user/middleware';
import {findOneByCommunityName} from './collection';
import {isCommunityExists, isCommunityNameValid, isUserModerator} from './middleware';
import CommunityModel from './model';
import UserCollection from '../user/collection';

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

router.put('/:name/moderators',
  [userValidator.isUserLoggedIn, isCommunityExists, isUserModerator],
  async (req: Request, res: Response) => {
    if (!(req.body.moderators instanceof Array)) {
      res.status(400).json({
        error: 'Malformed input'
      });
      return;
    }

    const usernames = req.body.moderators as string[] ?? [];
    const users = await Promise.all(usernames.map(async un => UserCollection.findOneByUsername(un)));
    console.log(users);
    if (users.some(u => u === null)) {
      res.status(404).json({
        error: 'Some usernames were invalid.'
      });
      return;
    }

    const community = await findOneByCommunityName(req.params.name);
    community.moderators = users.map(u => u._id);
    await community.save();
    res.status(200).json({
      message: 'Moderators set successfully.',
      community
    });
  });

router.put(
  '/:name/bans',
  [userValidator.isUserLoggedIn, isCommunityExists, isUserModerator],
  async (req: Request, res: Response) => {
    if (!(req.body.bans instanceof Array)) {
      res.status(400).json({
        error: 'Malformed input'
      });
      return;
    }

    const usernames = req.body.bans as string[] ?? [];

    const users = await Promise.all(usernames.map(async un => UserCollection.findOneByUsername(un)));
    if (users.some(u => u === null)) {
      res.status(404).json({
        error: 'Some usernames were invalid.'
      });
      return;
    }

    const community = await findOneByCommunityName(req.params.name);
    community.banned = users.map(u => u._id);
    community.members = community.members.filter(u => !users.some(b => b._id.equals(u)));
    await community.save();
    res.status(200).json({
      message: 'Bans set successfully.',
      community
    });
  }
);

export default router;
