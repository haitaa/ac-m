import { Button } from "@/components/ui/button";
import { Building2, UserRound } from "lucide-react";

type UserSelectionType = "company" | "jobSeeker";

interface UserTypeSelectionProps {
  onSelect: (type: UserSelectionType) => void;
}

export function UserTypeSelection({ onSelect }: UserTypeSelectionProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Welcome! Let&apos;s get started</h2>
        <p className="text-muted-foreground">
          Choose how you would like to use our platform.
        </p>
      </div>

      <div className="grid gap-4">
        <Button
          onClick={() => onSelect("company")}
          className="w-full h-auto p-6 items-center gap-4 border-2 transition-all duration-200 hover:border-green-500 bg-gray-900"
        >
          <div className="size-12 rounded-full flex items-center justify-center">
            <Building2 className="size-6 text-green-500" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-lg text-green-500">
              Company / Organization
            </h3>
            <p>Post job and find exceptional talents.</p>
          </div>
        </Button>

        <Button
          onClick={() => onSelect("jobSeeker")}
          className="w-full h-auto p-6 items-center gap-4 border-2 transition-all duration-200 hover:border-green-500 bg-gray-900"
        >
          <div className="size-12 rounded-full flex items-center justify-center">
            <UserRound className="size-6 text-green-500" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-lg text-green-500">Job Seeker</h3>
            <p className="">Find your dream job opportunity.</p>
          </div>
        </Button>
      </div>
    </div>
  );
}
