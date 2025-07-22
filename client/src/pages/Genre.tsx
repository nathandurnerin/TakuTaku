import { useState } from "react";
import type { Anime } from "../../context/AnimeContext";
import ButtonsPageGenre from "../components/genre/ButtonsPageGenre";
import CarouselGenre from "../components/genre/CarouselGenre";
import SearchCarousel from "../components/genre/SearchCarousel";
import SearchBarGenre from "../components/genre/ShearchBarGenre";

function Genre() {
  const [genre, setGenre] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [filteredAnime, setFilteredAnime] = useState<Anime[]>([]);

  return (
    <>
      <div className="flex flex-wrap flex-col-reverse gap-y-10 md:mt-10 mt-25 items-center xl:justify-between xl:gap-10 xl:mx-50 md:flex-row md:flex-nowrap md:mx-20 md:justify-between">
        <ButtonsPageGenre
          setGenre={setGenre}
          setType={setType}
          filteredAnime={filteredAnime}
          setFilteredAnime={setFilteredAnime}
        />
        <SearchBarGenre setFilteredAnime={setFilteredAnime} />
      </div>
      {(genre && genre !== "all") ||
      (type && type !== "all") ||
      filteredAnime.length > 0 ? (
        <SearchCarousel
          genre={genre}
          type={type}
          filteredAnime={filteredAnime}
        />
      ) : (
        <CarouselGenre />
      )}
    </>
  );
}

export default Genre;
