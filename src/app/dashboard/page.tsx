// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/signin");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {session.user?.email}</h1>
      <SignOutButton />
    </div>
  );
}
