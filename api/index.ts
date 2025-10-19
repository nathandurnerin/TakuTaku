import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../server/src/app";

// On délègue (req, res) à Express
export default (req: VercelRequest, res: VercelResponse) => {
  return (app as any)(req, res);
};
