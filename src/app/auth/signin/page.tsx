'use client';

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Sign in
        </h2>

        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
