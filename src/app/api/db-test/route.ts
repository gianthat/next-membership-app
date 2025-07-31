import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW()`;
    return new Response(JSON.stringify({ success: true, result }), { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500 }
      );
    }
    return new Response(
      JSON.stringify({ success: false, error: "Unknown error" }),
      { status: 500 }
    );
  }
}
