import supabase from "../../../database/supabase";

export type Type = {
  id: number;
  name: string;
};

class TypeRepository {
  // CREATE
  async create(type: Omit<Type, "id">): Promise<number> {
    const { data, error } = await supabase
      .from("type") // ou "Type" si ta table est en CamelCase
      .insert([{ name: type.name }])
      .select("id")
      .single();

    if (error) throw error;
    return data!.id as number;
  }

  // READ (un type par id)
  async read(id: number): Promise<Type | null> {
    const { data, error } = await supabase
      .from("type")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return (data ?? null) as Type | null;
  }

  // READ ALL
  async readAll(): Promise<Type[]> {
    const { data, error } = await supabase
      .from("type")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Type[];
  }

  // UPDATE (CORRIGÉ : on met à jour, pas delete ✅)
  async update(type: Type): Promise<number> {
    const { data, error } = await supabase
      .from("type")
      .update({ name: type.name })
      .eq("id", type.id)
      .select("id");

    if (error) throw error;
    return data?.length ?? 0; // 1 si maj réussie, 0 sinon
  }

  // DELETE
  async delete(id: number): Promise<number> {
    const { data, error } = await supabase
      .from("type")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) throw error;
    return data?.length ?? 0; // 1 si suppression, 0 sinon
  }
}

export default new TypeRepository();
