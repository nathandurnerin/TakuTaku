import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAnimeContext } from "../../../context/AnimeContext";
import { useUserContext } from "../../../context/UserContext";

function Note() {
  const [rated, setRated] = useState<number>(0);
  const [userRated, setUserRated] = useState<number | null>(null);
  const { animeSelected } = useAnimeContext();
  const { user } = useUserContext();
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  // Pour la récupération de la note moyenne de l'animé
  const fetchNote = useCallback(async () => {
    if (!animeSelected) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/note/${animeSelected.id}/average`,
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des notes");
      }

      const data = await response.json();
      setRated(data.average);

      // Gestion des décimales
      const average = Number.parseFloat(data.average);
      if (!Number.isNaN(average)) {
        setRated(Number(average.toFixed(1)));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la note :", error);
    }
  }, [animeSelected]);

  useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  useEffect(() => {
    // Pour la récupération de la note de l'utilisateur selon l'anime_id
    const fetchUserNote = async () => {
      if (!animeSelected) return;
      if (!user?.id) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/note/${animeSelected.id}/${user?.id}`,
        );

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des notes");
        }

        const data = await response.json();
        setUserRated(data.note);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de la note de l'utilisateur :",
          error,
        );
      }
    };

    fetchUserNote();
  }, [animeSelected, user?.id]);

  // Pour la mise à jour de la note
  const updateNote = async (star: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/note/${animeSelected?.id}/${user?.id}`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            note: star,
            users_id: user?.id,
            anime_id: animeSelected?.id,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de la note");
      }

      setUserRated(star);
      await fetchNote();
    } catch (error) {
      console.error(error);
    }
  };

  // Pour la création d'une note
  const createNote = async (userRated: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/note`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          note: userRated,
          users_id: user?.id,
          anime_id: animeSelected?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de la note");
      }

      setUserRated(userRated);
      await fetchNote();
    } catch (error) {
      console.error(error);
    }
  };

  // Au clic sur une étoile, appel la fonction en question create/update
  const toggleRating = (star: number) => {
    if (!user) {
      toast.error("Vous devez être connecté pour noter un animé");
      return;
    }
    if (userRated !== undefined) {
      const newUpdateNote = userRated === star ? 0 : star;
      updateNote(newUpdateNote);
      toast.success("Votre note a bien été mise à jour");
    } else {
      const addNewNote = userRated === star ? 0 : star;
      createNote(addNewNote);
      toast.success("Votre note a bien été enregistrée");
    }
  };

  return (
    <section className="flex gap-2 w-50">
      <section className="flex space-x-0.5 mb-1">
        {[1, 2, 3, 4, 5].map((star) => {
          // Si hoveredRating n’est pas null ou undefined, utilise-le. Sinon, utilise userRated.
          const activeRating = hoveredRating ?? userRated;
          return (
            <button
              type="button"
              key={star}
              onClick={() => toggleRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(null)}
              className={`transition transform duration-200 hover:scale-110 focus:scale-110 cursor-pointer ${
                activeRating !== null && star <= Math.round(activeRating)
                  ? "text-yellow-300"
                  : "text-gray-400"
              }`}
            >
              {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={
                  activeRating !== null && star <= activeRating
                    ? "currentColor"
                    : "none"
                }
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon
                  points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02
                12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                />
              </svg>
            </button>
          );
        })}
      </section>
      {rated > 0 && (
        <p className="text-white mb-1">
          {Number(rated) % 1 === 0 ? Number(rated) : Number(rated).toFixed(1)} /
          5
        </p>
      )}
    </section>
  );
}

export default Note;
