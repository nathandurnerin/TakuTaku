import emailjs from "emailjs-com";
import { useRef, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";

function Footer({ setChaosMode }: { setChaosMode: (value: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const [showChaosGif, setShowChaosGif] = useState(false);
  const [loading, setLoading] = useState(false);
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.current) return;

    setLoading(true);

    emailjs
      .sendForm(serviceId, templateId, form.current, publicKey)
      .then(
        () => {
          toast.success("Votre message a bien été envoyé 🎉");
          form.current?.reset();
        },
        () => {
          toast.error(
            "Une erreur est survenue, veuillez réessayer plus tard ❌",
          );
        },
      )
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <section className="text-tertiary flex flex-row justify-between items-end mt-10 px-2">
      {/* Gauche */}
      <section className="text-xs md:text-sm pb-1 w-14 md:w-28">
        © 2025 TakuTaku
      </section>

      {/* Centre */}
      <section className="text-center text-xs md:text-sm pb-1">
        <section>
          <Link to="/cgv">CGV</Link>
        </section>
        <section>
          <Link to="/legal-notices">Mentions légales</Link>
        </section>
        <section>
          <Link to="/about">A propos de TakuTaku</Link>
        </section>

        <section>
          <p>
            contact@takutaku.fr - {""}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="underline hover:text-secondary cursor-pointer"
            >
              Nous contacter
            </button>
          </p>
        </section>
      </section>

      {/* Droite : image */}
      <section className="mt-4 w-14 md:w-28 flex justify-end">
        {/* CHAOS MODE au clic */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <img
          src={showChaosGif ? "/gifTaku.gif" : "/favicon.ico"}
          alt="Mascotte"
          className="h-15 cursor-pointer  hover:animate-wiggle"
          onClick={() => {
            const audio = new Audio(
              "https://www.myinstants.com/media/sounds/rickroll.mp3",
            );
            audio.volume = 0.5;
            audio.play().catch(() => {
              console.warn("Lecture bloquée par le navigateur");
            });
            setChaosMode(true);
            setShowChaosGif(true);
            setTimeout(() => {
              setChaosMode(false);
              setShowChaosGif(false);
              audio.pause(); // Stoppe le son après 8s5
              audio.currentTime = 0;
            }, 8500);
          }}
        />
      </section>

      {open && (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-primary bg-opacity-70 px-4">
          <section className="relative bg-quadrary text-tertiary rounded-lg w-full max-w-lg p-8">
            {/* Logo TakuTaku */}
            <section className="text-center mb-10">
              <img
                src="/logo_taku.png"
                alt="Logo TakuTaku"
                className="mx-auto h-15"
              />
            </section>

            {/* Titre */}
            <h2 className="text-2xl text-center mb-6">Nous contacter</h2>

            <form
              ref={form}
              onSubmit={sendEmail}
              className="flex flex-col gap-5"
            >
              {/* Nom / Prénom */}
              <section className="flex gap-4">
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  required
                  className="w-1/2 bg-primary border border-tertiary/30 text-tertiary px-4 py-2 rounded-md text-sm"
                />
                <input
                  type="text"
                  name="prenom"
                  placeholder="Prénom"
                  required
                  className="w-1/2 bg-primary border border-tertiary/30 text-tertiary px-4 py-2 rounded-md text-sm"
                />
              </section>

              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                required
                className="w-full bg-primary border border-tertiary/30 text-tertiary px-4 py-2 rounded-md text-sm"
              />

              {/* Objet */}
              <input
                type="text"
                name="objet"
                placeholder="Objet"
                required
                className="w-full bg-primary border border-tertiary/30 text-tertiary px-4 py-2 rounded-md text-sm"
              />

              {/* Message */}
              <textarea
                name="message"
                placeholder="Message"
                required
                rows={10}
                className="w-full bg-primary border border-tertiary/30 text-tertiary px-4 py-2 rounded-md text-sm"
              />

              {/* Mascotte + Bouton envoyer */}
              <section className="flex justify-between items-end mt-4">
                <img src="/favicon.ico" alt="Mascotte" className="h-15" />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-secondary text-primary rounded-lg px-2 py-1 font-semibold text-lg mb-10 cursor-pointer hover:rotate-15 duration-200"
                >
                  {loading ? "Envoi en cours..." : "Envoyer"}
                </button>
              </section>
            </form>

            {/* Bouton fermer */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-2 right-3 text-tertiary text-xl font-bold cursor-pointer"
            >
              &times;
            </button>
          </section>
        </section>
      )}
    </section>
  );
}

export default Footer;
