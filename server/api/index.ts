// server/api/index.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";

export default function handler(req: VercelRequest, res: VercelResponse) {
  // petit log utile visible dans "Runtime Logs"
  // console.log("Serverless received:", req.method, req.url);
  return (app as any)(req, res);
}
