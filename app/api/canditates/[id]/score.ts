import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/app/utils/db";
import { calculateTotalScore } from "@/lib/calculateScore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;
  if (req.method !== "POST") return res.status(405).end();

  const candidate = await prisma.jobSeeker.findUnique({ where: { id } });
  if (!candidate) return res.status(404).json({ error: "Aday bulunamadı" });

  // activities JSON’ı tipi CandidateActivity
  const activities = candidate.resume;
  try {
    const score = calculateTotalScore(activities);
    await prisma.jobSeeker.update({
      where: { id },
      data: { totalScore: score },
    });
    return res.status(200).json({ totalScore: score });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
}
