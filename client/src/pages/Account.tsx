import ProfilePicture from "../components/account/ProfilePicture";
import ProfileSettings from "../components/account/ProfileSettings";
import Abonnement from "../components/home/Abonnement";

function Account() {
  return (
    <section className="mx-6 mt-20 md:mt-0 flex flex-col items-center justify-center gap-4">
      <h1 className="text-tertiary text-3xl pt-6 text-center">Mon compte</h1>
      <ProfilePicture />
      <ProfileSettings />
      <div className="mt-10">
        <Abonnement />
      </div>
    </section>
  );
}

export default Account;
