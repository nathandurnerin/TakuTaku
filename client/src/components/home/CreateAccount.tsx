import { useState } from "react";
import { toast } from "react-toastify";
import PaymentPopUp from "./PayementPopUp";

interface CreateAccountProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
}

function CreateAccount({
  isOpen,
  onClose,
  selectedPlan,
  setSelectedPlan,
}: CreateAccountProps) {
  const [newaccount, setNewAccount] = useState({
    firstname: "",
    lastname: "",
    mail: "",
    password: "",
  });

  const [showPayment, setShowPayment] = useState(false);

  if (!isOpen && !showPayment) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAccount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowPayment(true); // affiche le paiement intégré
  };

  const closeAll = () => {
    setShowPayment(false);
    setNewAccount({ firstname: "", lastname: "", mail: "", password: "" });
    onClose();
  };

  return (
    <>
      {showPayment ? (
        <PaymentPopUp
          newaccount={newaccount}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          setShowPayment={setShowPayment}
          email={newaccount.mail}
          onClose={closeAll}
        />
      ) : (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-primary bg-opacity-70 px-4">
          <section className="relative bg-quadrary mt-25 text-tertiary rounded-lg w-full max-w-lg p-8">
            {/* Logo */}
            <section className="text-center mb-10">
              <img
                src="/logo_taku.png"
                alt="Logo TakuTaku"
                className="mx-auto h-15"
              />
            </section>

            <h2 className="text-2xl text-center mb-6">Création de compte</h2>
            {/* Formulaire de création de compte */}
            <form
              className="flex flex-col space-y-5 text-sm"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="lastname"
                placeholder="Nom"
                value={newaccount.lastname}
                onChange={handleChange}
                required
                className="bg-primary border border-tertiary/30 px-4 py-2 placeholder-tertiary rounded-md focus:outline-none"
              />
              <input
                type="text"
                name="firstname"
                placeholder="Prénom"
                value={newaccount.firstname}
                onChange={handleChange}
                required
                className="bg-primary border border-tertiary/30 px-4 py-2 placeholder-tertiary rounded-md focus:outline-none"
              />
              <input
                type="email"
                name="mail"
                placeholder="Adresse e-mail"
                value={newaccount.mail}
                onChange={handleChange}
                required
                className="bg-primary border border-tertiary/30 px-4 py-2 placeholder-tertiary rounded-md focus:outline-none"
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={newaccount.password}
                onChange={handleChange}
                required
                className="bg-primary border border-tertiary/30 px-4 py-2 placeholder-tertiary rounded-md focus:outline-none"
              />

              {/* Choix d'abonnement */}
              <section className="mt-2 mr-2">
                <p className=" mb-1">Abonnement</p>
                <section className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="plan"
                      value="Découverte"
                      checked={selectedPlan === "Découverte"}
                      onChange={() => setSelectedPlan("Découverte")}
                      className="mr-2 accent-secondary"
                    />
                    Découverte
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="plan"
                      value="Premium"
                      checked={selectedPlan === "Premium"}
                      onChange={() => setSelectedPlan("Premium")}
                      className="mr-2 accent-secondary"
                    />
                    Premium
                  </label>
                </section>
              </section>

              <button
                type="submit"
                className="border border-tertiary/30 text-primary bg-secondary my-10 py-2 rounded-md w-full font-semibold mb-6 cursor-pointer"
              >
                Procéder au paiement
              </button>
            </form>

            {/* Mascotte */}
            <section className="flex justify-between items-end mt-4">
              <img src="/favicon.ico" alt="Mascotte" className="h-15" />
            </section>
            {/* Bouton fermer */}
            <button
              type="button"
              onClick={() => {
                onClose();
                toast.error("Echec lors de la création du compte.");
              }}
              className="absolute top-2 right-4 text-gray-400 text-xl hover:text-tertiary"
            >
              &times;
            </button>
          </section>
        </section>
      )}
    </>
  );
}

export default CreateAccount;
