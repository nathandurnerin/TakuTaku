const articles = [
  {
    prénom: "Alexandra",
    citation: "“C’est pas mignon, c’est une identité visuelle.”",
    description:
      "Armée de Figma et d’un bon goût affûté, Alexandra a donné vie à la mascotte de TakuTaku. Quand elle l’a finie, elle a regardé le groupe et a dit :\n « Là, je suis fière.» \n \n Et franchement ? On l’était tous!",
    images: ["/Alex1.png", "/Alex2.png"],
  },
  {
    prénom: "Dara",
    citation: " “Le projet? Je le pitche à France2 s’il faut.”  ",
    description:
      "Dara ne codait pas, elle orchestrait. \n Entre deux trellos et un coup de pression stylé, elle rêvait déjà de présenter TakuTaku devant un public national, micro en main, regard caméra. \n \n On l'a retenue. A peine.",
    images: ["/Dara2.png", "/Dara1.png"],
  },
  {
    prénom: "Thibaud",
    citation: "“J’arrive... juste une dernière partie.”",
    description:
      "Thibaud, c’est notre dev version LoL : il avance parfois un peu tête baissée, comme en pleine phase de push sans ward, mais toujours avec détermination. \n \n Concentré comme en ranked, il aborde chaque fonctionnalité comme un objectif d’équipe, en mode vision map activée.",
    images: ["/Thibaud1.png", "/Thibaud2.png"],
  },
  {
    prénom: "Nathan",
    citation: "“Ce jour-là, tout a basculé.”",
    description:
      "Calme, logique, structuré : Nathan était le back-end guy qu’on rêve tous d’avoir. Jusqu’à ce moment. \n On venait d’implémenter la première version du front et là... il l’a vue : ....... la police. \n \n Pas celle avec une sirène. Non, celle des titres. \n Et c’est là qu’on a compris : “Nathan ne tolère pas la typographie bâclée.” \n Il aurait pu ignorer. Il a choisi le combat.",
    images: ["/Nathan2.png", "/Nathan1.png"],
  },
  {
    prénom: "Arnaud",
    citation: "“Je voulais juste que ce soit beau.”",
    description:
      "Arnaud, lui, c’était le gars du détail. Le padding à 2px près, les ombres douces, les polices… originales. \n\u00A0\u00A0\u00A0\u00A0- “J’ai mis une typo stylée. Un peu ronde. Ça passait bien.” \n Il n’imaginait pas que cela allait diviser l’équipe. \n 2 commits. 4 conflits. 1 rollback. \n Mais il tenait bon. \n\u00A0\u00A0\u00A0\u00A0- “À un moment, faut choisir entre le bon goût… et les goûts de Nathan.” \n \n Spoiler : ils ont fini par s’entendre. Mais pas sur la typo. Juste sur le fait de vivre avec.",
    images: ["/Arnaud1.jpg", "/Arnaud2.png"],
  },
];

function About() {
  return (
    <>
      <div className="flex items-end justify-center mt-20 md:mt-0">
        <h1 className="text-tertiary text-2xl pt-6 text-center z-10">
          A propos de
        </h1>
        <img
          src="/bulle.jpg"
          alt="Bulle de dialogue TakuTaku"
          className="object-cover h-30 lg:h-46 -ml-8 z-0 translate-y-3"
        />
      </div>
      <img
        src="/logo_taku.png"
        alt="TakuTaku Logo"
        className="mb-8 w-1/5 h-auto object-cover md:w-1/12 mx-auto -translate-x-4"
      />
      <section className="text-tertiary mx-auto max-w-screen-xl px-4 flex flex-col gap-8 lg:gap-10 mt-10">
        <h2 className="text-xl -mb-4">L'origine d'une légende (ou presque)</h2>
        <p className="mb-8">
          TakuTaku n’est pas né dans un garage à Tokyo, mais dans une salle de
          classe un peu trop bruyante, avec cinq développeurs plein de passion,
          de mauvaises blagues, et d’épisodes en retard. Voici leur histoire.
        </p>
        {articles.map((article, index) => (
          <article
            key={article.prénom}
            className={`flex flex-col gap-4 lg:gap-20 ${
              index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            } items-start`}
          >
            {/* Bloc texte */}
            <div className="lg:flex-1">
              <h2 className="text-xl">
                {article.prénom} –{" "}
                <span className="text-secondary text-lg">
                  {article.citation}
                </span>
              </h2>
              <p className="pb-4 whitespace-pre-line">{article.description}</p>
            </div>

            {/* Bloc images */}
            <div
              className={`flex justify-around lg:gap-4 lg:w-2/5 ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              } items-start`}
            >
              {article.images.map((image, imgIndex) => (
                <img
                  key={article.prénom}
                  src={image}
                  alt={`${article.prénom} en action`}
                  className={`object-contain max-h-80 w-[48%]  ${
                    imgIndex % 2 !== 0
                      ? article.prénom === "Arnaud"
                        ? "mt-32 lg:mt-40"
                        : article.prénom === "Thibaud"
                          ? "mt-32"
                          : "mt-24"
                      : "mt-0"
                  }`}
                />
              ))}
            </div>
          </article>
        ))}
        <h2 className="text-xl -mb-4 mt-8">Et maintenant ?</h2>
        <p>
          TakuTaku est un site fictif, mais fait avec 100% d’amour d’animé, de
          fou rires d’équipes, et de débug à 2h du matin. <br />
          Un jour peut-être, il existera vraiment. En attendant, il reste notre
          petit isekai personnel.
        </p>
        <p>
          “Parce que binge-watcher mérite d’être une expérience sacrée.” <br />–
          L’équipe TakuTaku
        </p>
      </section>
    </>
  );
}

export default About;
