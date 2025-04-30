"use server";

// src/app/(mainLayout)/job/[jobId]/applications/page.tsx
import { auth } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";
import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { revalidatePath } from "next/cache";

// Update application status
export async function updateApplicationStatus(
  appId: string,
  jobId: string,
  formData: FormData
) {
  const status = formData.get("status");
  if (typeof status !== "string") return;
  await prisma.application.update({
    where: { id: appId },
    data: { status },
  });
  revalidatePath(`/job/${jobId}/applications`);
}

// Score application
export async function scoreApplication(
  appId: string,
  jobId: string,
  formData: FormData
) {}

// Delete application
export async function deleteApplication(appId: string, jobId: string) {
  await prisma.application.delete({
    where: { id: appId },
  });
  revalidatePath(`/job/${jobId}/applications`);
}

// Assign a jury member to an application
export async function assignJuryToApplication(
  appId: string,
  jobId: string,
  formData: FormData
) {
  "use server";
  const juryMemberId = formData.get("juryMemberId");
  if (typeof juryMemberId !== "string") return;
  await prisma.juryEvaluation.create({
    data: {
      juryMember: { connect: { id: juryMemberId } },
      application: { connect: { id: appId } },
      reportUrl: "", // placeholder
      // decision omitted to use default ReviewDecision
    },
  });
  revalidatePath(`/job/${jobId}/applications`);
}

interface PageProps {
  params: { jobId: string };
}

export default async function ApplicationsPage({
  params: { jobId },
}: PageProps) {
  // 1. Authenticate user
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // 2. Ensure user is COMPANY and has a Company profile
  const companyUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      userType: true,
      Company: {
        select: { id: true, name: true },
      },
    },
  });
  if (
    !companyUser ||
    companyUser.userType !== "COMPANY" ||
    !companyUser.Company
  ) {
    redirect("/");
  }

  // 3. Verify the job belongs to this company
  const job = await prisma.jobPost.findUnique({
    where: { id: jobId },
    select: { id: true, jobTitle: true, companyId: true },
  });
  if (!job || job.companyId !== companyUser.Company.id) {
    return notFound();
  }

  // Fetch available jury members for assignment
  const juryMembers = await prisma.juryMember.findMany({
    select: { id: true, user: { select: { name: true } } },
  });

  // 4. Fetch applications with jobSeeker info
  const applications = await prisma.application.findMany({
    where: { jobPostId: jobId },
    include: {
      jobSeeker: {
        select: {
          id: true,
          name: true,
          about: true,
          resume: true,
          totalScore: true,
          user: {
            select: {
              email: true,
              username: true,
            },
          },
        },
      },
    },
    orderBy: { appliedAt: "desc" },
  });

  // 5. Render
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Applications for: {job.jobTitle}
      </h1>
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul className="space-y-6">
          {applications.map((app) => (
            <li key={app.id}>
              <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {app.jobSeeker.name?.charAt(0) ||
                          app.jobSeeker.user.username?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {app.jobSeeker.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        @{app.jobSeeker.user.username}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      app.status === "PENDING"
                        ? "outline"
                        : app.status === "ACCEPTED"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {app.status}
                  </Badge>
                </div>

                <p className="mb-2">
                  <strong>Email:</strong> {app.jobSeeker.user.email}
                </p>

                {app.coverLetter && (
                  <details className="mb-4 bg-gray-50 p-4 rounded">
                    <summary className="font-medium cursor-pointer">
                      View Cover Letter
                    </summary>
                    <p className="mt-2 text-sm">{app.coverLetter}</p>
                  </details>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Applied at: {new Date(app.appliedAt).toLocaleString()}
                  </p>
                  <div className="flex space-x-2">
                    {app.jobSeeker.resume && (
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={app.jobSeeker.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Resume
                        </a>
                      </Button>
                    )}
                    <Button size="sm">Message</Button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex flex-col space-y-2">
                  {/* Status update */}
                  <form
                    action={updateApplicationStatus.bind(null, app.id, jobId)}
                    className="flex items-center space-x-2"
                  >
                    <select
                      name="status"
                      defaultValue={app.status}
                      className="p-1 border rounded"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="REVIEW">REVIEW</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                    <Button size="sm" type="submit">
                      Update Status
                    </Button>
                  </form>
                  {/* Score */}
                  <form
                    action={scoreApplication.bind(null, app.id, jobId)}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="number"
                      name="score"
                      defaultValue={app.jobSeeker.totalScore ?? 0}
                      className="p-1 border rounded w-20"
                    />
                    <Button size="sm" type="submit">
                      Set Score
                    </Button>
                  </form>
                  {/* Delete */}
                  <form action={deleteApplication.bind(null, app.id, jobId)}>
                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  </form>
                </div>
                {/* Assign Jury Member */}
                <div className="mt-4 pt-4 border-t">
                  <form
                    action={assignJuryToApplication.bind(null, app.id, jobId)}
                    className="flex items-center space-x-2"
                  >
                    <select name="juryMemberId" className="border p-1 rounded">
                      <option value="">Select Jury</option>
                      {juryMembers.map((jm) => (
                        <option key={jm.id} value={jm.id}>
                          {jm.user.name}
                        </option>
                      ))}
                    </select>
                    <Button size="sm" type="submit">
                      Assign Jury
                    </Button>
                  </form>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
