import React from "react";
import { usePage, Link } from "@inertiajs/react"; // ✅ import Link
import DashboardLayout from "@/Pages/DashboardLayout";

export default function SuiviPermis() {
  const { permis = [], flash = {} } = usePage().props;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Suivi des Permis d’Excavation
        </h1>

        {flash?.success && (
          <div className="mb-4 rounded-md bg-emerald-50 border border-emerald-200 px-4 py-3 text-emerald-700 text-sm">
            {flash.success}
          </div>
        )}

        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-left text-xs uppercase font-semibold text-gray-600">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Site</th>
                <th className="px-4 py-3">Commentaire</th>
                <th className="px-4 py-3">PDF Original</th>
                <th className="px-4 py-3">PDF Signé</th>
                <th className="px-4 py-3">Action</th> {/* ✅ New column */}
              </tr>
            </thead>
            <tbody>
              {permis.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
                    Aucun permis trouvé.
                  </td>
                </tr>
              ) : (
                permis.map((p, idx) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{p.type}</td>
                    <td className="px-4 py-2">{p.date}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          p.status === "signe"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{p.site}</td>
                    <td className="px-4 py-2">{p.commentaire || "—"}</td>

                    <td className="px-4 py-2">
                      {p.pdf_original ? (
                        <a
                          href={p.pdf_original}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 underline font-medium"
                        >
                          📄 Voir PDF
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                  

                    {/* ✅ Link to sign/show */}
                    <td className="px-4 py-2">
                      <Link
                        href={route("hseResponsible.permis.show", p.id)}
                        className="text-indigo-600 underline font-medium"
                      >
                       Signer
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
