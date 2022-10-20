import type {NextFunction, Request, Response} from 'express';
import {Types} from 'mongoose';
import {findOneByCommunityName} from './collection';

/**
 * Checks if a community name is valid and not in use already.
 */
export const isCommunityNameValid = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.name === undefined || req.body.name.length > 30 || req.body.name.length < 3) {
    res.status(400).json({
      error: 'Community name not specified or invalid.'
    });
    return;
  }

  const community = await findOneByCommunityName(req.body.name);
  if (community !== null) {
    res.status(409).json({
      error: 'Community name already in use.'
    });
    return;
  }

  next();
};

export const isCommunityExists = async (req: Request, res: Response, next: NextFunction) => {
  const community = await findOneByCommunityName(req.params.name);
  if (community === null) {
    res.status(404).json({
      error: `Community ${req.params.name} doesn't exist.`
    });
    return;
  }

  next();
};

export const isUserModerator = async (req: Request, res: Response, next: NextFunction) => {
  const userId = new Types.ObjectId(req.session.userId);
  const community = await findOneByCommunityName(req.params.name);
  if (!community.moderators.includes(userId)) {
    res.status(403).json({
      error: `You don't have moderator permissions in ${req.params.name}`
    });
    return;
  }

  next();
};
