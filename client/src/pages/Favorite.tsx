import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Anime } from "../../context/AnimeContext";
import { useAnimeContext } from "../../context/AnimeContext";
import { useAuthContext } from "../../context/AuthContext";
import { useUserContext } from "../../context/UserContext";
import FavoriteButton from "../../src/components/favorite/FavoriteButton";

function Favorite() {
  const { user } = useUserContext();
  const { connected } = useAuthContext(); //Récupère le user et l'état de connexion
  const { setAnimeSelected, getAnimebyId } = useAnimeContext();
  const [favorites, setFavorites] = useState<Anime[]>([]); // Tableau pour stocker les favoris
  const [loading, setLoading] = useState(true); // Pour gérer l'état de chargement

  // Fonction pour gérer le clic sur un anime
  const handleClick = async (anime: Anime) => {
    const fullAnime = await getAnimebyId(anime.anime_id);
    if (fullAnime) {
      setAnimeSelected(fullAnime);
    } else {
      setAnimeSelected(anime);
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!connected || !user) return;
      // Il exécute que si l'utilisateur est connecté et a un ID
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/favorite_anime/${user.id}`,
        );

        if (!response.ok) {
          throw new Error("Impossible de récupérer les favoris.");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setFavorites(data); // Met à jour l'état avec les favoris récupérés
        } else {
          console.error(
            "Les données des favoris ne sont pas un tableau :",
            data,
          );
        }
      } catch (error) {
        console.error("Erreur fetch favoris :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [connected, user]);

  if (!connected) {
    return (
      <p className="text-tertiary text-center mt-10">
        Veuillez vous connecter pour voir vos favoris.
      </p>
    ); // Si l'utilisateur n'est pas connecté, on affiche un message
  }

  if (loading) {
    return (
      <p className="text-tertiary text-center mt-10">
        Chargement des favoris...
      </p>
    ); // Si les favoris sont en cours de chargement, on affiche un message
  }

  if (favorites.length === 0) {
    return (
      <p className="text-tertiary text-center mt-25 md:mt-10">
        Vous n'avez aucun favori pour le moment.
      </p>
    ); // Si aucun favori n'est trouvé, on affiche un message
  }

  return (
    <section className="px-4 py-8 mt-20 md:mt-0">
      <h1 className="text-tertiary text-xl mb-6">Mes Favoris</h1>
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {favorites.map((anime) => (
          <div key={anime.anime_id} className="relative group">
            <div className="relative group">
              <Link to={"/anime"} onClick={() => handleClick(anime)}>
                <img
                  src={anime.portrait}
                  alt={anime.title}
                  className="rounded w-full object-cover"
                />
              </Link>

              <div className="absolute bottom-1 left-1">
                <FavoriteButton animeId={anime.anime_id} />
              </div>
            </div>

            <p className="text-xs text-tertiary text-center mt-2">
              {anime.title}
            </p>
          </div>
        ))}
      </section>
    </section>
  );
}

export default Favorite;
