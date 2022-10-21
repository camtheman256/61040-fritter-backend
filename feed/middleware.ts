import type {NextFunction, Request, Response} from 'express';

export function isValidFreetSettings(req: Request, res: Response, next: NextFunction) {
  if (typeof req.body.freets === 'number' && typeof req.body.page_length === 'number') {
    if (req.body.freets > 0 && req.body.page_length > 0) {
      next();
      return;
    }
  }

  res.status(400).json({
    error: 'Malformed input.'
  });
}
