import { prisma } from "@/lib/prisma";

export async function setDefaultUserRole(userId: string, role: string = "user") {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    console.log(`✅ Default role '${role}' set for user ${userId}`);
  } catch (error) {
    console.error("❌ Failed to set default role:", error);
  }
}
