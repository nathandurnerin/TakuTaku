// server/src/modules/favoriteAnime/favoriteAnimeRepository.ts
import supabase from "../../supabaseClient";

export type Favorite = {
  users_id: number;
  anime_id: number;
};

class FavoriteAnimeRepository {
  async create(favorite: Favorite): Promise<boolean> {
    const { data, error } = await supabase
      .from("favorite_anime")
      .insert([{ users_id: favorite.users_id, anime_id: favorite.anime_id }])
      .select("users_id");

    if (error) {
      // doublon -> OK (si contrainte unique)
      if ((error as any).code === "23505") return true;
      console.error("favorite.repo.create error:", error);
      throw error;
    }
    return (data?.length ?? 0) > 0;
  }

  async read(users_id: number, anime_id: number) {
    const { data, error } = await supabase
      .from("favorite_anime")
      .select("*")
      .eq("users_id", users_id)
      .eq("anime_id", anime_id)
      .maybeSingle();

    if (error) throw error;
    return data ?? null;
  }

  // ⬇️ NOUVELLE VERSION ROBUSTE
  async readAll(users_id: number): Promise<Array<{ anime_id: number; title: string; portrait: string }>> {
    // 1) ids favoris
    const { data: favIds, error: e1 } = await supabase
      .from("favorite_anime")
      .select("anime_id")
      .eq("users_id", users_id);
    if (e1) throw e1;

    const ids = (favIds ?? []).map((r: any) => r.anime_id);
    if (ids.length === 0) return [];

    // 2) animes
    const { data: animes, error: e2 } = await supabase
      .from("anime")
      .select("id, title, portrait")
      .in("id", ids);
    if (e2) throw e2;

    // Util pour convertir un lien signé OU un simple chemin en public URL
    const toPublic = (signedOrPath: string, bucket: "poster" | "profilpicture" | "video" = "poster") => {
      if (!signedOrPath) return "";
      // essaie d’extraire le chemin après le nom du bucket
      const m = signedOrPath.match(new RegExp(`${bucket}/([^?]+)`));
      const path = m ? m[1] : signedOrPath; // si on n'a pas matché, on suppose que c'est déjà un chemin
      return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    };

    return (animes ?? []).map((a: any) => ({
      anime_id: a.id,
      title: a.title,
      portrait: toPublic(a.portrait, "poster"),
    }));
  }

  async delete(users_id: number, anime_id: number): Promise<boolean> {
    const { data, error } = await supabase
      .from("favorite_anime")
      .delete()
      .eq("users_id", users_id)
      .eq("anime_id", anime_id)
      .select("users_id");

    if (error) throw error;
    return (data?.length ?? 0) > 0;
  }
}

export default new FavoriteAnimeRepository();
