import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Welcome, {session.user?.name || "friend"}!</h1>
      <SignOutButton />
    </div>
  );
}
