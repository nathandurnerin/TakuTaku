import { useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import type { User } from "../../../context/UserContext";
import { useUserContext } from "../../../context/UserContext";
import CreateAccount from "./CreateAccount";
import PaymentPopUp from "./PayementPopUp";

function Abonnement() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const { user } = useUserContext() as { user: User | null };
  const { connected } = useAuthContext() as { connected: boolean };

  const handleSubscribeClick = (plan: string) => {
    setSelectedPlan(plan);
    setIsSignupOpen(true);
  };

  const handleCloseSignup = () => {
    setIsSignupOpen(false);
    setSelectedPlan("");
  };

  return (
    <>
      <section className="flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-20 lg:gap-40 xl:gap-60 xxl:gap-80 max-w-4xl mx-4 md:mx-14 lg:mx-auto text-tertiary">
        {/* Offre Découverte */}
        <section className="border-5 border-secondary p-4 flex flex-col justify-between shadow-lg">
          <section>
            <h3 className="text-lg lg:text-xl mb-8 mt-2 md:mt-4 md:mb-10 lg:mb-16 text-center">
              Offre Découverte
            </h3>
            <section className="ml-4">
              <p className="font-semibold lg:ml-5 lg:mb-4 md:mb-6 mb-8">
                2 mois offert <br />
                puis <span className="text-secondary">10.99€</span> par mois
              </p>
              <ul className="mt-4 md:mb-8 lg:ml-4 space-y-2 text-sm">
                <li>• Accès complet au catalogue</li>
                <li>• Avec publicité</li>
                <li>
                  • Qualité vidéo jusqu’à <strong>720p</strong>
                </li>
                <li>• 1 écran à la fois</li>
              </ul>
            </section>
            <section>
              <p className="mt-16 lg:mt-14 text-sm font-semibold text-tertiary text-center">
                Parfait pour découvrir nos
                <br />
                animés sans engagement !
              </p>
              <section className="flex justify-center mt-6 mb-3 ">
                {user?.abonnement_id === 1 ? (
                  <p className="text-secondary text-lg text-center">
                    Vous bénéficiez déjà
                    <br />
                    de cette offre.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSubscribeClick("Découverte")}
                    className={`mt-4  bg-secondary text-black py-1 px-7 lg:px-15 rounded-full cursor-pointer ${user?.abonnement_id === 1 ? "hidden" : ""}`}
                  >
                    {user?.abonnement_id === 1
                      ? "Vous bénéficiez déjà de cette offre"
                      : "S'abonner"}
                  </button>
                )}
              </section>
            </section>
          </section>
        </section>

        {/* Offre Premium */}
        <section className="border-5 border-secondary p-4 flex flex-col justify-between shadow-lg">
          <section>
            <h3 className="text-lg lg:text-xl mb-8 mt-2 md:mt-4 md:mb-5 lg:mb-10 text-center">
              Offre Premium
              <br />
              “Sans Pub”
            </h3>
            <section className="ml-4 lg:mb-4">
              <p className="font-semibold mb-4 lg:ml-5 lg:mb-4 md:mb-6">
                Prix : <span className="text-secondary">20.99€ </span> par mois
              </p>
              <ul className="mt-8 lg:ml-4 space-y-2 text-sm">
                <li>• Accès complet au catalogue</li>
                <li>
                  • <span className="text-secondary">Sans publicité</span>
                </li>
                <li>
                  • Qualité vidéo jusqu’à{" "}
                  <span className="text-secondary">1080p</span>
                </li>
                <li>
                  • <span className="text-secondary">2</span> écrans à la fois
                </li>
                <li>
                  •{" "}
                  <span className="font-semibold text-secondary">
                    Téléchargement hors ligne
                  </span>
                </li>
              </ul>
            </section>
            <section>
              <p className="mt-9 md:mt-12 lg:mt-8 text-sm font-semibold text-tertiary text-center">
                Pour les vrais fans qui veulent
                <br />
                profiter sans interruption !
              </p>
              <section className="flex justify-center mt-6 mb-3">
                {user?.abonnement_id === 2 ? (
                  <p className="text-secondary text-lg text-center">
                    Vous bénéficiez déjà
                    <br />
                    de cette offre.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSubscribeClick("Premium")}
                    className={`mt-4 cursor-pointer bg-secondary text-primary py-1 px-7 lg:px-15 rounded-full ${user?.abonnement_id === 2 ? "hidden" : ""}`}
                  >
                    S'abonner
                  </button>
                )}
              </section>
            </section>
          </section>
        </section>
      </section>

      {/* Affichage conditionnel du bon popup */}
      {isSignupOpen && connected ? (
        <PaymentPopUp
          newaccount={{ firstname: "", lastname: "", mail: "", password: "" }}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          setShowPayment={() => setIsSignupOpen(false)}
          email={user?.mail ?? ""}
          onClose={handleCloseSignup}
        />
      ) : isSignupOpen ? (
        <CreateAccount
          isOpen={true}
          onClose={handleCloseSignup}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
        />
      ) : null}
    </>
  );
}

export default Abonnement;
