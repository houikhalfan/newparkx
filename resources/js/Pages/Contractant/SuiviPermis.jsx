import React from "react";
import { usePage } from "@inertiajs/react";
import ContractantLayout from "@/Pages/ContractantLayout";

export default function SuiviPermis() {
  const { permis } = usePage().props;

  return (
    <ContractantLayout title="Suivi des Permis">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Suivi des Demandes de Permis</h1>
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-gray-100 text-left text-sm font-semibold">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Site</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Original</th>
                <th className="px-4 py-3">Signé</th>
                <th className="px-4 py-3">Commentaire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
  {permis.map((p) => (
    <tr key={p.id}>
      <td className="px-6 py-4">Permis d’Excavation</td>
      <td className="px-6 py-4">{p.site ? p.site.name : "—"}</td>
      <td className="px-6 py-4">{p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}</td>
      <td className="px-6 py-4">
        {p.status === "en_attente" && "En Attente"}
        {p.status === "rejete" && "Rejeté"}
        {p.status === "signe" && "Signé"}
      </td>
      <td className="px-6 py-4">
        {p.pdf_original ? (
          <a
            href={`/storage/${p.pdf_original}`}
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            Voir
          </a>
        ) : "—"}
      </td>
      <td className="px-6 py-4">
        {p.pdf_signed ? (
          <a
            href={`/storage/${p.pdf_signed}`}
            target="_blank"
            className="text-green-600 hover:underline"
          >
            Voir
          </a>
        ) : "—"}
      </td>
      <td className="px-6 py-4">{p.commentaire || "—"}</td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      </div>
    </ContractantLayout>
  );
}
