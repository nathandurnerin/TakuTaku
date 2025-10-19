//Update Header
import "./App.css";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { AnimeProvider } from "../context/AnimeContext";
import { AuthProvider } from "../context/AuthContext";
import { FavoriteProvider } from "../context/FavoriteContext";
import { UserProvider } from "../context/UserContext";
import Footer from "./components/Footer";
import Header from "./components/Header/DesktopNavBar";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  // Pour le chaos mode
  const [chaosMode, setChaosMode] = useState(false);
  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      <div
        className={`min-h-screen flex flex-col ${chaosMode ? "chaos-mode" : ""}`}
      >
        <UserProvider>
          <AuthProvider>
            <AnimeProvider>
              <FavoriteProvider>
                <Header />
                <ScrollToTop />
                <main className="flex-1">
                  <Outlet />
                </main>
                <Footer setChaosMode={setChaosMode} />
              </FavoriteProvider>
            </AnimeProvider>
          </AuthProvider>
        </UserProvider>
      </div>
    </>
  );
}

export default App;
