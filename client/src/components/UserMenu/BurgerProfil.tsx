import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LogOutButton from "../account/LogOutButton";

function BurgerProfil({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const location = useLocation();
  const isAccountPage = location.pathname === "/account";
  const isHistoryPage = location.pathname === "/history";
  const isAdminPage = location.pathname === "/admin";
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("userConnected");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser?.id && parsedUser.is_admin === true) {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("User is not Admin", err);
      }
    }
  });

  return (
    <nav
      className={`
        fixed top-0 right-0 h-full w-40 z-40
        bg-[var(--color-primary)] text-tertiary
        transform transition-transform duration-300 border-l border-secondary
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-2xl text-tertiary cursor-pointer"
      >
        <span className="absolute  h-0.5 w-8 bg-tertiary rotate-45 top-4 right-0" />
        <span className="absolute  h-0.5 w-8 bg-tertiary -rotate-45 top-4 right-0" />
      </button>

      <ul className="mt-10 px-4 text-right">
        <Link to="/account" onClick={onClose}>
          <li
            className={`mt-20  ${isAccountPage ? "text-secondary" : "hover:text-secondary"}`}
          >
            MON COMPTE
          </li>
        </Link>
        <Link to="/history" onClick={onClose}>
          <li
            className={`pt-4  ${isHistoryPage ? "text-secondary" : "hover:text-secondary"}`}
          >
            HISTORIQUE
          </li>
        </Link>
        {isAdmin && (
          <Link to="/admin" onClick={onClose}>
            <li
              className={`pt-4  ${isAdminPage ? "text-secondary" : "hover:text-secondary"}`}
            >
              ADMIN
            </li>
          </Link>
        )}
        <li className="pt-4 hover:text-secondary">
          <LogOutButton />
        </li>
      </ul>
    </nav>
  );
}

export default BurgerProfil;
