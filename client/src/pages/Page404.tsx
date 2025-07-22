import { Link } from "react-router";

function Page404() {
  return (
    <section className="flex flex-col items-center justify-center mt-20 md:mt-0">
      <h1 className="text-tertiary text-4xl md:text-5xl mt-16 text-center">
        404 - Page Not Found
      </h1>
      <img
        src="/404.png"
        alt="404 Not Found"
        className="mx-auto mt-14 md:mt-20 w-40 md:w-48 lg:w-52 object-cover"
      />
      <p className="text-tertiary text-center mt-4 font-semibold text-sm md:text-lg md:mx-40">
        Oups... TakuTaku a mangé cette page par erreur. <br />
        Il a cru que c’était un sushi 🍣 .
      </p>
      <Link to="/">
        <button
          type="button"
          className="bg-[var(--color-secondary)] text-[var(--color-primary)] py-2 px-4 rounded-full font-medium cursor-pointer mt-8 text-sm md:text-base"
        >
          Revenir à la page d'accueil
        </button>
      </Link>
    </section>
  );
}

export default Page404;
