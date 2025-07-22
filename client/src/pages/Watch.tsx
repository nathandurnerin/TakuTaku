import { useEffect, useState } from "react";
import { useAnimeContext } from "../../context/AnimeContext";
import EpisodeList from "../components/watch/EpisodeList";
import SeasonList from "../components/watch/SeasonList";
import SummaryEpisode from "../components/watch/SummaryEpisode";
import WatchEpisode from "../components/watch/WatchEpisode";

type Season = {
  id: number;
  number: number;
  anime_id: number;
};

type Episode = {
  id: number;
  number: number;
  title: string;
  synopsis: string;
  season_id: number;
};

function Watch() {
  const [seasonSelected, setSeasonSelected] = useState<Season | null>(null);
  const [episodeSelected, setEpisodeSelected] = useState<Episode | null>(() => {
    // Récupération de l'épisode sélectionné depuis le localStorage
    const savedEpisode = localStorage.getItem("episodeSelected");
    return savedEpisode ? JSON.parse(savedEpisode) : null;
  });

  const { setAnimeSelected } = useAnimeContext();

  // Récupération de l'ensemble des données de l'animé sélectionné depuis le localStorage
  useEffect(() => {
    const animeData = localStorage.getItem("animeSelected");
    if (animeData) {
      const anime = JSON.parse(animeData);
      setAnimeSelected(anime);
    }
  }, [setAnimeSelected]);

  // Fonction pour gérer la sélection d'un épisode
  const handleEpisodeSelect = (episode: Episode) => {
    setEpisodeSelected(episode); // Met à jour l'état local de l'épisode sélectionné
    localStorage.setItem("episodeSelected", JSON.stringify(episode)); // Sauvegarde de l'épisode sélectionné dans le localStorage
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll vers le haut de la page
  };

  return (
    <section className="mx-5 mt-20 md:mt-0 md:mx-15 lg:mx-30 xl:mx-60 2xl:mx-80 3xl:mx-100">
      <WatchEpisode episodeSelected={episodeSelected} />
      <SummaryEpisode
        seasonSelected={seasonSelected}
        episodeSelected={episodeSelected}
      />
      <SeasonList onSeasonSelect={setSeasonSelected} />
      <EpisodeList
        seasonSelected={seasonSelected}
        onEpisodeSelect={handleEpisodeSelect}
        episodeSelected={episodeSelected}
      />
    </section>
  );
}

export default Watch;
