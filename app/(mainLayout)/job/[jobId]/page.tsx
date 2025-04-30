import { auth } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";
import { revalidatePath } from "next/cache";
import { saveJobPost, UnSaveJobPost } from "@/app/action";
import arcjet, {
  detectBot,
  fixedWindow,
  tokenBucket,
} from "@/app/utils/arcjet";
import { getFlagEmoji } from "@/app/utils/countries-list";
import { benefits } from "@/app/utils/list-of-benefits";
import { JsonToHtml } from "@/components/general/json-to-html";
import { SaveJobButton } from "@/components/general/submit-buttons";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { request } from "@arcjet/next";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      max: 10,
      window: "60s",
    })
  );

function getClient(session: boolean) {
  if (session) {
    return aj.withRule(
      tokenBucket({
        mode: "LIVE",
        capacity: 100,
        interval: 60,
        refillRate: 30,
      })
    );
  } else {
    return aj.withRule(
      tokenBucket({
        mode: "LIVE",
        capacity: 100,
        interval: 60,
        refillRate: 10,
      })
    );
  }
}

async function getJob(jobId: string, userId?: string) {
  const [jobData, savedJob] = await Promise.all([
    await prisma.jobPost.findUnique({
      where: {
        status: "ACTIVE",
        id: jobId,
      },
      select: {
        jobTitle: true,
        id: true,
        salaryFrom: true,
        salaryTo: true,
        employmentType: true,
        jobDescription: true,
        location: true,
        createdAt: true,
        benefits: true,
        listingDuration: true,
        Company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
          },
        },
      },
    }),

    userId
      ? prisma.savedJobPost.findUnique({
          where: {
            userId_jobPostId: {
              userId: userId,
              jobPostId: jobId,
            },
          },
          select: {
            id: true,
          },
        })
      : null,
  ]);
  if (!jobData) {
    return notFound();
  }

  return { jobData, savedJob };
}

// Apply to a job with an optional cover letter
export async function applyToJob(jobId: string, formData: FormData) {
  "use server";
  // Authenticate user
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Fetch user and any existing JobSeeker profile
  const userRecord = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      userType: true,
      name: true,
      about: true,
      JobSeeker: { select: { id: true } },
    },
  });
  if (!userRecord) {
    throw new Error("User not found.");
  }
  if (userRecord.userType !== "JOB_SEEKER") {
    throw new Error("Only job seekers can apply.");
  }
  // If no JobSeeker profile exists, create one
  let jobSeekerId: string;
  if (!userRecord.JobSeeker) {
    const newProfile = await prisma.jobSeeker.create({
      data: {
        userId: userRecord.id,
        name: userRecord.name ?? "",
        about: userRecord.about ?? "",
        activities: {},
        totalScore: 0,
        resume: "",
      },
    });
    jobSeekerId = newProfile.id;
  } else {
    jobSeekerId = userRecord.JobSeeker.id;
  }

  // Extract cover letter
  const coverLetter = formData.get("coverLetter")?.toString();

  // Prevent duplicate applications
  const existing = await prisma.application.findUnique({
    where: {
      jobSeekerId_jobPostId: {
        jobSeekerId,
        jobPostId: jobId,
      },
    },
  });
  if (existing) {
    // Already applied; just revalidate and return early
    revalidatePath(`/job/${jobId}`);
    return;
  }

  // Create application record
  await prisma.application.create({
    data: {
      jobSeekerId,
      jobPostId: jobId,
      coverLetter: coverLetter || null,
    },
  });

  // Revalidate the job page so UI updates
  revalidatePath(`/job/${jobId}`);
}

type Params = Promise<{ jobId: string }>;
export default async function JobIdPage({ params }: { params: Params }) {
  const { jobId } = await params;

  const session = await auth();
  const req = await request();
  const decision = await getClient(!!session).protect(req, { requested: 10 });

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const { jobData: data, savedJob } = await getJob(jobId, session?.user?.id);

  const locationFlag = getFlagEmoji(data.location);
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="space-y-8 col-span-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{data.jobTitle}</h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="font-medium">{data.Company.name}</p>
              <span className="hidden md:inline text-muted-foreground">|</span>
              <Badge className="rounded-full" variant={"secondary"}>
                {data.employmentType}
              </Badge>
              <span className="hidden md:inline text-muted-foreground">|</span>
              <Badge>
                {locationFlag} {data.location}
              </Badge>
            </div>
          </div>
          {session?.user ? (
            <form
              action={
                savedJob
                  ? UnSaveJobPost.bind(null, savedJob.id)
                  : saveJobPost.bind(null, jobId)
              }
            >
              <SaveJobButton savedJob={!!savedJob} />
            </form>
          ) : (
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline" })}
            >
              <Heart className="size-4" />
              Save Job
            </Link>
          )}
        </div>

        <section>
          <JsonToHtml json={JSON.parse(data.jobDescription)} />
        </section>

        <section>
          <h3 className="font-semibold mb-4">Benefits</h3>
          <div className="flex flex-wrap gap-3">
            {benefits.map((benefit) => {
              const isOffered = data.benefits.includes(benefit.id);
              return (
                <Badge
                  key={benefit.id}
                  className="cursor-pointer transition-all hover:scale-105 active:scale-95 text-sm px-4 py-1.5 rounded-full"
                  variant={isOffered ? "default" : "outline"}
                >
                  <span className="flex items-center gap-2">
                    {benefit.icon}
                    {benefit.label}
                  </span>
                </Badge>
              );
            })}
          </div>
        </section>
      </div>
      <div className="space-y-6">
        <form action={applyToJob.bind(null, jobId)}>
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Apply Now</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Please let {data.Company.name} know you found this job on
                  AC&M. This helps us grow!
                </p>
              </div>
              <Button type="submit" className="w-full">
                Apply Now
              </Button>
            </div>
          </Card>
        </form>

        {/* Job details card */}
        <Card className="p-6">
          <h3 className="font-semibold">About the {data.jobTitle} position</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Apply before
              </span>
              <span className="text-sm">
                {new Date(
                  data.createdAt.getTime() +
                    data.listingDuration * 24 * 60 * 60 * 1000
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Posted on</span>
              <span className="text-sm">
                {data.createdAt.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Employment Type
              </span>
              <span className="text-sm">
                {data.employmentType.charAt(0).toUpperCase()}
                {data.employmentType.slice(1)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-sm">
                {locationFlag} {data.location}
              </span>
            </div>
          </div>
        </Card>

        {/* Company Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src={data.Company.logo}
                alt={data.Company.name}
                width={52}
                height={52}
                className="rounded-full size-12"
              />
              <div className="flex flex-col">
                <h3 className="font-semibold">{data.Company.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {data.Company.about}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
