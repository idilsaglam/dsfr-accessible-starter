import { useRef } from "react";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";

const piecesModal = createModal({ id: "pieces-modal", isOpenedByDefault: false });

export default function Home() {
  const openBtnRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    piecesModal.open();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTimeout(() => openBtnRef.current?.focus(), 0);
        window.removeEventListener("keydown", onKeyDown, true);
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
  };

  const handleClose = () => {
    piecesModal.close();
    setTimeout(() => openBtnRef.current?.focus(), 0);
  };

  return (
    <section aria-labelledby="home-title">
      <h1 id="home-title" className="fr-h1">Portail MTSSF — Accueil</h1>
      <p className="fr-text--lead">Mini app DSFR pour entraînement accessibilité.</p>

      <Button data-testid="open-modal" ref={openBtnRef} onClick={handleOpen}>
        Ouvrir la modale
      </Button>

      <piecesModal.Component title="Pièces acceptées">
        <div className="fr-container fr-pt-2w">
          <p className="fr-text">Vous pouvez déposer les pièces suivantes :</p>
          <ul className="fr-list">
            <li>Carte d’identité</li>
            <li>Passeport</li>
            <li>Justificatif de domicile</li>
          </ul>
          <div className="fr-mt-3w">
            <Button priority="secondary" onClick={handleClose}>
              Fermer
            </Button>
          </div>
        </div>
      </piecesModal.Component>
    </section>
  );
}
