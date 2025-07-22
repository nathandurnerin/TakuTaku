// Import react and necessary hooks
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useAnimeContext } from "../../../../client/context/AnimeContext";
import type { Anime } from "../../../../client/context/AnimeContext";

import { EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// Import for Swiper
import type { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import "swiper/css/effect-coverflow";

import WatchButton from "../../components/home/WatchButton";
// Import components
import DesktopSearchBar from "../Header/DesktopSearchBar";

// Import icons
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";
import { Link } from "react-router";

function Carousel() {
  const [selectAnime, setSelectAnime] = useState<Anime[]>([]);
  const { getAnimebyId, setAnimeSelected } = useAnimeContext();
  const [animeIndex, setAnimeIndex] = useState<number>(2);
  const swiperRef = useRef<SwiperType | null>(null); // Reference pour le contrôle du Swiper

  const handleClick = (anime: Anime) => {
    setAnimeSelected(anime);
  };

  useEffect(() => {
    Promise.all([
      getAnimebyId(17),
      getAnimebyId(19),
      getAnimebyId(1),
      getAnimebyId(2),
      getAnimebyId(16),
      getAnimebyId(12),
      getAnimebyId(5),
    ]).then((data) => {
      setSelectAnime(data.filter((anime): anime is Anime => anime !== null));
    });
  }, [getAnimebyId]);

  // Fonction des boutons
  function setNextR() {
    swiperRef.current?.slideNext();
  }

  function setNextL() {
    swiperRef.current?.slidePrev();
  }

  // Contrôle du bug d'affichage : Force une mise à jour manuelle du Swiper quand les données sont chargées
  // Utile si on ne veut pas recréer le composant mais que les slides ne s’affichent pas bien
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.update();
    }
  }, []);

  return (
    <section
      className="relative bg-cover bg-center transition-[background-image] duration-500 mt-21 md:mt-0"
      style={{
        backgroundImage: `url(${selectAnime[animeIndex]?.paysage})`,
      }}
    >
      <div className="block absolute left-1/2 transform -translate-x-1/2 z-20 mt-7">
        <DesktopSearchBar />
      </div>
      {/* Calque de flou par-dessus l'image de fond */}
      <div className="absolute inset-0 bg-primary/50 backdrop-blur-xs z-0 scale-y-[1.05]" />

      {/* Contenu principal au-dessus du flou */}
      <div className="relative z-10 pt-20">
        <div className="relative pt-5 ">
          {/* Bouton gauche */}
          <RxChevronLeft
            aria-label="Précédent"
            role="button"
            type="button"
            onClick={setNextL}
            className=" lg:flex lg:absolute lg:left-4 lg:top-1/2 lg:-translate-y-1/2 lg:bg-[var(--color-secondary)] lg:rounded-full lg:w-8 lg:h-8 lg:z-10 hidden cursor-pointer"
          />
          <div>
            {/* Bouton droit */}
            <RxChevronRight
              aria-label="Suivant"
              role="button"
              type="button"
              onClick={setNextR}
              className=" lg:flex lg:absolute lg:right-4 lg:top-1/2 lg:-translate-y-1/2 lg:bg-[var(--color-secondary)] lg:rounded-full lg:w-8 lg:h-8 lg:z-10 hidden cursor-pointer"
            />
          </div>

          <Swiper
            key={selectAnime.length} // 🔑 Force React à recréer Swiper une fois les données chargées, ce qui résout les bugs d’effet initial.
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            loop={true}
            initialSlide={2}
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={3}
            spaceBetween={20}
            breakpoints={{
              768: {
                slidesPerView: 5,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 30,
              },
              1440: {
                slidesPerView: 5,
                spaceBetween: 50,
              },
              1920: {
                slidesPerView: 5,
                spaceBetween: 80,
              },
              2560: {
                slidesPerView: 5,
                spaceBetween: 120,
              },
            }}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 50,
              modifier: 1,
              slideShadows: false,
            }}
            modules={[EffectCoverflow]}
            className="w-full h-full"
            onSlideChange={(swiper) => {
              setAnimeIndex(swiper.realIndex);
            }}
          >
            {selectAnime.length > 0 ? (
              selectAnime.map((anime) => (
                <SwiperSlide
                  key={anime.id}
                  style={{ width: "300px", cursor: "pointer" }}
                  onClick={() => handleClick(anime)}
                >
                  <div>
                    <Link
                      to="/anime"
                      onClick={() => handleClick(selectAnime[animeIndex])}
                    >
                      <img
                        src={anime.portrait}
                        alt={anime.title}
                        className="w-full rounded-sm h-full py-3 xl:py-5 object-contain"
                      />
                    </Link>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <p>Chargement...</p>
            )}
          </Swiper>
        </div>
        {selectAnime[animeIndex] && (
          <div className="relative z-10 text-center text-tertiary p-4">
            <h2 className="relative z-10 text-center text-[1.7rem] lg:text-4xl text-tertiary p-4">
              {selectAnime[animeIndex].title}
            </h2>
            <div className="text-tertiary px-4 lg:px-0">
              <div className="flex justify-center">
                <p className="text-center max-w-xl tracking-wide text-sm lg:min-h-[150px] min-h-[240px] md:min-h-[140px]">
                  {selectAnime[animeIndex].synopsis}
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="bg-[var(--color-secondary)] my-3 text-[var(--color-primary)] py-1 px-4 rounded-full font-semibold text-lg"
                >
                  <Link
                    to="/anime"
                    onClick={() => handleClick(selectAnime[animeIndex])}
                  >
                    DÉTAILS
                  </Link>
                </button>
              </div>
              <div className=" flex justify-center lg:mt-3 pb-3">
                <WatchButton anime={selectAnime[animeIndex]} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Carousel;
