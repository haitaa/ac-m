import Link from "next/link";
import { buttonVariants } from "../ui/button";
import Image from "next/image";
import Logo from "@/public/logo.png";
import { ThemeToggle } from "./theme-toggle";
import { auth } from "@/app/utils/auth";
import { UserDropdown } from "./user-dropdown";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="flex items-center justify-between py-5">
      <Link href={"/"} className="flex items-center gap-2">
        <Image src={Logo} alt="Logo" width={40} height={40} />
        <h1 className="text-2xl font-bold">
          <span className="">AC&M</span>
        </h1>
      </Link>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-5">
        <ThemeToggle />
        <Link href={"/post-job"} className={buttonVariants({ size: "lg" })}>
          Post Job
        </Link>
        {session?.user ? (
          <UserDropdown
            email={session.user.email as string}
            image={session.user.image as string}
            name={session.user.name as string}
            id={session.user.id as string}
          />
        ) : (
          <Link
            href={"/login"}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
