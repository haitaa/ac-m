import Link from "next/link";
import { Card, CardHeader } from "../ui/card";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/app/utils/format-currency";
import { formatRelativeTime } from "@/app/utils/format-relative-time";

interface iAppProps {
  job: {
    id: string;
    createdAt: Date;
    Company: {
      about: string;
      name: string;
      location: string;
      logo: string;
    };
    jobTitle: string;
    location: string;
    salaryFrom: number;
    salaryTo: number;
    employmentType: string;
  };
}

export function JobCard({ job }: iAppProps) {
  return (
    <Link href={`/job/${job.id}`}>
      <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <Image
              src={job.Company.logo}
              alt={job.Company.name}
              width={52}
              height={52}
              className="size-12 rounded-lg"
            />
            <div>
              <h1 className="text-xl md:text-2xl">{job.jobTitle}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {job.Company.name}
                </p>
                <span className="hidden md:inline text-muted-foreground">
                  |
                </span>
                <Badge className="rounded-full" variant={"secondary"}>
                  {job.employmentType}
                </Badge>
                <span className="hidden md:inline text-muted-foreground">
                  |
                </span>
                <Badge className="rounded-full">{job.location}</Badge>
                <span className="hidden md:inline text-muted-foreground">
                  |
                </span>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(job.salaryFrom)} -{" "}
                  {formatCurrency(job.salaryTo)}
                </p>
              </div>
            </div>

            <div className="md:ml-auto">
              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                <h1>{job.location}</h1>
              </div>
              <p className="text-sm text-muted-foreground md:text-right">
                {formatRelativeTime(job.createdAt)}
              </p>
            </div>
          </div>

          <p className="text-base text-muted-foreground lince-clamp-2 !mt-5">
            {job.Company.about}
          </p>
        </CardHeader>
      </Card>
    </Link>
  );
}
