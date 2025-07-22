import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import CreateAccount from "../components/home/CreateAccount";

function LogIn() {
  const [mail, setMail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const navigate = useNavigate();

  const { handleLogin } = useAuthContext();

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await handleLogin({ mail, password });
      navigate("/"); // redirection ici
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

  const handleCloseSignup = () => {
    setIsSignupOpen(false);
    setSelectedPlan("");
  };

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-primary bg-opacity-70 px-4">
      <section className="relative md:mt-0 bg-quadrary text-tertiary rounded-lg w-full max-w-lg p-8">
        <section className="text-center mb-10">
          <img
            src="/logo_taku.png"
            alt="Logo TakuTaku"
            className="mx-auto h-15"
          />
        </section>
        <h1 className="text-center text-2xl mb-10">Connexion</h1>

        <form onSubmit={handleClick}>
          <input
            type="email"
            value={mail}
            placeholder="Adresse e-mail"
            required
            onChange={(e) => setMail(e.target.value)}
            className="border border-tertiary/30 bg-primary px-4 py-2 mb-6 text-tertiary rounded-md placeholder-tertiary focus:outline-none w-full"
          />

          <input
            type="password"
            value={password}
            placeholder="Mot de passe"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="border border-tertiary/30 bg-primary px-4 py-2 mb-6 text-tertiary rounded-md placeholder-tertiary focus:outline-none w-full"
          />

          <button
            type="submit"
            className="border border-tertiary/30 text-primary bg-secondary my-10 py-2 rounded-md w-full font-semibold mb-6 cursor-pointer"
          >
            Se connecter
          </button>
        </form>

        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => setIsSignupOpen(true)}
            className="text-primary font-semibold border border-tertiary/30 bg-tertiary my-5 cursor-pointer px-4 py-2 rounded-md"
          >
            Créer un compte
          </button>
        </div>

        <div className="flex justify-between items-end">
          <img src="/favicon.ico" alt="Mascotte" className="h-15" />
        </div>

        {/* Bouton fermer */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute top-2 right-4 text-gray-400 text-xl hover:text-tertiary"
        >
          &times;
        </button>

        {isSignupOpen && (
          <CreateAccount
            isOpen={isSignupOpen}
            onClose={handleCloseSignup}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
          />
        )}
      </section>
    </section>
  );
}

export default LogIn;
