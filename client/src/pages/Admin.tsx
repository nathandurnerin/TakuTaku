import AnimeManagement from "../components/admin/animeManegement/AnimesManagement";
import RatinManagement from "../components/admin/ratingManagement/RatinManagement";
import UserManagement from "../components/admin/userManagement/UsersManagement";

function Admin() {
  return (
    <>
      <h1 className="text-tertiary md:mt-0 mt-20  justify-center text-3xl pt-6 text-center">
        Tableau de bord
        <br />
        d’administration
      </h1>
      <UserManagement />
      <AnimeManagement />
      <RatinManagement />
    </>
  );
}

export default Admin;
