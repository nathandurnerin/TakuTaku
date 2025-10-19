import supabase from "../../../database/supabase";

export type Anime = {
  id: number;
  title: string;
  synopsis: string;
  portrait: string; // FRONT: URL publique stable
  date: number;
  genre_id: number;
  paysage: string;  // FRONT: URL publique stable
  video: string;    // FRONT: URL publique stable
  genre_name?: string | null;
  types?: { id: number; name: string }[];
  note?: number | null;
};

// Réponse imbriquée Supabase
type AnimeRow = {
  id: number;
  title: string;
  synopsis: string;
  portrait: string; // DB: path ou URL legacy
  date: number;
  genre_id: number;
  paysage: string;  // DB: path ou URL legacy
  video: string;    // DB: path ou URL legacy
  genre?: { id: number; name: string } | { id: number; name: string }[];
  anime_type?: { type: { id: number; name: string } | null }[];
};

/* ------------------------ Helpers Storage ------------------------ */

/**
 * Extrait le path de stockage à partir d'une URL (signed/public) ou retourne la valeur telle quelle si c'est déjà un path.
 * Exemples:
 *  - https://.../storage/v1/object/sign/poster/portrait/a.png?token=...  -> 'portrait/a.png'
 *  - https://.../storage/v1/object/public/poster/portrait/a.png         -> 'portrait/a.png'
 *  - 'portrait/a.png'                                                   -> 'portrait/a.png'
 */
function toStoragePath(value?: string): string | null {
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) return value; // déjà un path
  const match = value.match(/\/storage\/v1\/object\/(?:sign|public)\/([^/]+)\/([^?]+)(?:\?.*)?$/i);
  if (!match) return value;
  // const bucket = match[1]; // si besoin
  const path = match[2];
  return path;
}

/**
 * Retourne une URL publique stable à partir d'un path (recommandé) OU
 * normalise une URL legacy (signed → public, suppression du token).
 */
function toPublicUrl(value?: string, bucket: "poster" | "video" = "poster"): string | null {
  if (!value) return null;

  // Si on reçoit une URL, normalise en public (retire le token)
  if (/^https?:\/\//i.test(value)) {
    return value
      .replace("/storage/v1/object/sign/", "/storage/v1/object/public/")
      .replace(/\?token=.*$/, "");
  }

  // Sinon c'est un path → génère l'URL publique
  const { data } = supabase.storage.from(bucket).getPublicUrl(value);
  return data.publicUrl;
}

/** Map DB → Front (URLs publiques stables) */
function mapRowToAnimeFront(a: AnimeRow): Anime {
  const genreObj = Array.isArray(a.genre) ? a.genre[0] : a.genre;
  const portraitUrl = toPublicUrl(a.portrait, "poster") ?? "";
  const paysageUrl  = toPublicUrl(a.paysage, "poster") ?? "";
  const videoUrl    = toPublicUrl(a.video,   "video")  ?? "";

  return {
    id: a.id,
    title: a.title,
    synopsis: a.synopsis,
    portrait: portraitUrl,
    date: a.date,
    genre_id: a.genre_id,
    paysage: paysageUrl,
    video: videoUrl,
    genre_name: genreObj?.name ?? null,
    types: (a.anime_type ?? [])
      .map((x) => x.type)
      .filter(Boolean) as { id: number; name: string }[],
  };
}

/* ------------------------ Repository ------------------------ */

class AnimeRepository {
  // CREATE — on stocke le PATH en base (pas l’URL)
  async create(anime: Omit<Anime, "id" | "genre_name" | "types" | "note">) {
    const portraitPath = toStoragePath(anime.portrait);
    const paysagePath  = toStoragePath(anime.paysage);
    const videoPath    = toStoragePath(anime.video);

    const { data, error } = await supabase
      .from("anime")
      .insert([{
        title: anime.title,
        synopsis: anime.synopsis,
        portrait: portraitPath, // path
        date: anime.date,
        genre_id: anime.genre_id,
        paysage: paysagePath,   // path
        video: videoPath,       // path
      }])
      .select("id")
      .single();

    if (error) throw error;
    return data!.id as number;
  }

  // READ (un animé + genre + types) — DB → Front (URLs publiques)
  async read(id: number): Promise<Anime | null> {
    const { data, error } = await supabase
      .from("anime")
      .select(`
        id, title, synopsis, portrait, date, genre_id, paysage, video,
        genre:genre_id ( id, name ),
        anime_type ( type:type_id ( id, name ) )
      `)
      .eq("id", id)
      .single()
      .returns<AnimeRow>();

    if ((error as any)?.code === "PGRST116") return null;
    if (error) throw error;
    if (!data) return null;

    return mapRowToAnimeFront(data);
  }

