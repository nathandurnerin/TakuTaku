import { useEffect, useState } from "react";
import { useRef } from "react";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import type { Anime } from "../../../../client/context/AnimeContext";
import { useAnimeContext } from "../../../../client/context/AnimeContext";
import FavoriteButton from "../../../../client/src/components/favorite/FavoriteButton";

function ShojoCarousel() {
  const [shojoAnime, setShojoAnime] = useState<Anime[]>([]);
  const { anime, setAnimeSelected, getAnimebyId } = useAnimeContext();
  const swiperRefShojo = useRef<SwiperType | null>(null);

  useEffect(() => {
    const shojoIds = anime.filter((a) => a.genre_id === 3).map((a) => a.id);

    Promise.all(shojoIds.map((id) => getAnimebyId(id))).then((data) => {
      setShojoAnime(data.filter((a): a is Anime => a !== null));
    });
  }, [anime, getAnimebyId]);

  const handleClick = (anime: Anime) => {
    setAnimeSelected(anime);
  };

  // Fonction pour les boutons gauche/droite pour les Shonens
  function setNextShojo() {
    swiperRefShojo.current?.slideNext();
  }
  function setPrevShojo() {
    swiperRefShojo.current?.slidePrev();
  }
  return (
    <div className="relative mt-10 md:mt-15">
      <h2 className="text-tertiary text-xl mb-3">Shojo</h2>
      <div className="relative">
        {/* Bouton gauche */}
        <RxChevronLeft
          onClick={setPrevShojo}
          className="hidden lg:flex absolute -left-12 top-1/2 -translate-y-1/2 bg-[var(--color-secondary)] rounded-full w-6 h-6 z-10 cursor-pointer"
        />

        {/* Bouton droit */}
        <RxChevronRight
          onClick={setNextShojo}
          className="hidden lg:flex absolute -right-12 top-1/2 -translate-y-1/2 bg-[var(--color-secondary)] rounded-full w-6 h-6 z-10 cursor-pointer"
        />
        <Swiper
          onSwiper={(swiper) => {
            swiperRefShojo.current = swiper;
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
          {shojoAnime.length > 0 ? (
            shojoAnime.map((anime) => (
              <SwiperSlide
                key={anime.id}
                style={{ width: "300px", cursor: "pointer" }}
              >
                <div className="relative">
                  <Link to={"/anime"} onClick={() => handleClick(anime)}>
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
            <p>Aucun animé trouvé</p>
          )}
        </Swiper>
      </div>
    </div>
  );
}

export default ShojoCarousel;
