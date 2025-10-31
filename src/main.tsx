import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider, Link } from 'react-router-dom'
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
startReactDsfr({ defaultColorScheme: "system" });

import Home from './pages/Home'
import RDV from './pages/RDV'
import Justificatifs from './pages/Justificatifs'
import './styles/tokens.css'

const router = createHashRouter([
  { path: '/', element: <Home /> },
  { path: '/rdv', element: <RDV /> },
  { path: '/justificatifs', element: <Justificatifs /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <nav aria-label="Principale" style={{padding:12}}>
      <a className="skip-link" href="#main">Aller au contenu</a>{' '}
      <Link to="/">Accueil</Link> | <Link to="/rdv">Prise de rendez-vous</Link> | <Link to="/justificatifs">Justificatifs</Link>
    </nav>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
