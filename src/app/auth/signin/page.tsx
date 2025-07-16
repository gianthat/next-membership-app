'use client';

import { getProviders, signIn, type ClientSafeProvider } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Sign in</h2>

        {/* Credentials Sign-in Form */}
        <form
          className="space-y-4"
          onSubmit={e => {
            e.preventDefault();
            const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
            const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value;
            signIn("credentials", {
              email,
              password,
              callbackUrl: "/dashboard"
            });
          }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-800">Email</label>
            <input
              type="email"
              name="email"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Password</label>
            <input
              type="password"
              name="password"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Sign in with Email
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t text-center text-gray-500 text-sm">or</div>

        {/* Other Providers */}
        {providers &&
          Object.values(providers).map(provider =>
            provider.id !== "credentials" ? (
              <div key={provider.name} className="mt-2">
                <button
                  onClick={() => signIn(provider.id, { callbackUrl: "/dashboard" })}
                  className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800"
                >
                  Sign in with {provider.name}
                </button>
              </div>
            ) : null
          )}
      </div>
    </div>
  );
}
