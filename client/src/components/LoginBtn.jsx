import { useAuth0 } from "@auth0/auth0-react";

export default function LoginBtn() {
  const { loginWithRedirect } = useAuth0();
  return (
    <button
      onClick={loginWithRedirect}
      className="bg-[#3cb2f0] hover:bg-[#1a73bd] text-white font-bold py-2 px-4 rounded-md"
    >
      Log in
    </button>
  )
}