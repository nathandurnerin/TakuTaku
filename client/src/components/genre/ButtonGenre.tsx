import { useEffect, useState } from "react";

interface Genre {
  id: number;
  name: string;
}

interface setGenreProps {
  setGenre: (genre: string) => void;
}

function ButtonGenre({ setGenre }: setGenreProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredGenre, setFilteredGenre] = useState<"all" | number>("all");

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/genre`,
        );
        const data = await response.json();
        setGenres(data);
      } catch (err) {
        console.error("Erreur lors du fetch :", err);
      }
    };
    fetchGenres();
  }, []);

  const handleSelectType = (id: "all" | number): void => {
    setFilteredGenre(id);
    setGenre(id.toString());
    setIsOpen(false); // Optionnel : referme le dropdown après sélection
  };

  function toggleDropdown() {
    setIsOpen((prev) => !prev);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="group transition-all duration-200 w-[150px] py-2 flex flex-row items-center justify-center bg-secondary gap-2 rounded-lg font-semibold text-sm cursor-pointer"
      >
        <span>
          {filteredGenre === "all"
            ? "GENRE"
            : genres.find((g) => g.id === filteredGenre)?.name.toUpperCase()}
        </span>
        <svg
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-90"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
        >
          <title>Dérouler les Genres</title>
          <path
            fill="currentColor"
            d="m12 10.8l-3.9 3.9q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l4.6-4.6q.3-.3.7-.3t.7.3l4.6 4.6q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-2 w-full p-2 bg-secondary rounded-lg flex flex-col gap-2">
          <button
            key="all"
            type="button"
            onClick={() => handleSelectType("all")}
            className="cursor-pointer text-left font-semibold text-sm transition duration-300 ease-in-out hover:translate-x-2 px-2"
          >
            TOUT
          </button>
          <hr className="w-[90%] border mx-auto " />
          {genres.map((genre) => (
            <button
              key={genre.id}
              type="button"
              onClick={() => handleSelectType(genre.id)}
              className="cursor-pointer text-left font-semibold text-sm transition duration-300 ease-in-out hover:translate-x-2 px-2 "
            >
              {genre.name.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ButtonGenre;
