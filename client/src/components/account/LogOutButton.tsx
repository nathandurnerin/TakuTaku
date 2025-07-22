import { useAuthContext } from "../../../context/AuthContext";

function LogOutButton() {
  const { handleLogOut } = useAuthContext();

  return (
    <button
      type="button"
      onClick={handleLogOut}
      style={{ fontFamily: '"Lilita One", sans-serif' }}
    >
      SE DECONNECTER
    </button>
  );
}

export default LogOutButton;
