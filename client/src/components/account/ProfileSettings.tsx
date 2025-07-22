import { useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";
import { toast } from "react-toastify";
import { useUserContext } from "../../../context/UserContext";
import type { User } from "../../../context/UserContext";

function ProfileSettings() {
  const { user, updateUser } = useUserContext();
  const [editMode, setEditMode] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setEditUser(user);
    }
  }, [user]);

  const handleChangeUser = async (id: number, user: User) => {
    try {
      await updateUser(id, user);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        },
      );
      const data = await res.json();
      setEditUser(data);
      setEditMode(false);
      toast.success("Modification enregistrée avec succès");
    } catch (err) {
      toast.error("Modification échouée");
    }
  };

  return (
    <>
      <section className="flex items-center text-tertiary my-4 mx-6 ">
        <FaCog />
        <h2 className="text-xl ml-2">Paramètres du compte</h2>
      </section>

      <section className="text-tertiary mx-6 my-4 flex flex-col gap-2">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (editUser && editUser.id !== undefined) {
              handleChangeUser(editUser.id, editUser);
            }
          }}
          method="PUT"
        >
          <label htmlFor="lastname">
            Nom : {""}
            <input
              id="lastname"
              name="lastname"
              className="uppercase"
              value={editUser?.lastname}
              onChange={(e) => {
                if (editUser) {
                  setEditUser({ ...editUser, lastname: e.target.value });
                }
              }}
              disabled={!editMode}
            />
          </label>

          <label htmlFor="firstname">
            Prénom : {""}
            <input
              id="firstname"
              name="firstname"
              value={editUser?.firstname}
              onChange={(e) => {
                if (editUser) {
                  setEditUser({ ...editUser, firstname: e.target.value });
                }
              }}
              disabled={!editMode}
            />
          </label>

          <label htmlFor="email">
            Adresse email : {""}
            <input
              id="email"
              name="mail"
              type="email"
              value={editUser?.mail}
              onChange={(e) => {
                if (editUser) {
                  setEditUser({ ...editUser, mail: e.target.value });
                }
              }}
              disabled={!editMode}
            />
          </label>

          <div className="flex items-center">
            <label htmlFor="subscription">Abonnement : {""}</label>
            <p className="bg-black text-tertiary px-4 py-2 text-sm">
              {editUser?.abonnement_id === 2
                ? "Premium"
                : editUser?.abonnement_id === 1
                  ? "Découverte"
                  : "Aucun abonnement actif"}
            </p>
          </div>

          {!editMode && (
            <button
              type="button"
              className="rounded-full text-primary bg-secondary my-2 p-3 cursor-pointer"
              onClick={() => setEditMode(true)}
            >
              Modifier mes informations personnelles
            </button>
          )}

          {editMode && (
            <button
              type="submit"
              className="border border-tertiary rounded-full text-secondary my-2 p-2 cursor-pointer"
            >
              Enregistrer
            </button>
          )}
        </form>
      </section>
    </>
  );
}

export default ProfileSettings;
