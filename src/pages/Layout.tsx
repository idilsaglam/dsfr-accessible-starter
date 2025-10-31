import { Outlet } from "react-router-dom";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";

export default function Layout() {
  return (
    <>
      <Header
        brandTop={
          <>
            <span>Ministère</span>
            <span>Travail, Santé, Solidarités</span>
          </>
        }
        serviceTitle="Portail MTSSF"
        homeLinkProps={{ href: "/", title: "Accueil" }}
        navigation={[
          { text: "Accueil", linkProps: { href: "/" } },
          { text: "Prise de rendez-vous", linkProps: { href: "/rdv" } },
          { text: "Justificatifs", linkProps: { href: "/justificatifs" } },
        ]}
      />


<a className="fr-skiplink" href="#content">Aller au contenu</a>
<main id="content" role="main" className="fr-container fr-pt-6w fr-pb-4w">
  <Outlet />
</main>




      <Footer
        accessibility="partially compliant" // required by DSFR
        bottomItems={[
          { text: "Accessibilité", linkProps: { href: "/" } },
        ]}
      />
    </>
  );
}
