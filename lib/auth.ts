// src/lib/auth.ts (veya senin konvansiyonuna uygun bir yol)
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/utils/db";

export async function getCurrentUser() {
  // NextAuth session’dan email al
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  // Prisma ile User kaydını çek, sadece id ve role yeterli
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      userType: true,
      onboardingCompleted: true,
      stripeCustomerId: true,
      Company: true,
      JobSeeker: {
        select: {
          id: true,
        },
      },
    },
  });
  return user; // null veya { id, role }
}
