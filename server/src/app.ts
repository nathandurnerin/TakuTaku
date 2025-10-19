import express from "express";
import cors from "cors";
import router from "./router";

const app = express();

/* =========================
   CORS
   ========================= */

// Autoriser une ou plusieurs origines via CLIENT_URL="https://front.app, http://localhost:5173"
const origins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: origins.length ? origins : "*",
    // tu n'utilises PAS de cookies -> false
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());
/* =========================
   Body parsers
   ========================= */

// JSON et x-www-form-urlencoded suffisent dans 99% des cas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// N'active PAS ces deux-là globalement sauf si besoin spécifique
// app.use(express.text());
// app.use(express.raw());

/* =========================
   Routes API
   ========================= */

app.use(router);

/* =========================
   Static (optionnel en local)
   ========================= */

import fs from "node:fs";
import path from "node:path";

// Ces blocs sont utiles en dev local si tu veux tout servir depuis le serveur.
// Sur Vercel (serverless), ton front est sur un autre projet Vercel : pas nécessaire.

const publicFolderPath = path.join(__dirname, "../../server/public");
if (fs.existsSync(publicFolderPath)) {
  app.use(express.static(publicFolderPath));
}

const clientBuildPath = path.join(__dirname, "../../client/dist");
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get("*", (_, res) => {
    res.sendFile("index.html", { root: clientBuildPath });
  });
}

/* =========================
   Error logger (en dernier)
   ========================= */

import type { ErrorRequestHandler } from "express";
const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  console.error("on req:", req.method, req.path);
  next(err);
};
app.use(logErrors);

export default app;
