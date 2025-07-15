import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// ✅ Export this so getServerSession() can use it
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
  ],
  session: {
    strategy: "database", // or "jwt" if you prefer
  },
  callbacks: {
    async signIn({ profile }) {
      console.log("🔥 GitHub profile:", profile);
      return true;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`; // 👈 Always go to /dashboard
    },
  },
};

// ✅ Pass the options to NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
