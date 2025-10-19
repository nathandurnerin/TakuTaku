import supabase from "../../../database/supabase";

export type Episode = {
  id: number;
  number: number;
  title: string;
  synopsis: string;
  season_id: number;
};

class EpisodeRepository {
  // CREATE
  async create(episode: Omit<Episode, "id">): Promise<number> {
    const { data, error } = await supabase
      .from("episode") // ou "Episode" si ta table est en CamelCase
      .insert([{
        number: episode.number,
        title: episode.title,
        synopsis: episode.synopsis,
        season_id: episode.season_id,
      }])
      .select("id")   // pour récupérer l'id
      .single();

    if (error) throw error;
    return data!.id as number;
  }

  // READ (un episode par id)
  async read(id: number): Promise<Episode | null> {
    const { data, error } = await supabase
      .from("episode")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return (data ?? null) as Episode | null;
  }

  // READ ALL
  async readAll(): Promise<Episode[]> {
    const { data, error } = await supabase
      .from("episode")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Episode[];
  }

  // UPDATE
  async update(episode: Episode): Promise<boolean> {
    const { data, error } = await supabase
      .from("episode")
      .update({
        number: episode.number,
        title: episode.title,
        synopsis: episode.synopsis,
        season_id: episode.season_id,
      })
      .eq("id", episode.id)
      .select("id"); // retourne les lignes modifiées

    if (error) throw error;
    return (data?.length ?? 0) > 0;
  }

  // DELETE
  async delete(id: number): Promise<boolean> {
    const { data, error } = await supabase
      .from("episode")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) throw error;
    return (data?.length ?? 0) > 0;
  }
}

export default new EpisodeRepository();
