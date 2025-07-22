import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Typage des données du contexte
export type Anime = {
  is_favorite: boolean; // Utilisé pour savoir si l'anime est favori
  users_id: number; // Utilisé pour l'identifiant de l'utilisateur
  anime_id: number; // Utilisé pour l'identifiant de l'anime
  id: number;
  title: string;
  synopsis: string;
  portrait: string;
  date: string;
  genre_id: number;
  paysage: string;
  video: string;
  types?: { id: number; name: string }[]; // Récupération des types associés
  genre?: { id: number; name: string }; // Récupération du genre associé
  type_id?: number;
};

// Typage de ce que l'on veut que le contexte réalise
type AnimeContextType = {
  anime: Anime[];
  animeSearch: Anime[];
  setAnimeSearch: (animeSearch: Anime[]) => void;
  fetchAnimeType: (
    genre: number | string,
    type: number | string,
  ) => Promise<void>;
  animeSelected: Anime | null;
  setAnimeSelected: (anime: Anime | null) => void;
  fetchAnime: () => Promise<void>;
  getAnimebyId: (id: number) => Promise<Anime | null>;
  createAnime: (anime: Omit<Anime, "id">) => Promise<number>;
  updateAnime: (id: number, data: Partial<Anime>) => Promise<void>;
  deleteAnime: (id: number) => Promise<void>;
};

const AnimeContext = createContext<AnimeContextType | undefined>(undefined);

export const AnimeProvider = ({ children }: { children: React.ReactNode }) => {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [animeSearch, setAnimeSearch] = useState<Anime[]>([]);
  const [animeSelected, setAnimeSelected] = useState<Anime | null>(() => {
    // Récupération de l'anime sélectionné depuis le localStorage
    // Si l'anime est déjà stocké, on le parse et on le retourne, sinon on retourne null
    const storedAnime = localStorage.getItem("animeSelected");
    return storedAnime ? JSON.parse(storedAnime) : null;
  });

  useEffect(() => {
    fetchAnime();
  }, []);

  // Stockage de l'anime sélectionné dans le localStorage
  useEffect(() => {
    if (animeSelected) {
      localStorage.setItem("animeSelected", JSON.stringify(animeSelected));
    } else {
      localStorage.removeItem("animeSelected");
    }
  }, [animeSelected]);

  interface FetchAnimeTypeParams {
    genre: number | string;
    type: number | string;
  }

  const fetchAnimeType = useCallback(
    (
      genre: FetchAnimeTypeParams["genre"],
      type: FetchAnimeTypeParams["type"],
    ): Promise<void> => {
      return fetch(
        `${import.meta.env.VITE_API_URL}/api/animetype/${genre}/${type}`,
      )
        .then((res: Response) => res.json())
        .then((data: Anime[]) => {
          setAnimeSearch(data);
        });
    },
    [],
  );

  const fetchAnime = (): Promise<void> => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/anime`)
      .then((res) => res.json())
      .then((data) => {
        setAnime(data);
      });
  };

  const getAnimebyId = (id: number): Promise<Anime | null> => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/anime/${id}`)
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => data || null);
  };

  const createAnime = (newAnime: Omit<Anime, "id">): Promise<number> => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/anime`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAnime),
    })
      .then((res) => res.json())
      .then((data) => {
        fetchAnime();
        return data.insertId;
      });
  };

  const updateAnime = async (
    id: number,
    updateData: Partial<Anime>,
  ): Promise<void> => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/anime/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      },
    );
    if (!response.ok) {
      throw new Error(
        `Erreur lors de la mise à jour de l'anime avec l'ID ${id}`,
      );
    }
    setAnime((prev) =>
      prev.map((anime) =>
        anime.id === id ? { ...anime, ...updateData } : anime,
      ),
    );
  };

  const deleteAnime = async (id: number): Promise<void> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/anime/${id}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la suppression de l'anime avec l'ID ${id}`,
        );
      }
      const deletedAnime = await response.json();
      setAnime((prev) => prev.filter((anime) => anime.id !== deletedAnime.id));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'anime :", error);
    }
  };

  return (
    <AnimeContext.Provider
      value={{
        anime,
        animeSearch,
        setAnimeSearch,
        fetchAnimeType,
        animeSelected,
        setAnimeSelected,
        fetchAnime,
        getAnimebyId,
        createAnime,
        updateAnime,
        deleteAnime,
      }}
    >
      {children}
    </AnimeContext.Provider>
  );
};

// Création du hook personnalisé
export const useAnimeContext = () => {
  const context = useContext(AnimeContext);
  if (!context) {
    throw new Error("useAnimeContext doit être utilisé dans un AnimeProvider");
  }
  return context;
};
