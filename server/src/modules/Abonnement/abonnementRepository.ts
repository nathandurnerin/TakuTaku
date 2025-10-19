import supabase from '../../../database/supabase';

type AbonnementName = "découverte" | "premium";
type Abonnement = { id: number; name: AbonnementName };


class AbonnementRepository {
  // CREATE
  async create(abonnement: Omit<Abonnement, "id">) {
    const { data, error } = await supabase
      .from("abonnement") // ou "Abonnement" si ta table est en CamelCase
      .insert({ name: abonnement.name })
      .select("id")
      .single();

    if (error) throw error;
    return data.id as number;
  }

  // READ (one)
  async read(id: number) {
    const { data, error } = await supabase
      .from("abonnement")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Abonnement;
  }

  // READ ALL
  async readAll() {
    const { data, error } = await supabase
      .from("abonnement")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Abonnement[];
  }

  // UPDATE
  async update(abonnement: Abonnement) {
    const { data, error } = await supabase
      .from("abonnement")
      .update({ name: abonnement.name })
      .eq("id", abonnement.id)
      .select("id"); // retourne les lignes modifiées

    if (error) throw error;
    return (data?.length ?? 0); // équivalent à affectedRows
  }

  // DELETE
  async delete(id: number) {
    const { data, error } = await supabase
      .from("abonnement")
      .delete()
      .eq("id", id)
      .select("id"); // pour savoir combien ont été supprimées

    if (error) throw error;
    return (data?.length ?? 0);
  }
}

export default new AbonnementRepository();
