import useAuth from "@/utils/useAuth";
import { useEffect } from "react";

function SignOutPage() {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut({
      callbackUrl: "/",
      redirect: true,
    });
  }, [signOut]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Signing Out...
        </h1>
        <div className="animate-pulse text-gray-500">Please wait a moment</div>
      </div>
    </div>
  );
}

export default SignOutPage;
