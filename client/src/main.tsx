// Import necessary modules from React and React Router
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";

// Import the main app component
import App from "./App";
import About from "./pages/About";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import Anime from "./pages/Anime";
import Cgv from "./pages/Cgv";
import Favorite from "./pages/Favorite";
import Genre from "./pages/Genre";
import History from "./pages/History";
import Home from "./pages/Home";
import LegalNotices from "./pages/LegalNotices";
import Login from "./pages/Login";
import Page404 from "./pages/Page404";
import Watch from "./pages/Watch";

import PrivateRoute from "./components/ProtectRoute/PrivateRoute";
import PrivateRouteAdmin from "./components/ProtectRoute/PrivateRouteAdmin";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },

      {
        path: "/account",
        element: (
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <PrivateRouteAdmin>
            <Admin />
          </PrivateRouteAdmin>
        ),
      },
      {
        path: "/anime",
        element: <Anime />,
      },
      {
        path: "/anime/:id",
        element: <Anime />,
      },
      {
        path: "/cgv",
        element: <Cgv />,
      },
      {
        path: "/favorite",
        element: (
          <PrivateRoute>
            <Favorite />
          </PrivateRoute>
        ),
      },
      {
        path: "/genre",
        element: <Genre />,
      },
      {
        path: "/history",
        element: (
          <PrivateRoute>
            <History />
          </PrivateRoute>
        ),
      },
      {
        path: "/legal-notices",
        element: <LegalNotices />,
      },
      {
        path: "/watch",
        element: (
          <PrivateRoute>
            <Watch />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "*",
        element: <Page404 />,
      },
    ],
  },
]);

/* ************************************************************************* */

// Find the root element in the HTML document
const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

// Render the app inside the root element
createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
