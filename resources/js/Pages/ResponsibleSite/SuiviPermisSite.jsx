import React from "react";
import { usePage, Link, router } from "@inertiajs/react";  // 👈 add usePage, Link, router
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/Pages/DashboardLayout";


export default function SuiviPermisSite() {
  const { permis = [] } = usePage().props;

  const handleSign = (id) => {
    router.post(route("responsibleSite.permis.storeSignature", id));
  };

  return (
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
            <th className="p-3 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {permis.map((p) => (
            <tr key={p.id} className="text-center">
              <td className="p-3 border">{p.numero_permis}</td>
              <td className="p-3 border">
                {new Date(p.created_at).toLocaleDateString()}
              </td>
              <td className="p-3 border">{p.status || "en_attente"}</td>
             <td className="px-4 py-2">
  {p.status === "en_attente" ? (
    <Link
      href={route("responsibleSite.permis.show", p.id)} // 👈 go to form page
      className="rounded-md bg-emerald-600 px-3 py-1 text-sm text-white shadow hover:bg-emerald-700"
    >
      Signer
    </Link>
  ) : (
    <Link
      href={route("responsibleSite.permis.show", p.id)}
      className="rounded-md bg-gray-600 px-3 py-1 text-sm text-white shadow hover:bg-gray-700"
    >
      Voir
    </Link>
  )}
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
