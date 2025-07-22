import { Link, useLocation } from "react-router";
import { useAnimeContext } from "../../../context/AnimeContext";
import type { Anime } from "../../../context/AnimeContext";

type Props = {
  anime: Anime;
};

function WatchButton({ anime }: Props) {
  const { setAnimeSelected } = useAnimeContext();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleClick = () => {
    setAnimeSelected(anime);
  };

  return (
    <div className="mt-2 lg:mt-0 flex ">
      <Link to="/watch">
        <button
          type="button"
          onClick={handleClick}
          className="bg-[var(--color-secondary)] text-[var(--color-primary)] py-1 px-4 !rounded-full font-semibold !text-lg cursor-pointer"
        >
          {isHomePage ? "COMMENCER À REGARDER" : "LANCER LA VIDÉO"}
        </button>
      </Link>
    </div>
  );
}

export default WatchButton;
