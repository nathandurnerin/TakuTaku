import supabase from "../../../database/supabase";

export type Season = {
  id: number;
  number: number;
  anime_id: number;
};

class SeasonRepository {
  // CREATE
  async create(season: Omit<Season, "id">): Promise<number> {
    const { data, error } = await supabase
      .from("season") // ou "Season" si ta table est en CamelCase
      .insert([{
        number: season.number,
        anime_id: season.anime_id,
      }])
      .select("id")
      .single();

    if (error) throw error;
    return data!.id as number;
  }

  // READ (un season par id)
  async read(id: number): Promise<Season | null> {
    const { data, error } = await supabase
      .from("season")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return (data ?? null) as Season | null;
  }

  // READ ALL
  async readAll(): Promise<Season[]> {
    const { data, error } = await supabase
      .from("season")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Season[];
  }

  // UPDATE
  async update(season: Season): Promise<boolean> {
    const { data, error } = await supabase
      .from("season")
      .update({
        number: season.number,
        anime_id: season.anime_id,
      })
      .eq("id", season.id)
      .select("id");

    if (error) throw error;
    return (data?.length ?? 0) > 0;
  }

  // DELETE
  async delete(id: number): Promise<boolean> {
    const { data, error } = await supabase
      .from("season")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) throw error;
    return (data?.length ?? 0) > 0;
  }
}

export default new SeasonRepository();
