import supabase from "../../../database/supabase";

export type Genre = {
  id: number;
  name: string;
};

class GenreRepository {
  // CREATE
  async create(genre: Omit<Genre, "id">): Promise<number> {
    const { data, error } = await supabase
      .from("genre") // ou "Genre" si ta table est en CamelCase
      .insert([{ name: genre.name }])
      .select("id")
      .single();

    if (error) throw error;
    return data!.id as number;
  }

  // READ (un genre par id)
  async read(id: number): Promise<Genre | null> {
    const { data, error } = await supabase
      .from("genre")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return (data ?? null) as Genre | null;
  }

  // READ ALL
  async readAll(): Promise<Genre[]> {
    const { data, error } = await supabase
      .from("genre")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Genre[];
  }

  // UPDATE
  async update(genre: Genre): Promise<number> {
    const { data, error } = await supabase
      .from("genre")
      .update({ name: genre.name })
      .eq("id", genre.id)
      .select("id");

    if (error) throw error;
    return data?.length ?? 0; // nombre de lignes modifiées (0 ou 1)
  }

  // DELETE
  async delete(id: number): Promise<number> {
    const { data, error } = await supabase
      .from("genre")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) throw error;
    return data?.length ?? 0; // nombre de lignes supprimées
  }
}

export default new GenreRepository();
