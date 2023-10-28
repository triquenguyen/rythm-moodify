import { useAuth0 } from "@auth0/auth0-react";

export default function LogoutBtn() {
  const { logout } = useAuth0();
  return (
    <button
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
      className="bg-[#3cb2f0] hover:bg-[#1a73bd] text-white font-bold py-2 px-4 rounded-md"
    >
      Log out
    </button>
  );
}