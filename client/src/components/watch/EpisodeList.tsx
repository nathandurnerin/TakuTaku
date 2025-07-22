import { useEffect, useState } from "react";
import { useAnimeContext } from "../../../context/AnimeContext";

type Episode = {
  id: number;
  number: number;
  title: string;
  synopsis: string;
  season_id: number;
};

type Season = {
  id: number;
  number: number;
  anime_id: number;
};

type EpisodeListProps = {
  seasonSelected: Season | null;
  onEpisodeSelect: (episode: Episode) => void;
  episodeSelected?: Episode | null; // Épisode sélectionné
};

function EpisodeList({
  seasonSelected,
  onEpisodeSelect,
  episodeSelected,
}: EpisodeListProps) {
  const { animeSelected } = useAnimeContext(); // Récupère l'anime sélectionné
  const [episodes, setEpisodes] = useState<Episode[]>([]); // État pour stocker les épisodes

  const filteredEpisodes = episodes.filter(
    (episode) => episode.season_id === seasonSelected?.id,
  ); // Filtre les épisodes pour la saison sélectionnée

  // Récupère les épisodes depuis l'API
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/episode`,
        );
        const data = await response.json();
        setEpisodes(data);
      } catch (err) {
        console.error("Erreur lors du fetch :", err);
      }
    };
    fetchEpisodes();
  }, []);

  // Mise à jour de l'état de l'épisode sélectionné
  useEffect(() => {
    if (
      filteredEpisodes.length > 0 &&
      seasonSelected &&
      (!episodeSelected || episodeSelected.season_id !== seasonSelected.id)
    ) {
      onEpisodeSelect(filteredEpisodes[0]); // Sélectionne le premier épisode de la saison par défaut
    }
  }, [filteredEpisodes, seasonSelected, episodeSelected, onEpisodeSelect]);

  return (
    <section>
      <ul className="flex flex-col gap-4 p-4 md:flex-row md:flex-wrap">
        {filteredEpisodes.map((episode) => (
          <li key={episode.id} className="flex md:flex-col md:w-[200px] gap-2">
            <img
              src={animeSelected?.paysage}
              alt={animeSelected?.title}
              className="mb-2 w-[200px]"
            />

            <button
              type="button"
              onClick={() => {
                onEpisodeSelect(episode);
              }}
              className={`flex flex-col items-start justify-start text-left cursor-pointer
    ${episodeSelected?.id === episode.id ? "font-semibold text-secondary" : "hover:font-semibold text-tertiary"}
  `}
            >
              <span className="block text-sm">
                S0{seasonSelected?.number}E{episode.number} - {episode.title}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default EpisodeList;
