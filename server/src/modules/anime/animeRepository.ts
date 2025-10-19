import supabase from "../../../database/supabase";
import { toPublicUrl, toStoragePath } from "../../lib/storage";

export type Anime = {
  id: number;
  title: string;
  synopsis: string;
  portrait: string;
  date: number;
  genre_id: number;
  paysage: string;
  video: string;
  genre_name?: string | null;
  types?: { id: number; name: string }[];
  note?: number | null;
};

type AnimeRow = {
  id: number;
  title: string;
  synopsis: string;
  portrait: string;
  date: number;
  genre_id: number;
  paysage: string;
  video: string;
  genre?: { id: number; name: string } | { id: number; name: string }[];
  anime_type?: { type: { id: number; name: string } | null }[];
};

function mapRowToAnimeFront(a: AnimeRow): Anime {
  const genreObj = Array.isArray(a.genre) ? a.genre[0] : a.genre;

  return {
    id: a.id,
    title: a.title,
    synopsis: a.synopsis,
    portrait: toPublicUrl(a.portrait, "poster"),
    date: a.date,
    genre_id: a.genre_id,
    paysage: toPublicUrl(a.paysage, "poster"),
    video: toPublicUrl(a.video, "video"),
    genre_name: genreObj?.name ?? null,
    types: (a.anime_type ?? [])
      .map((x) => x?.type)
      .filter(Boolean) as { id: number; name: string }[],
  };
}

class AnimeRepository {
  async create(anime: Omit<Anime, "id" | "genre_name" | "types" | "note">) {
    const { data, error } = await supabase
      .from("anime")
      .insert([
        {
          title: anime.title,
          synopsis: anime.synopsis,
          portrait: toStoragePath(anime.portrait),
          date: anime.date,
          genre_id: anime.genre_id,
          paysage: toStoragePath(anime.paysage),
          video: toStoragePath(anime.video),
        },
      ])
      .select("id")
      .single();

    if (error) throw error;
    return data!.id as number;
  }

  async read(id: number): Promise<Anime | null> {
    const { data, error } = await supabase
      .from("anime")
      .select(
        `
        id, title, synopsis, portrait, date, genre_id, paysage, video,
        genre:genre_id ( id, name ),
        anime_type ( type:type_id ( id, name ) )
      `
      )
      .eq("id", id)
      .single();

    if ((error as any)?.code === "PGRST116") return null;
    if (error) throw error;
    if (!data) return null;

    return mapRowToAnimeFront(data as unknown as AnimeRow);
  }

  async readAll(): Promise<Anime[]> {
    const { data, error } = await supabase
      .from("anime")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    return ((data ?? []) as AnimeRow[]).map(mapRowToAnimeFront);
  }

  async readAllType(genre: string, type: string) {
    let q = supabase
      .from("anime")
      .select(
        `
        id, title, synopsis, genre_id, portrait,
        anime_type ( type:type_id ( id ) )
      `
      );

    if (genre !== "all") q = q.eq("genre_id", Number(genre));
    else q = q.in("genre_id", [1, 2, 3]);

    const { data, error } = await q;
    if (error) throw error;

    const filtered = (data ?? []).filter((row: any) => {
      if (type === "all") return true;
      const wanted = Number(type);
      const ids = (row.anime_type ?? [])
        .map((x: any) => x?.type?.id)
        .filter((n: any) => Number.isInteger(n));
      return ids.includes(wanted);
    });

    return filtered.map((row: any) => ({
      id: row.id,
      title: row.title,
      synopsis: row.synopsis,
      genre_id: row.genre_id,
      portrait: toPublicUrl(row.portrait, "poster"),
      tid:
        (row.anime_type ?? [])
          .map((x: any) => x?.type?.id)
          .filter((n: any) => Number.isInteger(n))
          .join(",") || "",
    }));
  }

  async update(anime: Anime): Promise<number> {
    const { data, error } = await supabase
      .from("anime")
      .update({
        title: anime.title,
        synopsis: anime.synopsis,
        portrait: toStoragePath(anime.portrait),
        date: anime.date,
        genre_id: anime.genre_id,
        paysage: toStoragePath(anime.paysage),
        video: toStoragePath(anime.video),
      })
      .eq("id", anime.id)
      .select("id");

    if (error) throw error;
    return data?.length ?? 0;
  }

  async delete(id: number): Promise<number> {
    const { data, error } = await supabase
      .from("anime")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) throw error;
    return data?.length ?? 0;
  }

  async readAllWithGenre() {
    const { data, error } = await supabase
      .from("anime")
      .select(
        `
        id, title, synopsis, portrait, date, paysage, video,
        genre:genre_id ( name )
      `
      );

    if (error) throw error;

    return ((data ?? []) as AnimeRow[]).map((row) => {
      const a = mapRowToAnimeFront(row);
      return {
        id: a.id,
        title: a.title,
        synopsis: a.synopsis,
        portrait: a.portrait,
        date: a.date,
        paysage: a.paysage,
        video: a.video,
        genre_name: a.genre_name,
      };
    });
  }
}

export default new AnimeRepository();
