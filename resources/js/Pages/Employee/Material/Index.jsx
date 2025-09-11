import React from "react";
import { usePage, Link } from "@inertiajs/react";
import DashboardLayout from "@/Pages/DashboardLayout";

export default function EmployeeMatIndex() {
  const { items = { data: [], links: [] }, q = "", s = "" } = usePage().props;

  return (
    <DashboardLayout title="Ressources matériel (assignées)">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">Ressources matérielles</h1>
        <p className="text-sm text-gray-600 mt-1">
          Recherchez, filtrez et suivez les demandes qui vous sont assignées.
        </p>
      </div>

      {/* Search & Filter */}
      <form method="GET" className="mb-4 flex flex-wrap items-center gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Recherche (site, contractant, matricule)…"
          className="rounded-lg border px-3 py-2 text-sm w-64"
        />
        <select
          name="s"
          defaultValue={s}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">Tous</option>
          <option value="pending">En attente</option>
          <option value="accepted">Accepté</option>
          <option value="rejected">Rejeté</option>
        </select>
        <button className="rounded-lg bg-black text-white px-3 py-2 text-sm">
          Filtrer
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full text-sm border rounded-lg">
          <thead>
            <tr className="text-left text-gray-500 border-b bg-gray-50">
              <th className="px-3 py-2">Site</th>
              <th className="px-3 py-2">Contractant</th>
              <th className="px-3 py-2">Matricule</th>
              <th className="px-3 py-2">Statut</th>
              <th className="px-3 py-2">Créé le</th>
              <th className="px-3 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.data.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 text-center text-gray-500"
                >
                  Aucun résultat.
                </td>
              </tr>
            ) : (
              items.data.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-3 py-2">{r.site?.name || "—"}</td>
                  <td className="px-3 py-2">
                    <div className="font-medium">{r.contractor?.name}</div>
                    <div className="text-xs text-gray-500">
                      {r.contractor?.email}
                    </div>
                  </td>
                  <td className="px-3 py-2">{r.matricule || "—"}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-3 py-2">
                    {new Date(r.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      href={route("employee.materiel.show", r.id)}
                      className="px-3 py-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                    >
                      Ouvrir
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {items.links?.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {items.links.map((link, i) => (
            <Link
              key={i}
              href={link.url || "#"}
              className={`px-3 py-1 rounded text-sm ${
                link.active
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: { text: "En attente", cls: "bg-yellow-100 text-yellow-800" },
    accepted: { text: "Accepté", cls: "bg-green-100 text-green-800" },
    rejected: { text: "Rejeté", cls: "bg-red-100 text-red-800" },
  };
  const { text, cls } = map[status] || map.pending;
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${cls}`}>
      {text}
    </span>
  );
}
