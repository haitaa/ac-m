import { UsersIcon, ChartBarIcon, CogIcon } from "@heroicons/react/24/outline";
import { prisma } from "@/app/utils/db"; // yolunuzu projenize göre güncelleyin
import React from "react";

export default async function AdminPage() {
  // Dinamik veritabanı sorguları
  const totalUsers = await prisma.user.count();
  const newUsers = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
  });

  const stats = [
    {
      label: "Toplam Kullanıcı",
      value: totalUsers.toLocaleString(),
      icon: UsersIcon,
    },
    {
      label: "Son 7 Gün Kayıt",
      value: newUsers.toString(),
      icon: ChartBarIcon,
    },
    {
      label: "Aktif Kullanıcı",
      value: "2",
      icon: ChartBarIcon,
    },
    { label: "Ayarlar", value: "3", icon: CogIcon },
  ];

  // Son eklenen kullanıcılar
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, name: true, email: true, username: true },
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow flex flex-col">
        <div className="h-16 flex items-center justify-center text-2xl font-semibold border-b">
          Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a
            href="#"
            className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
          >
            <ChartBarIcon className="h-6 w-6 mr-3" />
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
          >
            <UsersIcon className="h-6 w-6 mr-3" />
            Kullanıcılar
          </a>
          <a
            href="#"
            className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
          >
            <CogIcon className="h-6 w-6 mr-3" />
            Ayarlar
          </a>
        </nav>
        <div className="p-4 border-t text-sm text-gray-500">v1.0.0</div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex items-center"
            >
              <Icon className="h-8 w-8 text-indigo-500 mr-4" />
              <div>
                <p className="text-gray-600">{label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-800">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Placeholders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-medium mb-4">Kayıt Trendi</h2>
            <div className="h-48 bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">
              Grafik Yer Tutucu
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-medium mb-4">
              Aktif Kullanıcı Dağılımı
            </h2>
            <div className="h-48 bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">
              Grafik Yer Tutucu
            </div>
          </div>
        </div>

        {/* Users Table */}
        <section>
          <h2 className="text-2xl font-medium text-gray-700 mb-4">
            Son Kullanıcılar
          </h2>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                    Kullanıcı Adi
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                    Rol
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                    Durum
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase">
                    Aksiyon
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3">{user.id}</td>
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{"Aktif"}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                        Düzenle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
