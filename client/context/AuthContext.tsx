import { createContext, useContext, useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import type { User } from "../context/UserContext";

// Typage des données du context
export type Auth = {
  mail: string;
  password: string;
};

// Typage du context User
type LoginContextType = {
  connected: boolean;
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogin: (auth: Auth) => Promise<void>;
  handleLogOut: () => void;
  loading: boolean; // Ajout de l'état de chargement
};

const AuthContext = createContext<LoginContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const { setUser } = useUserContext();

  // Fonction qui gère la connexion de l'utilisateur
  const handleLogin = async ({ mail, password }: Auth) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mail, password }),
        },
      );

      if (!response.ok) {
        throw new Error("Email ou mot de passe incorrect");
      }

      const data = await response.json();
      // Crée un utilisateur minimal pour le context
      const formattedUser: User = {
        id: data.user.id,
        firstname: data.user.firstname,
        lastname: data.user.lastname,
        mail: data.user.mail,
        password: "",
        abonnement_id: data.user.abonnement_id,
        is_admin: data.user.is_admin ?? false,
        is_actif: data.user.is_actif ?? true,
        token: data.token,
        profil_picture_id: data.user.profil_picture_id ?? 1,
      };

      setUser(formattedUser);
      localStorage.setItem("userConnected", JSON.stringify(formattedUser));
      localStorage.setItem("token", data.token);
      setConnected(true);
      localStorage.setItem("connected", "true"); // Met à jour le statut de connexion dans le localStorage
    } catch (error) {
      console.error("❌ Erreur login :", error);
      setConnected(false);
    }
  };

  const handleLogOut = () => {
    setUser(null);
    setConnected(false);
    localStorage.removeItem("userConnected");
    localStorage.removeItem("token");
    localStorage.setItem("connected", "false");
    window.location.href = "/";
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const storedUser = localStorage.getItem("userConnected"); // je récupère les données utilisateur dans la variable storeUser

    if (storedUser) {
      //si je trouve quelque chose
      try {
        const parsedUser = JSON.parse(storedUser); //je transforme la chaine JSON(format de la donée du local storage) en objet JS utilisable

        if (parsedUser?.id) {
          // je vérifie que cet objet JS détient un ID
          setUser(parsedUser); // je met à jour l'objet récupéré
          setConnected(true); //je déclare l'utilisateur connecté
        } else {
          console.warn("❗ Format utilisateur invalide dans le localStorage"); // alerte pour aider à debug
        }
      } catch (error) {
        console.error("❌ Erreur parsing localStorage :", error); //idem
      }
    }

    setLoading(false); // j'arrête le chargement peu importe s'il y a eu un utilisateur de trouvé ou pas.
  }, []);

  return (
    <AuthContext.Provider
      value={{
        connected,
        setConnected,
        handleLogin,
        handleLogOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Création du hook personnalisé
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext doit être utilisé dans un AuthProvider");
  }
  return context;
};
