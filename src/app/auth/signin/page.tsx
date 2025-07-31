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

        {providers &&
          Object.values(providers)
            .filter(provider => provider.id === "github") // Only GitHub
            .map(provider => (
              <div key={provider.name} className="mt-2">
                <button
                  onClick={() => signIn(provider.id, { callbackUrl: "/dashboard" })}
                  className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800"
                >
                  Sign in with {provider.name}
                </button>
              </div>
            ))}
      </div>
    </div>
  );
}
