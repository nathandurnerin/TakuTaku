import { useEffect, useRef } from "react";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import type { Anime } from "../../../context/AnimeContext";
import { useAnimeContext } from "../../../context/AnimeContext";
import FavoriteButton from "../favorite/FavoriteButton";

interface propsFilter {
  genre: string;
  type: string;
  filteredAnime: Anime[];
}

function SearchCarousel({ genre, type, filteredAnime }: propsFilter) {
  const {
    animeSearch,
    setAnimeSearch,
    fetchAnimeType,
    setAnimeSelected,
    getAnimebyId,
  } = useAnimeContext();
  const swiperRefSearch = useRef<SwiperType | null>(null);

  const handleClick = async (anime: Anime) => {
    const fullAnime = await getAnimebyId(anime.id);
    if (fullAnime) {
      setAnimeSelected(fullAnime);
    } else {
      setAnimeSelected(anime);
    }
  };

  // Fonction pour les boutons gauche/droite pour les Seinens
  function setNextSearch() {
    swiperRefSearch.current?.slideNext();
  }
  function setPrevSearch() {
    swiperRefSearch.current?.slidePrev();
  }

  useEffect(() => {
    if (filteredAnime.length === 0) {
      fetchAnimeType(genre, type);
    } else {
      setAnimeSearch(filteredAnime);
    }
  }, [genre, type, fetchAnimeType, filteredAnime, setAnimeSearch]);

  return (
    <div className="relative mt-10 md:mt-15 mx-10 xl:mx-50 lg:mx-20">
      <div className="relative">
        {/* Bouton gauche */}
        <RxChevronLeft
          onClick={setPrevSearch}
          className="hidden lg:flex absolute -left-12 top-1/2 -translate-y-1/2 bg-[var(--color-secondary)] rounded-full w-6 h-6 z-10 cursor-pointer"
        />

        {/* Bouton droit */}
        <RxChevronRight
          onClick={setNextSearch}
          className="hidden lg:flex absolute -right-12 top-1/2 -translate-y-1/2 bg-[var(--color-secondary)] rounded-full w-6 h-6 z-10 cursor-pointer"
        />
        <Swiper
          onSwiper={(swiper) => {
            swiperRefSearch.current = swiper;
          }}
          slidesPerView={6}
          spaceBetween={20}
          breakpoints={{
            350: {
              slidesPerView: 2.5,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 20,
            },
          }}
          className="mySwiper"
        >
          {animeSearch.length > 0 ? (
            animeSearch.map((anime) => (
              <SwiperSlide
                key={anime.id}
                style={{ width: "300px", cursor: "pointer" }}
              >
                <div className="relative">
                  <Link to="/anime" onClick={() => handleClick(anime)}>
                    <img
                      src={anime.portrait}
                      alt={anime.title}
                      className="w-full rounded-sm"
                    />
                  </Link>
                  <div className="absolute bottom-1 left-1 z-10">
                    <FavoriteButton animeId={anime.id} />
                  </div>
                </div>
                <p className="text-[0.6rem] md:text-[0.8rem] font-light text-tertiary text-center mt-2">
                  {anime.title}
                </p>
              </SwiperSlide>
            ))
          ) : (
            <p className="text-tertiary">Aucun animé trouvé</p>
          )}
        </Swiper>
      </div>
    </div>
  );
}

export default SearchCarousel;
