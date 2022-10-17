import type {NextFunction, Request, Response} from 'express';
import {findOneByCommunityName} from './collection';

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
