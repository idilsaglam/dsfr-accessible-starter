// src/pages/Justificatifs.tsx
import Combobox from "../components/Combobox";

const CITIES = ["Paris","Lyon","Marseille","Toulouse","Nice","Nantes","Strasbourg","Montpellier","Bordeaux","Lille"];

export default function Justificatifs() {
  return (
    <>
      <h1 className="fr-h1">Justificatifs</h1>
      <p className="fr-text">Choisissez votre ville pour afficher les pièces adaptées.</p>

      <Combobox
        id="ville"
        label="Ville"
        options={CITIES}
        placeholder="Rechercher une ville…"
        onChange={() => { /* optional side-effect later */ }}
      />

      <p className="fr-mt-4w">Formulaire + Upload (à implémenter).</p>
    </>
  );
}
