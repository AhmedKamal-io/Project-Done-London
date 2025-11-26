import Link from "next/link";
import Image from "next/image";
import DeleteInstructorButton from "./components/DeleteInstructorButton"; // 💡 المكون الجديد

// تحديد نوع بيانات المدرب
type Instructor = {
  _id: string;
  name_en: string;
  name_ar: string;
  experience_en?: string;
  image_url: string;
  [key: string]: any;
};

export default async function InstructorsPage() {
  // 1. جلب البيانات (Server Component)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/instructors`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return (
      <div className="max-w-6xl p-10 mx-auto mt-10 text-xl text-center text-red-400 rounded-lg bg-red-900/50">
                Error loading instructors data.      
      </div>
    );
  }

  const instructors: Instructor[] = (await res.json()) as Instructor[];

  return (
    // حاوية الصفحة الرئيسية
    <div className="min-h-screen py-10 text-gray-100 bg-gray-900">
      <div className="max-w-5xl p-6 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-8 border-b border-gray-700">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            All Instructors
          </h1>

          <Link
            href="/admin/home/instructors/add"
            className="px-5 py-2 text-sm font-semibold text-white transition-all duration-300 bg-indigo-600 rounded-full shadow-md hover:bg-indigo-700 hover:scale-105"
          >
            + Add Instructor
          </Link>
        </div>

        {/* Table-like list */}
        <div className="space-y-4">
          {instructors.map((inst) => (
            <div
              key={inst._id}
              className="flex items-center gap-4 p-5 transition-all duration-300 bg-gray-800 border border-gray-700 shadow rounded-xl hover:shadow-xl hover:bg-gray-800/80 group"
            >
              {/* Avatar */}
              <div className="relative">
                <Image
                  src={inst.image_url || "/placeholder.png"}
                  alt={inst.name_en}
                  width={64}
                  height={64}
                  className="object-cover w-16 h-16 transition border-2 border-gray-600 rounded-full shadow-md group-hover:border-indigo-500"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white transition group-hover:text-indigo-400">
                  {inst.name_ar}
                </h2>

                <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">
                  {inst.experience_en}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/home/instructors/edit/${inst._id}`}
                  className="px-3 py-1.5 text-sm font-medium rounded-full border border-indigo-600 
                         text-indigo-400 hover:bg-indigo-900 transition duration-200"
                >
                  Edit
                </Link>

                {/* Delete Button */}
                <DeleteInstructorButton instructorId={inst._id} />
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {instructors.length === 0 && (
          <div className="p-10 mt-12 text-center text-gray-400 border-2 border-gray-700 border-dashed rounded-xl">
            <p className="text-lg">
              No instructors found. Start by adding a new instructor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
