// server/src/modules/favoriteAnime/favoriteAnimeAction.ts
import type { RequestHandler } from "express";
import repo from "./favoriteAnimeRepository";
import supabase from "../../../database/supabase";

// GET /api/favorite_anime/:users_id
export const browse: RequestHandler = async (req, res, next) => {
  try {
    const users_id = Number(req.params.users_id);
    if (!Number.isInteger(users_id)) {
      res.status(400).json({ error: "users_id invalide" });
      return;
    }
    const rows = await repo.readAll(users_id);
    res.json(rows);
  } catch (err) {
    console.error("favorite.browse error:", err); // ⬅️ utile si ça replante
    next(err);
  }
};

// GET /api/favorite_anime/:users_id/:anime_id
export const read: RequestHandler = async (req, res, next) => {
  try {
    const users_id = Number(req.params.users_id);
    const anime_id = Number(req.params.anime_id);
    if (!Number.isInteger(users_id) || !Number.isInteger(anime_id)) { res.status(400).json({ error: "params invalides" }); return; }
    const fav = await repo.read(users_id, anime_id);
    if (!fav) { res.sendStatus(404); return; }
    res.json(fav); return;
  } catch (err) { next(err); }
};

// POST /api/favorite_anime   body: { users_id, anime_id }
export const add: RequestHandler = async (req, res) => {
  try {
    console.log("ADD /favorite_anime body =", req.body);
    const users_id = Number(req.body?.users_id);
    const anime_id = Number(req.body?.anime_id);

    if (!Number.isInteger(users_id) || !Number.isInteger(anime_id)) {
      res.status(400).json({ error: "users_id et anime_id requis (entiers)" }); return;
    }

    // 🔎 existence explicite
    const { data: u } = await supabase.from("users").select("id").eq("id", users_id).maybeSingle();
    if (!u) { res.status(400).json({ error: `users_id ${users_id} inexistant` }); return; }

    const { data: a } = await supabase.from("anime").select("id").eq("id", anime_id).maybeSingle();
    if (!a) { res.status(400).json({ error: `anime_id ${anime_id} inexistant` }); return; }

    const ok = await repo.create({ users_id, anime_id });
    res.status(201).json({ ok: true });
  } catch (err: any) {
    console.error("favorite.add error:", err?.code, err?.message || err);
    res.status(err?.status ?? 500).json({ error: err?.message ?? "Internal Server Error" });
  }
};

// DELETE /api/favorite_anime/:users_id/:anime_id
export const destroy: RequestHandler = async (req, res, next) => {
  try {
    const users_id = Number(req.params.users_id);
    const anime_id = Number(req.params.anime_id);
    if (!Number.isInteger(users_id) || !Number.isInteger(anime_id)) {
      res.status(400).json({ error: "params invalides" }); return;
    }

    const ok = await repo.delete(users_id, anime_id);
    if (!ok) { res.sendStatus(404); return; }

    res.sendStatus(204); return;
  } catch (err) { next(err); }
};

export default { browse, read, add, destroy };
