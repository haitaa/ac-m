// src/app/utils/jury.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/utils/db";
import { ReviewDecision } from "@prisma/client";

/**
 * Returns the current JuryMember record for the signed-in user,
 * or creates one if none exists (and the userType is JURY).
 */
export async function getCurrentJuryMember() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, userType: true, JuryMember: { select: { id: true } } },
  });
  if (!user || user.userType !== "JURY") {
    throw new Error("Forbidden: not a jury member");
  }

  if (user.JuryMember) {
    return user.JuryMember;
  }

  // Create a JuryMember profile if missing
  const jm = await prisma.juryMember.create({
    data: { userId: user.id },
  });
  return jm;
}

/**
 * Lists all applications awaiting evaluation by this jury member.
 */
export async function listAssignedApplications(juryMemberId: string) {
  return await prisma.application.findMany({
    where: {
      NOT: {
        JuryEvaluation: {
          some: { juryMemberId },
        },
      },
    },
    select: {
      id: true,
      coverLetter: true,
      appliedAt: true,
      jobSeeker: {
        select: {
          id: true,
          name: true,
          resume: true,
          user: { select: { email: true } },
        },
      },
    },
    orderBy: { appliedAt: "asc" },
  });
}

/**
 * Submits a jury evaluation report for a given application.
 */
export async function submitJuryEvaluation(
  juryMemberId: string,
  applicationId: string,
  reportUrl: string
) {
  return await prisma.juryEvaluation.create({
    data: {
      juryMember: { connect: { id: juryMemberId } },
      application: { connect: { id: applicationId } },
      reportUrl,
      decision: ReviewDecision.APPROVED, // default to APPROVED; can be updated
    },
  });
}

/**
 * Updates the final decision for an existing jury evaluation.
 */
export async function updateJuryDecision(
  evaluationId: string,
  decision: ReviewDecision
) {
  return await prisma.juryEvaluation.update({
    where: { id: evaluationId },
    data: { decision },
  });
}

/**
 * Deletes an evaluation (if needed).
 */
export async function deleteJuryEvaluation(evaluationId: string) {
  return await prisma.juryEvaluation.delete({
    where: { id: evaluationId },
  });
}
