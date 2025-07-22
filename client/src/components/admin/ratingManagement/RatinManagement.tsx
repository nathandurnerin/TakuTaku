import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { IoChevronUp } from "react-icons/io5";

type Note = {
  id: number;
  note: number;
  title: string;
};

function RatingManagement() {
  const [animes, setAnimes] = useState<Note[]>([]);
  const [liste, setListe] = useState(false);

  const fetchAnimes = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/anime_with_note`)
      .then((res) => res.json())
      .then((data) => setAnimes(data));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchAnimes();
  }, []);

  return (
    <>
      <h1 className="text-[var(--color-secondary)] pl-10 text-xl pt-20">
        Gestion des notes
      </h1>
      <div className="pl-10 pt-4">
        {/* Bouton voir/masquer les notes */}
        <button
          type="button"
          className="bg-[var(--color-secondary)] text-primary font-semibold py-1 px-2 rounded-full flex items-center gap-1 cursor-pointer"
          onClick={() => setListe(!liste)}
        >
          {liste ? (
            <>
              Masquer les notes <IoChevronUp />
            </>
          ) : (
            <>
              Voir les notes <IoChevronDown />
            </>
          )}
        </button>
      </div>
      {liste && (
        <div className="overflow-x-auto px-10 pt-6">
          {/* En-têtes */}
          <div className="grid grid-cols-[1fr_1fr] text-yellow-400 font-bold text-sm min-w-[700px]">
            <div>Titre</div>
            <div>Note</div>
          </div>

          {/* Données triées */}
          {[...animes]
            .sort((b, a) => a.note - b.note)
            .map((anime) => {
              const noteMax = 5;
              const width = (anime.note / noteMax) * 100;

              return (
                <div
                  key={anime.id}
                  className="grid grid-cols-[1fr_1fr] py-2 text-sm text-tertiary min-w-[700px] items-center"
                >
                  <div>{anime.title}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-300 h-2 rounded">
                      <div
                        className="bg-yellow-400 h-2 rounded"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="w-10 text-right">{anime.note}</span>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}

export default RatingManagement;
