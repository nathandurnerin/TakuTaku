// server/src/modules/auth/authRepository.ts
import supabase from "../../../database/supabase";
import bcrypt from "bcryptjs";

export type AuthUser = {
  id: number;
  firstname: string;
  lastname: string;
  mail: string;
  // password n'est jamais renvoyé vers l'extérieur
  abonnement_id: number;
  is_admin: boolean;
  is_actif: boolean;
};

type AuthUserRow = AuthUser & { password: string };

const stripPassword = (u: AuthUserRow): AuthUser => {
  const { password, ...rest } = u;
  return rest;
};

class AuthRepository {
  /**
   * Crée un utilisateur avec mot de passe hashé (bcrypt).
   * - Vérifie l'unicité de l'email (case-insensitive).
   * - Applique les valeurs par défaut si non fournies (is_admin=false, is_actif=true).
   * - Retourne l'id créé.
   */
  async create(user: Omit<AuthUser, "id" | "is_admin" | "is_actif"> & { password: string; is_admin?: boolean; is_actif?: boolean; }): Promise<number> {
    const email = user.mail.trim().toLowerCase();

    // 1) email unique ?
    {
      const { data: exists, error: e1 } = await supabase
        .from("users")
        .select("id")
        .eq("mail", email)
        .maybeSingle();

      if (e1) throw e1;
      if (exists) {
        const err = new Error("E_MAIL_ALREADY_USED");
        (err as any).code = "EMAIL_TAKEN";
        throw err;
      }
    }

    // 2) hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(user.password, salt);

    // 3) insert
    const { data, error } = await supabase
      .from("users")
      .insert([{
        firstname: user.firstname,
        lastname:  user.lastname,
        mail:      email,
        password:  hashed,
        abonnement_id: user.abonnement_id,
        is_admin:  user.is_admin ?? false,
        is_actif:  user.is_actif ?? true,
      }])
      .select("id")
      .single();

    if (error) throw error;
    return data!.id as number;
  }

  /**
   * Lit un utilisateur par id (sans le password).
   */
  async read(id: number): Promise<AuthUser | null> {
    const { data, error } = await supabase
      .from("users")
      .select("id, firstname, lastname, mail, abonnement_id, is_admin, is_actif")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return (data ?? null) as AuthUser | null;
  }

  /**
   * Liste tous les users (sans password).
   */
  async readAll(): Promise<AuthUser[]> {
    const { data, error } = await supabase
      .from("users")
      .select("id, firstname, lastname, mail, abonnement_id, is_admin, is_actif")
      .order("id", { ascending: true });

    if (error) throw error;
    return (data ?? []) as AuthUser[];
  }

  /**
   * Sign-in : vérifie email + mot de passe (hash bcrypt).
   * Retourne l'utilisateur sans le password, ou null si credentials invalides
   * ou si le compte n'est pas actif.
   */
  async signIn(mail: string, password: string): Promise<AuthUser | null> {
    const email = mail.trim().toLowerCase();

    const { data, error } = await supabase
      .from("users")
      .select("id, firstname, lastname, mail, password, abonnement_id, is_admin, is_actif")
      .eq("mail", email)
      .maybeSingle<AuthUserRow>();

    if (error) throw error;
    if (!data) return null;            // email inconnu
    if (!data.is_actif) return null;   // compte désactivé

    const ok = await bcrypt.compare(password, data.password);
    if (!ok) return null;              // mauvais mot de passe

    return stripPassword(data);
  }

  /**
   * (Optionnel) Mise à jour basique d'un user (hors password).
   */
  async update(user: Partial<Omit<AuthUser, "mail">> & { id: number }): Promise<number> {
    const payload: any = {};
    if (typeof user.firstname !== "undefined") payload.firstname = user.firstname;
    if (typeof user.lastname  !== "undefined") payload.lastname  = user.lastname;
    if (typeof user.abonnement_id !== "undefined") payload.abonnement_id = user.abonnement_id;
    if (typeof user.is_admin !== "undefined") payload.is_admin = user.is_admin;
    if (typeof user.is_actif !== "undefined") payload.is_actif = user.is_actif;

    const { data, error } = await supabase
      .from("users")
      .update(payload)
      .eq("id", user.id)
      .select("id");

    if (error) throw error;
    return data?.length ?? 0;
  }

  /**
   * (Optionnel) Changement de mot de passe (hash).
   */
  async changePassword(id: number, newPassword: string): Promise<number> {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    const { data, error } = await supabase
      .from("users")
      .update({ password: hashed })
      .eq("id", id)
      .select("id");

    if (error) throw error;
    return data?.length ?? 0;
  }

  /**
   * Suppression d'un user.
   */
  async delete(id: number): Promise<number> {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) throw error;
    return data?.length ?? 0;
  }
}

export default new AuthRepository();
