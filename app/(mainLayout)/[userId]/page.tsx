import { auth } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getUser(userId: string) {
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      bio: true,
      about: true,
      JobSeeker: {
        select: {
          resume: true,
        },
      },
    },
  });

  if (!userData) {
    return notFound();
  }

  return userData;
}

type Params = Promise<{ userId: string }>;
export default async function UserProfilePage({ params }: { params: Params }) {
  const session = await auth();

  const user = await getUser(session?.user?.id as string);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Kapak Alanı */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-lg"></div>
        <div className="absolute left-4 bottom-[-50px]">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name!}
                width={128}
                height={128}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
          </div>
        </div>
      </div>
      <div className="mt-16 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          {user.bio && <p className="text-gray-600">@{user.bio}</p>}
        </div>
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Connect
          </button>
          <button className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
            Message
          </button>
        </div>
      </div>

      {/* Hakkında Bölümü */}
      {/* {user.about && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold border-b pb-2">About</h2>
          <p className="mt-4 text-gray-700">{user.about}</p>
        </section>
      )} */}
      {/* Deneyim Bölümü */}
      {/* {jobSeeker?.experience && jobSeeker.experience.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold border-b pb-2">Experience</h2>
          <div className="mt-4 space-y-4">
            {jobSeeker.experience.map((exp: any, index: number) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:shadow transition"
              >
                <h3 className="text-xl font-bold">{exp.position}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-gray-500 text-sm">{exp.duration}</p>
                {exp.description && (
                  <p className="mt-2 text-gray-700">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )} */}
      {/* Eğitim Bölümü */}
      {/* {jobSeeker?.education && jobSeeker.education.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold border-b pb-2">Education</h2>
          <div className="mt-4 space-y-4">
            {jobSeeker.education.map((edu: any, index: number) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:shadow transition"
              >
                <h3 className="text-xl font-bold">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-gray-500 text-sm">{edu.duration}</p>
              </div>
            ))}
          </div>
        </section>
      )} */}
      {/* Beceriler Bölümü */}
      {/* {jobSeeker?.skills && jobSeeker.skills.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold border-b pb-2">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {jobSeeker.skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )} */}
    </div>
  );
}
