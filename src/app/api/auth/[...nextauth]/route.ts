import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // You already created this

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
