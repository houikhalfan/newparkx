import React from "react";
import { usePage, Link } from "@inertiajs/react";

export default function SuiviPermisSite() {
  const { permis = [] } = usePage().props;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Permis d’excavation — Votre site</h1>

      <table className="w-full border text-sm bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Numéro Permis</th>
            <th className="p-3 border">Date Création</th>
            <th className="p-3 border">Statut</th>
            <th className="p-3 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {permis.map((p) => (
            <tr key={p.id} className="text-center">
              <td className="p-3 border">{p.numero_permis}</td>
              <td className="p-3 border">{new Date(p.created_at).toLocaleDateString()}</td>
              <td className="p-3 border">{p.status || "En attente"}</td>
              <td className="p-3 border">
            <Link
  href={route("responsibleSite.permis.show", p.id)}   // ✅ matches route/web.php
  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
>
  Signer
</Link>


              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