  // READ ALL — DB → Front
  async readAll(): Promise<Anime[]> {
    const { data, error } = await supabase
      .from("anime")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    return (data as AnimeRow[] ?? []).map(mapRowToAnimeFront);
  }

  // READ ALL avec filtres genre/type (et URL publiques pour portrait)
  async readAllType(genre: string, type: string) {
    let q = supabase
      .from("anime")
      .select(`
        id, title, synopsis, genre_id, portrait,
        anime_type ( type:type_id ( id ) )
      `);

    if (genre !== "all") {
      q = q.eq("genre_id", Number(genre));
    } else {
      q = q.in("genre_id", [1, 2, 3]); // adapte si besoin
    }

    const { data, error } = await q;
    if (error) throw error;

    const filtered = (data ?? []).filter((row: any) => {
      if (type === "all") return true;
      const wanted = Number(type);
      const ids =
        (row.anime_type ?? [])
          .map((x: any) => x?.type?.id)
          .filter((n: any) => Number.isInteger(n)) ?? [];
      return ids.includes(wanted);
    });

    return filtered.map((row: any) => ({
      id: row.id,
      title: row.title,
      synopsis: row.synopsis,
      genre_id: row.genre_id,
      portrait: toPublicUrl(row.portrait, "poster") ?? "",
      tid:
        (row.anime_type ?? [])
          .map((x: any) => x?.type?.id)
          .filter((n: any) => Number.isInteger(n))
          .join(",") || "",
    }));
  }

  // UPDATE — normalise l’entrée et stocke le PATH
  async update(anime: Anime): Promise<number> {
    const portraitPath = toStoragePath(anime.portrait);
    const paysagePath  = toStoragePath(anime.paysage);
    const videoPath    = toStoragePath(anime.video);

    const { data, error } = await supabase
      .from("anime")
      .update({
        title: anime.title,
        synopsis: anime.synopsis,
        portrait: portraitPath, // path
        date: anime.date,
        genre_id: anime.genre_id,
        paysage: paysagePath,   // path
        video: videoPath,       // path
      })
      .eq("id", anime.id)
      .select("id");

    if (error) throw error;
    return data?.length ?? 0;
  }

  // DELETE
  async delete(id: number): Promise<number> {
    const { data, error } = await supabase
      .from("anime")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) throw error;
    return data?.length ?? 0;
  }

  // READ ALL + genre_name — DB → Front
  async readAllWithGenre() {
    const { data, error } = await supabase
      .from("anime")
      .select(`
        id, title, synopsis, portrait, date, paysage, video,
        genre:genre_id ( name )
      `);

    if (error) throw error;

    return (data as AnimeRow[] ?? []).map((row) => {
      const mapped = mapRowToAnimeFront(row);
      return {
        id: mapped.id,
        title: mapped.title,
        synopsis: mapped.synopsis,
        portrait: mapped.portrait,
        date: mapped.date,
        paysage: mapped.paysage,
        video: mapped.video,
        genre_name: mapped.genre_name,
      };
    });
  }

  // READ ALL + note moyenne (inchangé)
  async readAllWithNote() {
    const rpc = await supabase.rpc("anime_with_avg_note");
    if (!rpc.error && rpc.data) return rpc.data;

    const [{ data: animes, error: e1 }, { data: notes, error: e2 }] =
      await Promise.all([
        supabase.from("anime").select("id, title"),
        supabase.from("note").select("anime_id, note"),
      ]);

    if (e1) throw e1;
    if (e2) throw e2;

    const byAnime: Record<number, number[]> = {};
    (notes ?? []).forEach((n: any) => {
      if (!byAnime[n.anime_id]) byAnime[n.anime_id] = [];
      byAnime[n.anime_id].push(Number(n.note));
    });

    const avg = (arr: number[]) =>
      arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : null;

    return (animes ?? [])
      .map((a: any) => ({
        id: a.id,
        title: a.title,
        note: avg(byAnime[a.id] ?? []),
      }))
      .sort((x: any, y: any) => {
        if (x.note == null && y.note == null) return 0;
        if (x.note == null) return 1;
        if (y.note == null) return -1;
        return y.note - x.note;
      });
  }
}

export default new AnimeRepository();
