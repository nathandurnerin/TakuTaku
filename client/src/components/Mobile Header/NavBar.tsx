import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { useUserContext } from "../../../context/UserContext";
import BurgerProfil from "../UserMenu/BurgerProfil";
import BurgerButton from "./BurgerButton";

function NavBar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const toggleMenu = () => setIsNavOpen((prev) => !prev);
  const { connected } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [urlPicture, setUrlPicture] = useState("");

  // Pour l'affichage de la picture selon le user
  useEffect(() => {
    const getUrlPicture = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/readUrlPicture/${user?.id}`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          },
        );
        const urlPicture = await response.json();
        const url = urlPicture.profil_picture;
        setUrlPicture(url);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'URL de la photo de profil",
          error,
        );
        setUrlPicture("");
      }
    };
    if (user) {
      getUrlPicture();
    }
  }, [user]);

  const isHomePage = location.pathname === "/";
  const isGenrePage = location.pathname === "/genre";
  const isFavoritePage = location.pathname === "/favorite";

  const handleClick = () => {
    const storedUser = localStorage.getItem("userConnected");
    if (!storedUser) {
      navigate("/login");
    } else {
      setIsBurgerOpen((prev) => !prev);
    }
  };

  const handleCloseBurger = () => {
    setIsBurgerOpen(false);
  };

  return (
    <>
      <section className="fixed z-70 w-full bg-primary text-tertiary">
        <section className="flex items-center justify-between px-2 py-4">
          <BurgerButton toggleMenu={toggleMenu} isOpen={isNavOpen} />
          <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
            <Link to="/">
              <img
                src="/logo_taku.png"
                className="h-12 object-cover"
                alt="Logo Taku Taku"
              />
            </Link>
          </div>
          <div className="flex items-center">
            <button type="button" className="p-1 z-10" onClick={handleClick}>
              <img
                src={!connected ? "/avatar.svg" : urlPicture}
                alt="Profile Pic"
                className="rounded-full w-10 h-10 cursor-pointer"
              />
            </button>
          </div>
        </section>

        <nav
          className={`fixed left-0 h-screen pt-5 w-40 z-40
       text-tertiary
        transform transition-transform duration-300 border-r border-secondary bg-primary inset-0
        ${isNavOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <ul className="mt-11 px-4">
            <Link to="/" onClick={() => setIsNavOpen(false)}>
              <li className={`pt-4  ${isHomePage ? "text-secondary" : ""}`}>
                ACCUEIL
              </li>
            </Link>
            <Link to="/genre" onClick={() => setIsNavOpen(false)}>
              <li className={`pt-4 ${isGenrePage ? "text-secondary" : ""}`}>
                GENRES
              </li>
            </Link>
            <Link to="/favorite" onClick={() => setIsNavOpen(false)}>
              <li className={`pt-4 ${isFavoritePage ? "text-secondary" : ""}`}>
                FAVORIS
              </li>
            </Link>
          </ul>
        </nav>
        <BurgerProfil isOpen={isBurgerOpen} onClose={handleCloseBurger} />
      </section>
    </>
  );
}

export default NavBar;
