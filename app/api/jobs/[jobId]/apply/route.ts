// src/app/api/jobs/[jobId]/apply/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/app/utils/db";

export async function POST(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  const jobId = params.jobId;
  const jobPostId = jobId;
  const user = await getCurrentUser();

  // 1. Yetki kontrolü: sadece JOB_SEEKER
  if (!user || !user.JobSeeker?.id) {
    return NextResponse.json(
      { error: "Sadece iş arayan kullanıcılar başvurabilir." },
      { status: 403 }
    );
  }

  // 2. Duplicate başvuru kontrolü
  const existing = await prisma.application.findUnique({
    where: {
      jobSeekerId_jobPostId: {
        jobSeekerId: user.JobSeeker.id,
        jobPostId: jobPostId,
      },
    },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Bu ilana zaten başvuru yapmışsın." },
      { status: 400 }
    );
  }

  // 3. Yeni başvuru kaydı
  const application = await prisma.application.create({
    data: {
      jobSeeker: { connect: { id: user.JobSeeker.id } },
      jobPost: { connect: { id: jobPostId } },
    },
  });

  return NextResponse.json(application, { status: 201 });
}
