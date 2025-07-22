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
  favorites: number[]; // liste des ID des animés favoris
  isFavorite: (animeId: number) => boolean;
  toggleFavorite: (animeId: number) => Promise<void>;
  fetchFavorites: () => Promise<void>;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined,
);

export const FavoriteProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<number[]>([]); // tableau pour stocker les ID des animés favoris
  const { connected } = useAuthContext();
  const { user } = useUserContext();

  const fetchFavorites = useCallback(async () => {
    if (!connected || !user) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/favorite_anime/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );
      const data = await res.json();

      // Vérification de la réponse et du format des données
      if (res.ok && Array.isArray(data)) {
        //vérification que data est un tableau
        const ids = data.map((fav: { anime_id: number }) => fav.anime_id); // on suppose que chaque favori a un champ anime_id
        setFavorites(ids); // Met à jour l'état avec les IDs des animés favoris
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des favoris :", error);
    }
  }, [connected, user]);

  const isFavorite = (animeId: number) => {
    return favorites.includes(animeId);
  };

  const toggleFavorite = async (animeId: number) => {
    if (!connected || !user) return;

    try {
      if (!isFavorite(animeId)) {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/favorite_anime`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              users_id: user.id,
              anime_id: animeId,
            }),
          },
        );
        if (!res.ok) throw new Error("Erreur ajout favori");
        setFavorites((prev) => [...prev, animeId]);
      } else {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/favorite_anime/${user.id}/${animeId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );
        if (!res.ok) throw new Error("Erreur suppression favori");
        setFavorites((prev) => prev.filter((id) => id !== animeId)); // on filtre pour retirer l'ID de l'anime des favoris
      }
    } catch (error) {
      console.error("Erreur lors du toggle favori :", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <FavoriteContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, fetchFavorites }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavoriteContext = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error(
      "useFavoriteContext doit être utilisé dans un FavoriteProvider",
    );
  }
  return context;
};
