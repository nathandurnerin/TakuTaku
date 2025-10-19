import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthContext } from "./AuthContext";
import { useUserContext } from "./UserContext";

type FavoriteContextType = {
  favorites: number[];
  isFavorite: (animeId: number) => boolean;
  toggleFavorite: (animeId: number) => Promise<void>;
  fetchFavorites: () => Promise<void>;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);
const API = import.meta.env.VITE_API_URL;

export const FavoriteProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const { connected } = useAuthContext();
  const { user } = useUserContext(); // on suppose user = { id, token? }

  const fetchFavorites = useCallback(async () => {
    if (!connected || !user?.id) return;
    try {
      const res = await fetch(`${API}/api/favorite_anime/${user.id}`, {
        headers: user.token ? { Authorization: `Bearer ${user.token}` } : {},
      });

      if (!res.ok) {
        const msg = await res.text();
        console.warn("fetchFavorites !ok:", res.status, msg);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        const ids = data.map((fav: { anime_id: number }) => fav.anime_id);
        setFavorites(ids);
      } else {
        console.warn("fetchFavorites: payload inattendu", data);
      }
    } catch (error) {
      console.error("fetchFavorites error:", error);
    }
  }, [connected, user?.id, user?.token]);

  // charge les favoris au login / changement d'utilisateur
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // nettoie les favoris quand on se déconnecte
  useEffect(() => {
    if (!connected || !user?.id) setFavorites([]);
  }, [connected, user?.id]);

  const isFavorite = (animeId: number) => favorites.includes(animeId);

  const toggleFavorite = async (animeId: number) => {
  if (!connected || !user?.id) return;

  const already = isFavorite(animeId);

  try {
    if (!already) {
      const res = await fetch(`${API}/api/favorite_anime`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: JSON.stringify({ users_id: user.id, anime_id: animeId }),
      });
      if (!res.ok) { console.error("ADD favorite failed:", res.status, await res.text()); return; }

      // <- MAJ locale (optimiste) + rafraîchissement de la liste depuis l’API
      setFavorites(prev => prev.includes(animeId) ? prev : [...prev, animeId]);
      await fetchFavorites(); // ⭐ IMPORTANT
    } else {
      const res = await fetch(`${API}/api/favorite_anime/${user.id}/${animeId}`, {
        method: "DELETE",
        headers: { ...(user.token ? { Authorization: `Bearer ${user.token}` } : {}) },
      });
      if (!res.ok && res.status !== 204) { console.error("DELETE favorite failed:", res.status, await res.text()); return; }

      setFavorites(prev => prev.filter(id => id !== animeId));
      await fetchFavorites(); // ⭐ IMPORTANT
    }
  } catch (e) {
    console.error("toggleFavorite network error:", e);
  }
};


  return (
    <FavoriteContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, fetchFavorites }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavoriteContext = () => {
  const ctx = useContext(FavoriteContext);
  if (!ctx) throw new Error("useFavoriteContext doit être utilisé dans un FavoriteProvider");
  return ctx;
};
