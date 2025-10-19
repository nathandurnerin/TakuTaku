import supabase from "../../database/supabase";

/** Si on reçoit un path on le garde, si on reçoit une URL signée/public, on renvoie juste le path du fichier. */
export function toStoragePath(value?: string | null): string | null {
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) return value; // déjà un path
  const m = value.match(/\/storage\/v1\/object\/(?:sign|public)\/[^/]+\/([^?]+)(?:\?.*)?$/i);
  return m ? m[1] : value;
}

/** Convertit un path OU une URL signée en **URL publique stable**. */
export function toPublicUrl(value?: string | null, bucket: "poster" | "video" | "profilpicture" = "poster"): string {
  if (!value) return "";
  // URL → normalise en public et supprime le token
  if (/^https?:\/\//i.test(value)) {
    return value
      .replace("/storage/v1/object/sign/", "/storage/v1/object/public/")
      .replace(/\?token=.*$/, "");
  }
  // path → génère l’URL publique
  return supabase.storage.from(bucket).getPublicUrl(value).data.publicUrl;
}
