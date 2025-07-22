import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAnimeContext } from "../../context/AnimeContext";
import Note from "../components/Note/Note";
import WatchButton from "../components/home/WatchButton";

function Anime() {
  const { id } = useParams();
  const { animeSelected, setAnimeSelected, getAnimebyId } = useAnimeContext();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (id) {
      getAnimebyId(Number(id)).then((data) => {
        if (data) {
          setAnimeSelected(data);
        }
      });
    }
  }, [id]);

  if (!animeSelected) {
    return (
      <div className="text-tertiary text-center mt-10">
        <p>Aucun anime sélectionné.</p>
      </div>
    );
  }

  return (
    <>
      {/* Affichage mobile et tablette */}
      <section className="lg:hidden text-tertiary mt-20 md:mt-0">
        <div className="flex flex-col justify-center items-center gap-2">
          <img
            src={animeSelected.paysage}
            alt={animeSelected.title}
            className="w-full object-cover lg:h-[350px] xl:h-[450px]"
          />
          <p className="text-sm font-semibold mt-2">
            {animeSelected.genre?.name}
          </p>
          <h1 className="text-2xl uppercase text-center mx-8 ">
            {animeSelected.title}
          </h1>
          <p className="text-sm">Année de sortie : {animeSelected.date}</p>
        </div>

        <ul className="flex mx-8 my-5 gap-5 justify-center">
          {animeSelected.types?.map((type) => (
            <li key={type.id} className="border-1 rounded-full px-2 py-1">
              {type.name}
            </li>
          ))}
        </ul>

        <div className="flex justify-center items-center">
          <Note />
        </div>
        <div className="flex flex-col items-center mx-8 my-5 md:mx-20 text-sm text-justify leading-relaxed">
          <p className="mb-4">{animeSelected.synopsis}</p>

          <WatchButton anime={animeSelected} />
        </div>
      </section>

      {/* Affichage desktop */}
      <section className="hidden lg:block text-tertiary">
        <section className="relative flex flex-col justify-center items-center gap-2">
          <img
            src={animeSelected.paysage}
            alt={animeSelected.title}
            className="w-full object-cover lg:h-[250px] xl:h-[350px] blur-[1px]"
          />

          {/* Calque dégradé noir à gauche */}
          <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-black to-transparent" />

          <div className="absolute left-20 xl:left-30 flex flex-col gap-2">
            <p className="font-bold">{animeSelected.genre?.name}</p>
            <h1 className="text-4xl uppercase">{animeSelected.title}</h1>
            <p className="text-sm">Année de sortie : {animeSelected.date}</p>
          </div>
        </section>

        <section className="flex my-8 mx-20 xl:mx-40 2xl:mx-60 gap-8">
          <img
            src={animeSelected.portrait}
            alt={animeSelected.title}
            className="w-[190px] object-cover border-1 border-tertiary"
          />
          <div className="flex flex-col justify-between">
            <div className="">
              <p className="mb-4 text-sm leading-relaxed text-justify">
                {animeSelected.synopsis}
              </p>
              <ul className="flex gap-5">
                {animeSelected.types?.map((type) => (
                  <li key={type.id} className="border-1 rounded-full px-2 py-1">
                    {type.name}
                  </li>
                ))}
              </ul>
            </div>
            <WatchButton anime={animeSelected} />
          </div>
          <div>
            <Note />
          </div>
        </section>
      </section>
    </>
  );
}

export default Anime;
