import { useState } from "react";
import { useNavigate } from "react-router";
import { useAnimeContext } from "../../../context/AnimeContext";

function DesktopSearchBar() {
  const [search, setSearch] = useState("");
  const { anime } = useAnimeContext();
  const navigate = useNavigate();

  const handleSearch = () => {
    const result = anime.filter((anime) =>
      anime.title.toLowerCase().includes(search.toLowerCase()),
    );
    const found = result[0];
    if (found) {
      navigate(`/anime/${found.id}`);
    }
  };

  return (
    <div className="flex items-center min-w-[200px] md:w-90 w-62 h-10 md:h-full rounded-full bg-tertiary">
      <input
        className=" w-full px-4 text-gray-800 outline-none focus:outline-none "
        type="search"
        name="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher par titre..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <button
        type="button"
        className=" rounded px-4 py-3 text-tertiary"
        onClick={handleSearch}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 59 59"
          fill=""
          className="h-5 w-5 cursor-pointer "
        >
          <title>Search Icon</title>
          <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
        </svg>
      </button>
    </div>
  );
}
export default DesktopSearchBar;
