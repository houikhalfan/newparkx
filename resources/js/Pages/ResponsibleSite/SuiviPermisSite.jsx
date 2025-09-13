import React from "react";
import { usePage, Link } from "@inertiajs/react";
import DashboardLayout from "@/Pages/DashboardLayout";

export default function SuiviPermisSite() {
  const { permis = [] } = usePage().props;

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          Permis d’excavation — Votre site
        </h1>

        <table className="w-full border text-sm bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Numéro Permis</th>
              <th className="p-3 border">Date Création</th>
              <th className="p-3 border">Statut</th>
              <th className="p-3 border">PDF</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {permis.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500 italic">
                  Aucun permis trouvé.
                </td>
              </tr>
            ) : (
              permis.map((p) => (
                <tr key={p.id} className="text-center border-t">
                  {/* Numéro Permis */}
                  <td className="p-3 border">{p.numero_permis}</td>

                  {/* Date */}
                  <td className="p-3 border">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>

                  {/* Statut */}
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        p.status === "signe"
                          ? "bg-emerald-100 text-emerald-700"
                          : p.status === "en_cours"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.status || "en_attente"}
                    </span>
                  </td>

                  {/* PDF unique */}
                  <td className="p-3 border">
                    {p.pdf_signed || p.pdf_original ? (
                      <a
                        href={p.pdf_signed || p.pdf_original}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white shadow hover:bg-blue-700"
                      >
                        Voir PDF
                      </a>
                    ) : (
                      <span className="text-gray-400">Non disponible</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="p-3 border">
                    {p.status === "en_attente" ? (
                      <Link
                        href={route("responsibleSite.permis.show", p.id)}
                        className="rounded-md bg-emerald-600 px-3 py-1 text-sm text-white shadow hover:bg-emerald-700"
                      >
                        Signer
                      </Link>
                    ) : (
                      <span className="text-gray-400 italic">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
