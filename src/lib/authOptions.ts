import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

type GitHubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: { params: { scope: "read:user user:email" } },
      async profile(profile, tokens) {
        console.log("GitHub profile (initial):", profile);

        let email = profile.email;

        // Fetch email from GitHub API if missing
        if (!email && tokens?.access_token) {
          try {
            const res = await fetch("https://api.github.com/user/emails", {
              headers: {
                Authorization: `token ${tokens.access_token}`,
                Accept: "application/vnd.github+json",
              },
            });
            if (res.ok) {
              const emails: GitHubEmail[] = await res.json();
              const primaryEmail = emails.find(
                (e) => e.primary && e.verified
              );
              if (primaryEmail) {
                email = primaryEmail.email;
              }
            }
          } catch (err) {
            console.error("Error fetching GitHub emails:", err);
          }
        }

        // Fallback if still no email
        if (!email) {
          email = `${profile.login}@noemail.local`;
        }

        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  session: { strategy: "database" },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("🔍 signIn callback data:", {
        user,
        account,
        profile,
      });
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
