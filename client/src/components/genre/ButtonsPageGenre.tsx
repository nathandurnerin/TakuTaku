import type { Anime } from "../../../context/AnimeContext";
import ButtonGenre from "./ButtonGenre";
import ButtonType from "./ButtonType";

type ButtonsPageGenreProps = {
  setGenre: (genre: string) => void;
  setType: (type: string) => void;
  filteredAnime: Anime[];
  setFilteredAnime: (filteredAnime: Anime[]) => void;
};

function ButtonsPageGenre({
  setGenre,
  setType,
  filteredAnime,
  setFilteredAnime,
}: ButtonsPageGenreProps) {
  const resetAnime = () => {
    setFilteredAnime([]);
  };

  return (
    <>
      {filteredAnime.length > 0 ? (
        <div className="flex mx-auto gap-4 md:mr-10 md:mx-0 xl:mx-0">
          <button
            className="text-primary bg-[var(--color-secondary)] font-semibold py-2 px-4 rounded-lg flex items-center gap-1 cursor-pointer"
            type="button"
            onClick={resetAnime}
          >
            {" "}
            Réinitialiser la recherche{" "}
          </button>
        </div>
      ) : (
        <>
          <div className="flex mx-auto gap-4 md:mr-10 md:mx-0 xl:mx-0">
            <ButtonGenre setGenre={setGenre} />
            <ButtonType setType={setType} />
          </div>
        </>
      )}
    </>
  );
}
export default ButtonsPageGenre;
