import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scroll automatiquement en haut à chaque changement de page
function ScrollToTop() {
  const { pathname } = useLocation(); // Récupère le chemin actuel

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" }); // Scroll en haut
  }, [pathname]); // Se déclenche à chaque changement de page

  return null; // Ce composant n'affiche rien
}

export default ScrollToTop;
