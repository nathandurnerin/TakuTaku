import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/src/app';

export default (req: VercelRequest, res: VercelResponse) => {
  (app as any)(req, res);
};
