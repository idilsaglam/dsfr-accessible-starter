import React from "react";
import Modal from "./Modal";

export default function ModalExample() {
  const [open, setOpen] = React.useState(false);
  const titleId = "pieces-title";

  return (
    <div>
      <button onClick={() => setOpen(true)}>Ouvrir la modale</button>
      <Modal open={open} onClose={() => setOpen(false)} titleId={titleId}>
        <h2 id={titleId}>Pièces acceptées</h2>
        <p>Veuillez fournir une pièce d’identité valide.</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setOpen(false)}>Fermer</button>
          <a href="#more">En savoir plus</a>
        </div>
      </Modal>
    </div>
  );
}
