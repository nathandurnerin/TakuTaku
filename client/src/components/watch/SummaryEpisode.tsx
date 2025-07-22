import { useAnimeContext } from "../../../context/AnimeContext";

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

function SummaryEpisode({
  episodeSelected,
  seasonSelected,
}: { episodeSelected: Episode | null; seasonSelected: Season | null }) {
  const { animeSelected } = useAnimeContext();

  return (
    <section className="flex flex-col gap-4 p-4 md:w-2/3">
      <h2 className="text-3xl text-tertiary">
        {animeSelected ? animeSelected.title : "Titre de l'épisode"}
      </h2>
      <h3 className="text-secondary text-lg">
        S0{seasonSelected?.number}E{episodeSelected?.number} -{" "}
        {episodeSelected?.title}
      </h3>
      <p className="text-tertiary text-sm">{episodeSelected?.synopsis}</p>
    </section>
  );
}

export default SummaryEpisode;
