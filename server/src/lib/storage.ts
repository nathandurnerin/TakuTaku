import supabase from "../supabaseClient";

export function toPublicUrl(
  value?: string | null,
  bucket: "poster" | "video" | "profilpicture" = "poster"
): string {
  if (!value) return "";

  // 1) URL complète (sign/public)
  if (/^https?:\/\//i.test(value)) {
    // a) convertit sign -> public
    let url = value.replace("/storage/v1/object/sign/", "/storage/v1/object/public/");
    // b) retire le token
    url = url.replace(/\?token=.*$/, "");
    return url;
  }

  // 2) sinon c'est un path relatif -> construit l'URL publique
  const { data } = supabase.storage.from(bucket).getPublicUrl(value);
  return data.publicUrl ?? "";
}

/**
 * Si jamais on te passe une URL complète, récupère le "path" relatif
 * pour pouvoir stocker en base un chemin propre (optionnel).
 */
export function toStoragePath(value?: string | null): string | null {
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) return value;

  // Match: /storage/v1/object/(sign|public)/<bucket>/<path>?token=...
  const m = value.match(/\/storage\/v1\/object\/(?:sign|public)\/[^/]+\/([^?]+)(?:\?.*)?$/i);
  return m ? m[1] : value;
}
