import { useEffect, useState } from "react";
import { useAnimeContext } from "../../../../client/context/AnimeContext";

type Season = {
  id: number;
  number: number;
  anime_id: number;
};

type SeasonListProps = {
  onSeasonSelect: (season: Season) => void;
};

function SeasonList({ onSeasonSelect }: SeasonListProps) {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null); // État pour la saison sélectionnée
  const { animeSelected } = useAnimeContext(); // Récupère l'anime sélectionné
  const filteredSeasons = seasons.filter(
    (season) => season.anime_id === animeSelected?.id,
  ); // Filtre les saisons pour l'anime sélectionné

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/season`,
        );
        const data = await response.json();
        setSeasons(data);
      } catch (err) {
        console.error("Erreur lors du fetch :", err);
      }
    };
    fetchSeasons();
  }, []); // Récupère les saisons depuis l'API

  useEffect(() => {
    if (filteredSeasons.length > 0 && !selectedSeason) {
      const season1 =
        filteredSeasons.find((s) => s.number === 1) ?? filteredSeasons[0];
      setSelectedSeason(season1);
      onSeasonSelect(season1);
    }
  }, [filteredSeasons, selectedSeason, onSeasonSelect]); // Définit la saison 1 par défaut si aucune saison n'est sélectionnée

  return (
    <section className="flex flex-wrap gap-4 p-4">
      {filteredSeasons.map((season) => (
        <div key={season.id}>
          <button
            type="button"
            onClick={() => {
              setSelectedSeason(season);
              onSeasonSelect(season);
            }}
            className={`text-tertiary font-semibold border-b-2 transition-colors duration-300 text-lg cursor-pointer
        ${selectedSeason?.id === season.id ? "border-secondary" : "hover:border-tertiary border-transparent"}

      `}
          >
            Saison {season.number}
          </button>
        </div>
      ))}
    </section>
  );
}

export default SeasonList;
