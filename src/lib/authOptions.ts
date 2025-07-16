import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

async function setDefaultRole(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user && !user.role) {
    await prisma.user.update({
      where: { id: userId },
      data: { role: "member" },
    });
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!user || !user.hashedPassword) return null;

        const isValid = await compare(credentials!.password, user.hashedPassword);
        return isValid ? user : null;
      },
    }),
  ],
  session: { strategy: "database" },
  callbacks: {
    async signIn({ user }) {
      if (user) await setDefaultRole(user.id);
      return true;
    },
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.role) session.user.role = token.role;
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
