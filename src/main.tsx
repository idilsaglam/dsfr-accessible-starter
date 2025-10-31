import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Link as RouterLink } from "react-router-dom";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import "@codegouvfr/react-dsfr/main.css";

startReactDsfr({
  defaultColorScheme: "system",
  Link: RouterLink,
});

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import RDV from "./pages/RDV";
import Justificatifs from "./pages/Justificatifs";
import "./styles/tokens.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "rdv", element: <RDV /> },
      { path: "justificatifs", element: <Justificatifs /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
