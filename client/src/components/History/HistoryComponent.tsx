import { useEffect, useState } from "react";
import { useRef } from "react";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import type { Anime } from "../../../../client/context/AnimeContext";
import { useAnimeContext } from "../../../../client/context/AnimeContext";
import { useUserContext } from "../../../context/UserContext";

function History() {
  const { connected } = useUserContext();
  const [, setShowHistory] = useState(false);
  const [viewedAnime, setViewedAnime] = useState<Anime[]>([]);
  const { setAnimeSelected } = useAnimeContext();
  const swiperRefShojo = useRef<SwiperType | null>(null);
  const { user } = useUserContext();

  useEffect(() => {
    const readAnime = async () => {
      try {
        if (!user) return;
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/${user.id}/history`,
        );
        const data = await res.json();
        setViewedAnime(data);
      } catch (err) {
        console.error("Erreur lors du fetch:", err);
      }
    };

    readAnime();
  }, [user]);

  const handleClick = (anime: Anime) => {
    setAnimeSelected(anime);
    console.log("Anime sélectionné:", anime);
    localStorage.setItem("selectedAnime", JSON.stringify(anime));
  };

  function setNextAnimeSelected() {
    swiperRefShojo.current?.slideNext();
  }

  function setPrevAnimeSelected() {
    swiperRefShojo.current?.slidePrev();
  }
  useEffect(() => {
    if (connected) {
      setShowHistory(true);
    } else {
      setShowHistory(false);
    }
  }, [connected]);

  return (
    <div className="relative mt-25 mx-10 lg:mx-20 md:mt-15">
      <h2 className="text-tertiary text-xl mb-3">Historique de Visionnage</h2>
      <div className="relative">
        {/* Bouton gauche */}
        <RxChevronLeft
          onClick={setPrevAnimeSelected}
          className="hidden lg:flex absolute -left-12 top-1/2 -translate-y-1/2 bg-[var(--color-secondary)] rounded-full w-6 h-6 z-10 cursor-pointer"
        />

        {/* Bouton droit */}
        <RxChevronRight
          onClick={setNextAnimeSelected}
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
          {viewedAnime.length > 0 ? (
            viewedAnime.map((anime) => (
              <SwiperSlide
                key={anime.id}
                style={{ width: "300px", cursor: "pointer" }}
                onClick={() => handleClick(anime)}
              >
                <div>
                  <Link to={"/anime"} onClick={() => handleClick(anime)}>
                    <img
                      src={anime.portrait}
                      alt={anime.title}
                      className="w-full rounded-sm"
                    />
                  </Link>
                  <p className="text-[0.6rem] md:text-[0.8rem] font-light text-tertiary text-center mt-2">
                    {anime.title}
                  </p>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <p>Chargement...</p>
          )}
        </Swiper>
      </div>
    </div>
  );
}

export default History;
