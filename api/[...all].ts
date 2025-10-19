import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/src/app';

// Délègue absolument toutes les routes /api/** à Express
export default (req: VercelRequest, res: VercelResponse) => (app as any)(req, res);
