import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { IoChevronUp } from "react-icons/io5";
import { toast } from "react-toastify";
import { useAnimeContext } from "../../../../context/AnimeContext";

type Anime = {
  id: number;
  title: string;
  synopsis: string;
  portrait: string;
  paysage: string;
  video: string;
  genre_name: number;
  date: string;
};

function AnimeManagement() {
  // État pour stocker la liste des animes
  const [animes, setAnimes] = useState<Anime[]>([]);
  // État pour afficher/masquer la liste
  const [liste, setListe] = useState(false);
  // État pour l'anime en cours de modification
  const [editAnime, setEditAnime] = useState<Anime | null>(null);
  // Méthodes depuis le contexte anime
  const { updateAnime } = useAnimeContext();

  // Fetch qui récupère tous les animés avec le genre
  const fetchAnimes = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/anime_with_genre`)
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
        Gestion des animés
      </h1>
      <p className="text-tertiary pt-4 pl-10">
        {/* Affichage du nombre de d'animé créé */}
        Nombre total d'animés : {animes.length}
      </p>
      <div className="pl-10 pt-4">
        {/* Bouton voir/masquer les animés */}
        <button
          type="button"
          className="bg-[var(--color-secondary)] text-primary font-semibold py-1 px-2 rounded-full flex items-center gap-1 cursor-pointer"
          onClick={() => setListe(!liste)}
        >
          {liste ? (
            <>
              Masquer les animés <IoChevronUp />
            </>
          ) : (
            <>
              Voir les animés <IoChevronDown />
            </>
          )}
        </button>
      </div>
      {liste && (
        <div className="overflow-x-auto px-10 pt-6">
          {/* En-têtes */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] text-yellow-400 font-bold text-sm min-w-[900px]">
            <div>Titre</div>
            <div>Genre</div>
            <div>Année</div>
            <div>Modifier</div>
          </div>

          {/* Données */}
          {animes.map((anime) => (
            <div
              key={anime.id}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] py-1 text-sm text-tertiary min-w-[900px] items-center"
            >
              <div>{anime.title}</div>
              <div>{anime.genre_name}</div>
              <div>{anime.date}</div>
              <div>
                {/* Bouton "change" relié à la fonction modification */}
                <button type="button" onClick={() => setEditAnime(anime)}>
                  <img
                    src="./public/change.png"
                    alt="modifier"
                    className="w-4 cursor-pointer"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pop-Up pour la modification des animés */}
      {editAnime && (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-primary bg-opacity-70 px-4">
          <section className="relative bg-quadrary text-tertiary rounded-lg w-full max-w-lg p-8">
            {/* Logo TakuTaku */}
            <section className="text-center mb-10">
              <img
                src="/public/logo_taku.png"
                alt="Logo TakuTaku"
                className="mx-auto h-15"
              />
            </section>

            {/* Titre */}
            <h2 className="text-2xl text-center mb-6">Modifier un animé</h2>
            {/* Formulaire */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editAnime && editAnime.id !== undefined) {
                  updateAnime(editAnime.id, editAnime)
                    .then(() => {
                      fetchAnimes(); // Recharge la liste
                      setEditAnime(null); // Ferme la pop-up
                      toast.success("Modification de l'animé réussie");
                    })
                    .catch((err) => {
                      console.error("Erreur lors de la modification :", err);
                      toast.error("Modification de l'animé échouée");
                    });
                }
              }}
            >
              {/* Titre */}
              <section className="flex gap-4">
                <input
                  type="text"
                  value={editAnime.title}
                  name="titre"
                  placeholder="Titre"
                  required
                  onChange={(e) =>
                    setEditAnime({ ...editAnime, title: e.target.value })
                  }
                  className="w-1/2 border border-tertiary/30 bg-primary px-4 py-2 mb-3 text-tertiary rounded-md placeholder-tertiary focus:outline-none"
                />
              </section>

              {/* Synopsis */}
              <textarea
                value={editAnime.synopsis}
                name="synopsis"
                placeholder="Synopsis"
                required
                rows={6}
                onChange={(e) =>
                  setEditAnime({ ...editAnime, synopsis: e.target.value })
                }
                className="w-full h-32 border border-tertiary/30 bg-primary px-4 py-2 mb-3 text-tertiary rounded-md placeholder-tertiary focus:outline-none text-sm"
              />

              {/* Genre */}
              <select
                name="genre"
                value={editAnime.genre_name}
                required
                onChange={(e) =>
                  setEditAnime({
                    ...editAnime,
                    genre_name: Number(e.target.value),
                  })
                }
                className="w-full border border-tertiary/30 bg-primary px-4 py-2 mb-3 text-tertiary rounded-md placeholder-tertiary focus:outline-none text-sm"
              >
                <option value="">-- Choisir un genre --</option>
                <option value="3">Seinen</option>
                <option value="2">Shojo</option>
                <option value="1">Shonen</option>
              </select>

              {/* Année */}
              <section className="flex gap-4">
                <input
                  type="number"
                  min="1900"
                  max="2100"
                  value={editAnime.date}
                  name="date"
                  placeholder="Année"
                  required
                  onChange={(e) =>
                    setEditAnime({ ...editAnime, date: e.target.value })
                  }
                  className="w-1/2 border border-tertiary/30 bg-primary px-4 py-2 mb-3 text-tertiary rounded-md placeholder-tertiary focus:outline-none text-sm"
                />
              </section>

              {/* Mascotte + Bouton envoyer */}
              <section className="flex justify-between items-end mt-4">
                <img src="/favicon.ico" alt="Mascotte" className="h-15" />
                <button
                  type="submit"
                  className="text-secondary font-bold text-lg hover:text-secondary pb-10 cursor-pointer"
                >
                  Modifier
                </button>
              </section>
            </form>

            {/* Bouton fermer */}
            <button
              type="button"
              onClick={() => setEditAnime(null)}
              className="absolute top-2 right-3 text-tertiary text-xl font-bold cursor-pointer"
            >
              &times;
            </button>
          </section>
        </section>
      )}
    </>
  );
}

export default AnimeManagement;
