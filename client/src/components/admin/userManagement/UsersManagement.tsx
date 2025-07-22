import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { IoChevronUp } from "react-icons/io5";
import { toast } from "react-toastify";
import { useUserContext } from "../../../../context/UserContext";

type User = {
  id?: number;
  firstname: string;
  lastname: string;
  mail: string;
  password: string;
  is_admin: boolean;
  is_actif: boolean;
  abonnement_id: number;
  abonnement_name?: string;
  profil_picture_id: number;
  token: string;
};

function UserManagement() {
  // État pour stocker la liste des utilisateurs
  const [users, setUsers] = useState<User[]>([]);
  // État pour afficher/masquer la liste
  const [liste, setListe] = useState(false);
  // État pour afficher/masquer la pop-up de création
  const [open, setOpen] = useState(false);
  // État pour l'utilisateur en cours de modification
  const [editUser, setEditUser] = useState<User | null>(null);
  // Méthodes depuis le contexte utilisateur
  const { deleteUser, updateUser, createUser } = useUserContext();
  // État pour stocker un nouvel utilisateur à créer
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    firstname: "",
    lastname: "",
    mail: "",
    password: "",
    is_admin: false,
    is_actif: true,
    abonnement_id: 1,
    profil_picture_id: 1, // Valeur par défaut pour l'image de profil
    token: "",
  });

  // Fetch qui récupère tous les utilisateurs avec leurs abonnements
  const fetchUsers = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/user_with_abonnement`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchUsers();
  }, []);

  // Pour supp un user
  const handleDeleteUser = (id: number) => {
    deleteUser(id)
      .then(() => {
        fetchUsers();
        toast.success("Suppression de l'utilisateur réussie");
      })
      .catch((err) => {
        console.error("Erreur lors de la suppression de l'utilisateur :", err);
        toast.error("Suppression de l'utilisateur échouée");
      });
  };

  // Pour ajouter un user
  const handleCreateUser = (user: Omit<User, "id">) => {
    createUser(user)
      .then(() => {
        fetchUsers();
        toast.success("Création de l'utilisateur réussie");
      })
      .catch((err) => {
        console.error("Erreur lors de la création de l'utilisateur :", err);
        toast.error("Création de l'utilisateur échouée");
      });
  };

  return (
    <>
      <h1 className="text-[var(--color-secondary)] pt-6 pl-10 text-xl">
        Gestion des utilisateurs
      </h1>
      <p className="text-tertiary pt-4 pl-10">
        {/* Affichage du nombre de compte créé */}
        Nombre total de comptes : {users.length}
      </p>
      <div className="pl-10 pt-4">
        {/* Bouton voir/masquer les users */}
        <button
          type="button"
          className="bg-[var(--color-secondary)] text-primary font-semibold py-1 px-2 rounded-full flex items-center gap-1 cursor-pointer"
          onClick={() => setListe(!liste)}
        >
          {liste ? (
            <>
              Masquer les utilisateurs <IoChevronUp />
            </>
          ) : (
            <>
              Voir les utilisateurs <IoChevronDown />
            </>
          )}
        </button>
      </div>
      {liste && (
        <>
          {/* Liste des utilisateurs */}
          <div className="overflow-x-auto px-10 pt-6">
            {/* En-têtes */}
            <div className="grid grid-cols-[2fr_3fr_1fr_1fr_1fr_1fr] text-yellow-400 font-bold text-sm min-w-[900px]">
              <div>Utilisateur</div>
              <div>E-mail</div>
              <div>Abonnement</div>
              <div>Admin ?</div>
              <div>Modifier</div>
              <div>Supprimer</div>
            </div>

            {/* Données */}
            {users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-[2fr_3fr_1fr_1fr_1fr_1fr] py-1 text-sm text-tertiary min-w-[900px] items-center"
              >
                <div>
                  {user.firstname} {user.lastname}
                </div>
                <div className="break-all">{user.mail}</div>
                <div>{user.abonnement_name}</div>
                <div>{user.is_admin}</div>
                <div>
                  {/* Bouton "change" relié à la fonction modification */}
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => setEditUser(user)}
                  >
                    <img
                      src="./public/change.png"
                      alt="modifier"
                      className="w-4"
                    />
                  </button>
                </div>
                <div>
                  {/* Bouton poubelle relié à la fonction delete */}
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => {
                      if (user.id !== undefined) {
                        handleDeleteUser(user.id);
                      }
                    }}
                  >
                    <img
                      src="./public/trash.png"
                      alt="supprimer"
                      className="w-4"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Bouton d'ajout d'utilisateur */}
          <div className="pl-10 pt-4">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="bg-[var(--color-secondary)] text-primary font-semibold py-1 px-2 rounded-full cursor-pointer"
            >
              + Nouvel utilisateur
            </button>
          </div>
        </>
      )}

      {/* Pop-Up pour la modification des users */}
      {editUser && (
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
            <h2 className="text-2xl text-center mb-6">
              Modifier un utilisateur
            </h2>
            {/* Formulaire */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editUser && editUser.id !== undefined) {
                  updateUser(editUser.id, editUser)
                    .then(() => {
                      fetchUsers();
                      setEditUser(null);
                      toast.success("Modification de l'utilisateur réussie");
                    })
                    .catch((err) => {
                      console.error("Erreur lors de la modif :", err);
                      toast.error("Modification de l'utilisateur échouée");
                    });
                }
              }}
            >
              {/* Nom / Prénom */}
              <section className="flex gap-4">
                <input
                  type="text"
                  value={editUser.firstname}
                  name="Prénom"
                  placeholder="Prénom"
                  required
                  onChange={(e) =>
                    setEditUser({ ...editUser, firstname: e.target.value })
                  }
                  className="w-1/2 border border-tertiary/30 bg-primary px-4 py-2 mb-3 text-tertiary rounded-md placeholder-tertiary focus:outline-none text-sm"
                />
                <input
                  type="text"
                  value={editUser.lastname}
                  name="Nom"
                  placeholder="Nom"
                  required
                  onChange={(e) =>
                    setEditUser({ ...editUser, lastname: e.target.value })
                  }
                  className="w-1/2 border border-tertiary/30 bg-primary px-4 py-2 mb-3 text-tertiary rounded-md placeholder-tertiary focus:outline-none text-sm"
                />
              </section>

              {/* Email */}
              <input
                type="email"
                value={editUser.mail}
                name="email"
                placeholder="E-mail"
                required
                onChange={(e) =>
                  setEditUser({ ...editUser, mail: e.target.value })
                }
                className="w-full border border-tertiary/30 bg-primary px-4 py-2 mb-3 text-tertiary rounded-md placeholder-tertiary focus:outline-none text-sm"
              />

              {/* Abonnement ? */}
              <select
                name="abonnement"
                value={editUser.abonnement_id}
                required
                onChange={(e) =>
                  setEditUser({
                    ...editUser,
                    abonnement_id: Number(e.target.value),
                  })
                }
                className="w-full border border-tertiary/30 bg-primary px-4 py-2 mb-3 text-tertiary rounded-md placeholder-tertiary focus:outline-none text-sm cursor-pointer"
              >
                <option value="">-- Choisir un abonnement --</option>
                <option value="2">Premium</option>
                <option value="1">Découverte</option>
              </select>

              {/* Admin ? */}
              <select
                name="admin"
                value={editUser.is_admin ? "1" : "0"}
                required
                onChange={(e) =>
                  setEditUser({ ...editUser, is_admin: e.target.value === "1" })
                }
                className="w-full border border-tertiary/30 bg-primary px-4 py-2 mb-3 text-tertiary rounded-md placeholder-tertiary focus:outline-none text-sm cursor-pointer"
              >
                <option value="">-- Admin ? --</option>
                <option value="1">Oui</option>
                <option value="0">Non</option>
              </select>

              {/* Actif ? */}
              <select
                name="actif"
                value={editUser.is_actif ? "1" : "0"}
                required
                onChange={(e) =>
                  setEditUser({ ...editUser, is_actif: e.target.value === "1" })
                }
                className="w-full border border-tertiary/30 bg-primary px-4 py-2 mb-3 text-tertiary rounded-md placeholder-tertiary focus:outline-none text-sm cursor-pointer"
              >
                <option value="">-- Actif ? --</option>
                <option value="1">Oui</option>
                <option value="0">Non</option>
              </select>

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
              onClick={() => setEditUser(null)}
              className="absolute top-2 right-3 text-tertiary text-xl font-bold cursor-pointer"
            >
              &times;
            </button>
          </section>
        </section>
      )}

      {/* Pop-Up d'ajout utilisateur*/}
      {open && (
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
            <h2 className="text-2xl text-center mb-6">
              Ajouter un utilisateur
            </h2>

            {/* Nom / Prénom */}
            <section className="flex gap-4">
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                required
                value={newUser.lastname}
                onChange={(e) =>
                  setNewUser({ ...newUser, lastname: e.target.value })
                }
                className="w-1/2 bg-primary border border-tertiary/30 px-4 py-2 placeholder-tertiary rounded-md focus:outline-none mb-3 text-sm"
              />
              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                required
                value={newUser.firstname}
                onChange={(e) =>
                  setNewUser({ ...newUser, firstname: e.target.value })
                }
                className="w-1/2 bg-primary border border-tertiary/30 px-4 py-2 placeholder-tertiary rounded-md focus:outline-none mb-3 text-sm"
              />
            </section>

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              required
              value={newUser.mail}
              onChange={(e) => setNewUser({ ...newUser, mail: e.target.value })}
              className="w-full bg-primary border border-tertiary/30 px-4 py-2 placeholder-tertiary rounded-md focus:outline-none mb-3 text-sm"
            />

            {/* Mot de passe */}
            <input
              type="password"
              name="mot de passe"
              placeholder="Mot de passe"
              required
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="w-full bg-primary border border-tertiary/30 px-4 py-2 placeholder-tertiary rounded-md focus:outline-none mb-3 text-sm"
            />

            {/* Admin ? */}
            <select
              name="admin"
              required
              value={newUser.is_admin ? "1" : "0"}
              onChange={(e) =>
                setNewUser({ ...newUser, is_admin: e.target.value === "1" })
              }
              className="w-full bg-primary border border-tertiary/30 px-4 py-2 placeholder-tertiary rounded-md focus:outline-none mb-3 text-sm"
            >
              <option value="">-- Admin ? --</option>
              <option value="1">Oui</option>
              <option value="0">Non</option>
            </select>

            {/* Abonnement ? */}
            <select
              name="abonnement"
              required
              value={newUser.abonnement_id}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  abonnement_id: Number(e.target.value),
                })
              }
              className="w-full bg-primary border border-tertiary/30 px-4 py-2 placeholder-tertiary rounded-md focus:outline-none mb-3 text-sm"
            >
              <option value="">-- Choisir un abonnement --</option>
              <option value="1">Découverte</option>
              <option value="2">Premium</option>
            </select>

            {/* Actif ? */}
            <select
              name="actif"
              required
              value={newUser.is_actif ? "1" : "0"}
              onChange={(e) =>
                setNewUser({ ...newUser, is_actif: e.target.value === "1" })
              }
              className="w-full bg-primary border border-tertiary/30 px-4 py-2 placeholder-tertiary rounded-md focus:outline-none mb-3 text-sm"
            >
              <option value="">-- Actif ? --</option>
              <option value="1">Oui</option>
              <option value="0">Non</option>
            </select>

            {/* Mascotte + Bouton envoyer */}
            <section className="flex justify-between items-end mt-4">
              <img src="/favicon.ico" alt="Mascotte" className="h-15" />
              <button
                type="button"
                onClick={() => {
                  handleCreateUser(newUser);
                  setNewUser({
                    firstname: "",
                    lastname: "",
                    mail: "",
                    password: "",
                    is_admin: false,
                    is_actif: true,
                    abonnement_id: 2,
                    profil_picture_id: 1, // Reset to default value
                    token: "",
                  });
                  setOpen(false);
                  setOpen(false);
                }}
                className="text-secondary font-bold text-lg hover:text-secondary pb-10 cursor-pointer"
              >
                Ajouter
              </button>
            </section>

            {/* Bouton fermer */}
            <button
              type="button"
              onClick={() => setOpen(false)}
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

export default UserManagement;
