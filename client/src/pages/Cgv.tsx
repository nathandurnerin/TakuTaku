interface Cgv {
  title: string;
  description: string;
}

function Cgv() {
  const data: Cgv[] = [
    {
      title: "1. Objet de la Quête",
      description:
        "Les présentes CGV définissent les règles sacrées (et un peu légales) entre :\n-TAKUTAKU Corp., grand maître du streaming animé\n-Et toi, valeureux.e utilisateur.ice, détenteur.ice d’un compte sur le site",
    },
    {
      title: "2. Formules d'Abonnement",
      description:
        "🆓 Offre Découverte – pour les novices et curieux\nTarif : 0€ / mois\nAccès complet au catalogue d’animés\nQualité max : 720p\n1 écran à la fois\nPub obligatoire, mais sans boss final entre les épisodes\nPas de téléchargement\n\n💎 Offre Premium “Sans Pub” – pour les vrais Senpai\nTarif : 2,99€ / mois\nSans publicité (même pas de flashback inutile)\nQualité jusqu’à 1080p\nTéléchargement hors ligne (regarde en avion ou au sommet du Mont Fuji)\n2 écrans en simultané (toi et ton alter ego)\n\n🧾 Paiement sécurisé via notre coffre-fort dimensionnel (Stripe, CB)\n📅 Sans engagement, annulable à tout moment depuis ton espace perso",
    },
    {
      title: "3. Résiliation du pacte",
      description:
        "Tu peux annuler ton abonnement quand tu veux, sans invoquer de sort compliqué.\nAucun remboursement n’est possible pour le mois entamé (même si tu es happé par un Isekai).",
    },
    {
      title: "4. Accès du contenu sacré",
      description:
        "Le site est accessible 24h/24, 7j/7, sauf attaque serveur de classe S ou maintenance par nos ninjas dev.\nL’abonnement est personnel. Pas de partage avec ton chat ou ton boss (même si on comprend).",
    },
    {
      title: "5. Proprièté intellectuelle",
      description:
        "Tous les contenus présents sur TakuTaku (textes, visuels, animés, mascotte trop mims…) sont protégés par les lois de l’univers (et le Code de la propriété intellectuelle).\nCopier = malédiction de 1 000 spoilers.",
    },
    {
      title: "6. Données personnelles",
      description:
        "Tes données sont traitées avec soin par notre Conseil de la Protection Galactique.\nTu peux demander consultation, modification ou suppression en envoyant un corbeau numérique à privacy@takutaku.com",
    },
    {
      title: "7. Cookies",
      description:
        "Oui, on utilise des cookies. Pas ceux de ta grand-mère, ceux qui améliorent ton expérience.\nTu peux les gérer depuis ton bandeau RGPD. Tu es libre comme un ninja du vent.",
    },
    {
      title: "7. Litiges et univers parallèles",
      description:
        "En cas de litige, on essaie d’abord de discuter calmement autour d’un ramen.\nSinon, c’est le tribunal de Paris (et pas celui de Soul Society) qui tranche.",
    },
  ];

  return (
    <section className="mt-25 md:mt-10 px-5 md:px-10">
      <h1 className="text-tertiary text-center text-2xl mb-6">
        CGV - Conditions Générales de Vente
      </h1>
      <h2 className="text-secondary text-xl md:text-left mb-10">
        TakuTaku - “Le pouvoir de l’abonnement illimité (sans filler) ! “
      </h2>
      {data.map((item) => (
        <div key={item.title} className="mb-8">
          <h3 className=" text-lg text-tertiary mb-2">{item.title}</h3>
          <p className="whitespace-pre-line text-sm font-extralight text-tertiary">
            {item.description}
          </p>
        </div>
      ))}
    </section>
  );
}

export default Cgv;
