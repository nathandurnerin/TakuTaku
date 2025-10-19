import supabase from "../../../database/supabase";
import { toPublicUrl } from "../../lib/storage";

export type User = {
  id: number;
  firstname: string;
  lastname: string;
  mail: string;
  is_admin: boolean;
  is_actif: boolean;
  abonnement_id: number;
  profil_picture_id: number | null;
};

type UserRow = User & { password: string | null };

export type ProfilPicture = {
  id: number;
  profil_picture: string;
};

/** ---- Helper commun : convertir une URL signée ou un path en URL publique ---- */
function toPublic(
  signedOrPath: string | null | undefined,
  bucket: "poster" | "profilpicture" | "video" = "poster"
): string {
  if (!signedOrPath) return "";
  // si on reçoit une URL signée, on extrait le chemin après le nom du bucket
  const m = signedOrPath.match(new RegExp(`${bucket}/([^?]+)`));
  const path = m ? m[1] : signedOrPath; // si déjà un path, on garde tel quel
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

class UserRepository {
  // CREATE
  async create(user: Omit<User, "id"> & { password?: string | null }): Promise<number> {
    const { data, error } = await supabase
      .from("users")
      .insert([{
        firstname: user.firstname,
        lastname: user.lastname,
        mail: user.mail.toLowerCase().trim(),
        password: user.password ?? null,
        is_admin: user.is_admin ?? false,
        is_actif: user.is_actif ?? true,
        abonnement_id: user.abonnement_id,
        profil_picture_id: user.profil_picture_id ?? null,
      }])
      .select("id")
      .single();

    if (error) throw error;
    return data!.id as number;
  }

  // READ by id (sans password)
  async read(id: number): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("id, firstname, lastname, mail, is_admin, is_actif, abonnement_id, profil_picture_id")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return (data ?? null) as User | null;
  }

  // READ ALL (sans password)
  async readAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("id, firstname, lastname, mail, is_admin, is_actif, abonnement_id, profil_picture_id")
      .order("id", { ascending: true });

    if (error) throw error;
    return (data ?? []) as User[];
  }

  // UPDATE (sans password)
  async update(user: User): Promise<number> {
    const { data, error } = await supabase
      .from("users")
      .update({
        firstname: user.firstname,
        lastname:  user.lastname,
        mail:      user.mail.toLowerCase().trim(),
        is_admin:  user.is_admin,
        is_actif:  user.is_actif,
        abonnement_id: user.abonnement_id,
        profil_picture_id: user.profil_picture_id ?? null,
      })
      .eq("id", user.id)
      .select("id");

    if (error) throw error;
    return data?.length ?? 0;
  }

  // DELETE
  async delete(id: number): Promise<number> {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) throw error;
    return data?.length ?? 0;
  }

  // READ ALL with abonnement name
  async readAllWithAbonnement(): Promise<Array<User & { abonnement_name: string | null }>> {
    const { data, error } = await supabase
      .from("users")
      .select(`
        id, firstname, lastname, mail, is_admin, is_actif, abonnement_id, profil_picture_id,
        abonnement:abonnement_id ( name )
      `);

    if (error) throw error;

    return (data ?? []).map((u: any) => ({
      id: u.id,
      firstname: u.firstname,
      lastname: u.lastname,
      mail: u.mail,
      is_admin: u.is_admin,
      is_actif: u.is_actif,
      abonnement_id: u.abonnement_id,
      profil_picture_id: u.profil_picture_id ?? null,
      abonnement_name: u.abonnement?.name ?? null,
    }));
  }

  // READ users + animes they watched (historique croisé)
  async readAllWithUsers(): Promise<Array<{
    user_id: number; firstname: string; lastname: string;
    anime_id: number; title: string; portrait: string;
  }>> {
    const { data, error } = await supabase
      .from("users_anime")
      .select(`
        users:users_id ( id, firstname, lastname ),
        anime:anime_id ( id, title, portrait )
      `);

    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      user_id: row.users?.id,
      firstname: row.users?.firstname,
      lastname: row.users?.lastname,
      anime_id: row.anime?.id,
      title: row.anime?.title,
      portrait: toPublicUrl(row.anime?.portrait, "poster"),
    }));
  }

  // addToHistory: ajoute (users_id, anime_id) si absent
  async addToHistory(userId: number, animeId: number): Promise<{ added: boolean; message?: string }> {
    const { data, error } = await supabase
      .from("users_anime")
      .insert([{ users_id: userId, anime_id: animeId }])
      .select("users_id");

    if (error) {
      if ((error as any).code === "23505") {
        return { added: false, message: "Déjà présent" };
      }
      throw error;
    }

    return { added: (data?.length ?? 0) > 0 };
  }

  // READ history of one user (avec images publiques)
  async readUserHistory(userId: number): Promise<Array<{
    id: number; title: string; synopsis: string;
    portrait: string; date: number; paysage: string; video: string;
  }>> {
    // ids vus
    const { data: seen, error: e1 } = await supabase
      .from("users_anime")
      .select("anime_id")
      .eq("users_id", userId);
    if (e1) throw e1;

    const ids = (seen ?? []).map((r: any) => r.anime_id);
    if (ids.length === 0) return [];

    // animes
    const { data: animes, error: e2 } = await supabase
      .from("anime")
      .select("id, title, synopsis, portrait, date, paysage, video")
      .in("id", ids);
    if (e2) throw e2;

    // conversion en public URL
    return (animes ?? []).map((a: any) => ({
      id: a.id,
      title: a.title,
      synopsis: a.synopsis,
      date: a.date,
      video: a.video,
      portrait: toPublicUrl(a.portrait, "poster"),
      paysage: toPublicUrl(a.paysage, "poster"),
    }));
  }

  // signIn helper (avec password hash)
  async signIn(mail: string): Promise<UserRow | null> {
    const { data, error } = await supabase
      .from("users")
      .select("id, firstname, lastname, mail, password, is_admin, is_actif, abonnement_id, profil_picture_id")
      .eq("mail", mail.toLowerCase().trim())
      .maybeSingle();

    if (error) throw error;
    return (data ?? null) as UserRow | null;
  }

  // signUp: création directe
  async signUp(
    firstname: string,
    lastname: string,
    mail: string,
    passHash: string,
    abonnement_id: number,
    is_admin: boolean,
    is_actif: boolean,
  ): Promise<number> {
    const { data, error } = await supabase
      .from("users")
      .insert([{
        firstname,
        lastname,
        mail: mail.toLowerCase().trim(),
        password: passHash,
        abonnement_id,
        is_admin,
        is_actif,
      }])
      .select("id")
      .single();

    if (error) throw error;
    return data!.id as number;
  }

  // findById
  async findById(id: number): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("id, firstname, lastname, mail, is_admin, is_actif, abonnement_id, profil_picture_id")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return (data ?? null) as User | null;
  }

  // updateProfilPicture
  async updateProfilPicture(id: number, profil_picture_id: number | null): Promise<number> {
    const { data, error } = await supabase
      .from("users")
      .update({ profil_picture_id })
      .eq("id", id)
      .select("id");

    if (error) throw error;
    return data?.length ?? 0;
  }

  // readAllPicture
  async readAllPicture(): Promise<ProfilPicture[]> {
    const { data, error } = await supabase
      .from("profilpicture")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    return (data ?? []) as ProfilPicture[];
  }

  // readUrlPicture (retourne une URL publique)
  async readUrlPicture(userId: number): Promise<{ profil_picture: string } | null> {
    const { data, error } = await supabase
      .from("users")
      .select(`profil_picture_id, picture:profil_picture_id ( profil_picture )`)
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;

    const raw = (data as any)?.picture?.profil_picture ?? null;
    if (!raw) return null;

    return { profil_picture: toPublicUrl(raw, "profilpicture") };
  }

  // findByEmail
  async findByEmail(mail: string): Promise<{ id: number } | null> {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("mail", mail.toLowerCase().trim())
      .maybeSingle();

    if (error) throw error;
    return (data ?? null) as { id: number } | null;
  }
}

export default new UserRepository();
