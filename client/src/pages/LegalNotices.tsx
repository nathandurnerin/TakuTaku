interface LegalNotice {
  title: string;
  description: string;
}

function LegalNotices() {
  const data: LegalNotice[] = [
    {
      title: "1. Éditeur du site",
      description:
        "Le site TakuTaku est édité par :\nTAKUTAKU Corp.\nUne société fondée quelque part entre Tokyo-3 et Konoha, sur les ruines d’un vieux lecteur DVD.\nForme juridique : Société d’Otakus à Statut Sérieux (SOSS)\nCapital social : 10 000 yens convertis en euros lors d’un tournoi intergalactique.\nAdresse : 42 rue du Mecha, Quartier des Mangakas, 75000 Neo-Paris\nDirectrice de publication : Hanaé Kuronami, toujours à l’heure pour l’épisode du lundi.\n📬 Contact : support@takutaku.com\n📞 Téléphone : un vieux Talkie-Walkie magique (ou utilisez Discord)",
    },
    {
      title: "2. Hébergement",
      description:
        "Nos serveurs sont gardés par un Cerbère 3 têtes fan de Ghibli, mais techniquement hébergés chez :\nOVHcloud\n2 rue Kellermann – 59100 Roubaix – France\n🌐 www.ovh.com\nIls nous jurent que même les attaques de Titans ne casseront pas leur infrastructure.",
    },
    {
      title: "3. Propriété intellectuelle",
      description:
        "Tous les éléments de TakuTaku (logos, mascotte, visuels, textes, UI, musiques d’opening dans la tête à 3h du matin…) sont la propriété exclusive de TAKUTAKU Corp. ou de ses artistes invités.\n❌ Copier, c’est mal.\n✅ Partager légalement, c’est cool.\nToute reproduction, adaptation ou invocation sans autorisation sera punie par 100 heures de visionnage forcé de fillers.",
    },
    {
      title: "4. Données personnelles",
      description:
        "On collecte uniquement ce qu’on a besoin pour t’offrir la meilleure expérience de binge-watching (email, préférences, historique…).\nAucune invocation de démon numérique, ni revente à une organisation obscure.\nTu peux consulter, modifier ou supprimer tes données en invoquant le sort privacy@takutaku.com.",
    },
    {
      title: "5. Cookies",
      description:
        "Oui, on utilise des cookies. Pas ceux au chocolat, hélas. Ceux qui permettent de mémoriser ta progression dans ton anime préféré.\nTu peux les accepter, les refuser, ou les manger (virtuellement) via le bandeau prévu.",
    },
    {
      title: "6. Responsabilité",
      description:
        "Si tu rates ton bus parce que tu es plongé dans un arc narratif trop intense, TakuTaku décline toute responsabilité.\nMais on compatit.",
    },
    {
      title: "7. Droit applicable",
      description:
        "Même dans un monde rempli de portails dimensionnels, le droit français s’applique.\nTout litige sera tranché par le Tribunal du Conseil des Sages de Neo-Tokyo (ou celui de Paris IRL, si vraiment).\n\n👁‍🗨 Bonus\n\n🟡 Ce site ne contient aucune publicité intrusive, aucun spoiler sauvage, et respecte le rythme de visionnage de chacun.\n🟡 Si un bug se glisse dans l’interface, il est probablement causé par un slime trop curieux.",
    },
  ];

  return (
    <section className="mt-25 md:mt-10 px-5 md:px-10">
      <h1 className="text-tertiary text-center text-2xl mb-6">
        Mentions Légales
      </h1>
      <h2 className="text-secondary text-xl md:text-left mb-10">
        TakuTaku – “Powered by Senpai energy and late-night binges.“
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

export default LegalNotices;
