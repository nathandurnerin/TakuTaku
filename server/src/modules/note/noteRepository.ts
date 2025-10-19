import supabase from "../../../database/supabase";

export interface Note {
  id: number;
  note: number;      // 1 à 5
  users_id: number;
  anime_id: number;
}

class NoteRepository {
  // CREATE — si un user note plusieurs fois le même anime,
  // tu peux soit laisser plusieurs lignes, soit ajouter une contrainte UNIQUE.
  async create(note: Omit<Note, "id">): Promise<number> {
    const { data, error } = await supabase
      .from("note")
      .insert([{
        users_id: note.users_id,
        anime_id: note.anime_id,
        note:     note.note,
      }])
      .select("id")
      .single();

    if (error) throw error;
    return data!.id as number;
  }

  // READ moyenne des notes d’un anime
  async read(anime_id: number): Promise<{ average: number | null }> {
    const { data, error } = await supabase
      .from("note")
      .select("note")
      .eq("anime_id", anime_id);

    if (error) throw error;

    if (!data || data.length === 0) {
      return { average: null };
    }

    const notes = (data ?? []).map((r: { note: number }) => Number(r.note));
const sum   = notes.reduce((acc: number, x) => acc + x, 0);
const avg   = sum / notes.length;
return { average: Math.round(avg * 10) / 10 };

  }

  // READ ALL (toutes les notes)
  async readAll(): Promise<Note[]> {
    const { data, error } = await supabase
      .from("note")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Note[];
  }

  // UPDATE — change la note d’un user pour un anime
  async update(note: Omit<Note, "id">): Promise<number> {
    const { data, error } = await supabase
      .from("note")
      .update({ note: note.note })
      .eq("anime_id", note.anime_id)
      .eq("users_id", note.users_id)
      .select("id");

    if (error) throw error;
    return data?.length ?? 0; // nombre de lignes modifiées
  }

  // READ la note d’un user spécifique sur un anime
  async readUserNote(anime_id: number, users_id: number): Promise<number | null> {
    const { data, error } = await supabase
      .from("note")
      .select("note")
      .eq("anime_id", anime_id)
      .eq("users_id", users_id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return data.note;
  }

  // DELETE la note d’un user pour un anime (optionnel mais utile)
  async delete(anime_id: number, users_id: number): Promise<boolean> {
    const { data, error } = await supabase
      .from("note")
      .delete()
      .eq("anime_id", anime_id)
      .eq("users_id", users_id)
      .select("id");

    if (error) throw error;
    return (data?.length ?? 0) > 0;
  }
}

export default new NoteRepository();
