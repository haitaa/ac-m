/* eslint-disable react/no-unescaped-entities */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ArjcetLogo from "@/public/arcjet.jpg";
import InngestLogo from "@/public/inngest-locale.png";
import GoogleLogo from "@/public/google.png";
import AppleLogo from "@/public/apple.jpg";
import NetflixLogo from "@/public/netflix.png";
import AmazonLogo from "@/public/amazon.jpg";
import Image from "next/image";
import { CreateJobForm } from "@/components/forms/create-job-form";
import { prisma } from "@/app/utils/db";
import { redirect } from "next/navigation";
import { requireUser } from "@/app/utils/require-user";

const companies = [
  { id: 0, name: "ArcJet", logo: ArjcetLogo },
  { id: 1, name: "Inngest", logo: InngestLogo },
  { id: 2, name: "Google", logo: GoogleLogo },
  { id: 3, name: "Inngest", logo: AppleLogo },
  { id: 4, name: "Netflix", logo: NetflixLogo },
  { id: 5, name: "Amazon", logo: AmazonLogo },
];

const testimonials = [
  {
    quote:
      "We found our ideal candidate within 48 hours of posting. The quality of applicants was exceptional.",
    author: "Sarah Chen",
    company: "Netflix",
  },
  {
    quote:
      "The platform's user-friendly interface made it easy to post jobs and manage applications.",
    author: "David Lee",
    company: "Google",
  },
  {
    quote:
      "JobMarshal helped us find a perfect match for our team. Highly recommend!",
    author: "Emily Johnson",
    company: "Apple",
  },
];

const stats = [
  { id: 0, value: "10k+", label: "Monthly active job seekers" },
  { id: 1, value: "48h", label: "Average time to hire" },
  { id: 2, value: "95%", label: "Employer satisfaction rate" },
  { id: 3, value: "500+", label: "Companies hiring remotely" },
];

async function getCompany(userId: string) {
  const data = await prisma.company.findUnique({
    where: {
      userId: userId,
    },
    select: {
      name: true,
      location: true,
      about: true,
      website: true,
      logo: true,
      xAccount: true,
    },
  });

  if (!data) {
    return redirect("/");
  }

  return data;
}

export default async function PostJobPage() {
  const session = await requireUser();
  const data = await getCompany(session.id as string);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
      <CreateJobForm
        companyAbout={data.about}
        companyLocation={data.location}
        companyLogo={data.logo}
        companyName={data.name}
        companyWebsite={data.website}
        companyXAccount={data.xAccount}
      />

      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Trusted by Industry Leaders
            </CardTitle>
            <CardDescription>
              Join thousands of companies hiring top talents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Logos */}
            <div className="grid grid-cols-3 gap-4">
              {companies.map((company) => (
                <div key={company.id}>
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <blockquote
                  key={index}
                  className="border-l-2 border-green-500 pl-4"
                >
                  <p className="text-sm text-muted-foreground italic">
                    "{testimonial.quote}"
                  </p>
                  <footer className="mt-2 text-sm font-medium">
                    - {testimonial.author}, {testimonial.company}
                  </footer>
                </blockquote>
              ))}
            </div>

            {/* We will render stats here */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.id} className="rounded-lg bg-muted p-4">
                  <h4 className="text-2xl font-bold">{stat.value}</h4>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
