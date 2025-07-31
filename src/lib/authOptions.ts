import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: { params: { scope: "read:user user:email" } },
      profile(profile) {
        console.log("GitHub profile:", profile); // Debug logging
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  session: { strategy: "database" },
  callbacks: {
    async signIn({ user }) {
      // DB test inside signIn to confirm connectivity during auth
      try {
        const result = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW()`;
        console.log("✅ DB test in signIn:", result);
      } catch (err) {
        console.error("❌ DB test failed in signIn:", err);
      }
      return true;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
