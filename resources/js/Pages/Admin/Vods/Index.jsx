// resources/js/Pages/Admin/Vods/Index.jsx
import React from "react";
import { usePage, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Download } from "lucide-react";

/* ---------- helpers (same vibe as Material/Signatures) ---------- */
function Th({ children, className = "" }) {
  return (
    <th className={`px-4 py-3 text-xs font-medium uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}

function fmtDate(d, withTime = false) {
  if (!d) return "—";
  try {
    const date = new Date(d);
    return withTime
      ? date.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "medium" })
      : date.toLocaleDateString("fr-FR");
  } catch {
    return d || "—";
  }
}

/* Friendly file link (handles absolute URLs too) */
function FileLink({ url, label = "Voir le PDF" }) {
  if (!url) return <span className="text-gray-400">—</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md px-2 py-1"
      title={url}
    >
      <Download size={16} />
      <span className="text-xs font-medium">{label}</span>
    </a>
  );
}

/* Localize pagination labels */
function localizePagination(label) {
  return String(label)
    .replace(/Previous|&laquo;\s*Previous/gi, "Précédent")
    .replace(/Next|Next\s*&raquo;/gi, "Suivant");
}

/* Normalize `vods` which can be a paginator or an array */
function normalizeVods(input) {
  if (!input) return { data: [], links: [] };
  if (Array.isArray(input)) return { data: input, links: [] };
  return {
    data: input.data || [],
    links: input.links || [],
  };
}

export default function AdminVodsIndex() {
  const props = usePage().props || {};
  const { vods, filters } = props;

  const list = normalizeVods(vods);
  const q = (filters && filters.q) || "";

  return (
    <div className="-m-4 md:-m-8 bg-white min-h-[calc(100vh-3.5rem)] p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">VODs</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Recherchez et visualisez les Visites d’Observation. 
        </p>
      </div>

      {/* Filters (search) */}
      <form method="GET" className="mb-5 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-96">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-3.6-3.6" />
          </svg>
          <input
            name="q"
            defaultValue={q}
            className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
            placeholder="Rechercher (utilisateur, projet, activité, entreprise…)"
          />
        </div>

        <button
          className="inline-flex items-center gap-2 rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          Filtrer
        </button>
      </form>

      {/* Table card */}
      <div className="card-frame overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-sm">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="text-left text-gray-500/90 border-b">
                <Th>Observateur</Th>
                <Th>Date d’émission</Th>
                <Th>Date de la visite</Th>
                <Th>Projet</Th>
                <Th>Entreprises observées</Th>
                <Th className="pr-4 text-center">PDF</Th>
              </tr>
            </thead>

            <tbody>
              {list.data.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Aucune donnée.
                  </td>
                </tr>
              )}

              {list.data.map((v, idx) => {
                const entreprises = Array.isArray(v.entreprises) && v.entreprises.length
                  ? v.entreprises.join(", ")
                  : Array.isArray(v.entreprise_observee) && v.entreprise_observee.length
                  ? v.entreprise_observee.join(", ")
                  : "—";

                const emitted = fmtDate(v.emitted_at ?? v.created_at, true);
                const visit   = fmtDate(v.visit_date ?? v.date);

                return (
                  <tr
                    key={v.id}
                    className={`border-b last:border-0 ${idx % 2 ? "bg-gray-50/40" : ""} hover:bg-gray-50`}
                  >
                    <Td>
                      <div className="font-medium">{v.user?.name || "—"}</div>
                      <div className="text-xs text-gray-500">{v.user?.email || ""}</div>
                    </Td>
                    <Td>{emitted}</Td>
                    <Td>{visit}</Td>
                    <Td>{v.projet || "—"}</Td>
                    <Td>{entreprises}</Td>
                    <Td className="text-center pr-4">
                      <FileLink url={v.pdf_url} label="Télécharger le PDF" />
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination (same style as Material) */}
        {list.links.length > 0 && (
          <div className="p-4 flex flex-wrap items-center gap-2 justify-end text-sm">
            {list.links.map((l, i) => (
              <Link
                key={i}
                href={l.url || "#"}
                preserveScroll
                preserveState
                className={[
                  "rounded-md px-3 py-1.5",
                  l.active ? "bg-black text-white" : (l.url ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-gray-100 text-gray-400 cursor-default"),
                ].join(" ")}
                dangerouslySetInnerHTML={{ __html: localizePagination(l.label) }}
              />
            ))}
          </div>
        )}
      </div>

      {/* card look */}
      <style>{`
        .card-frame {
          background-color: #ffffff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 20px;
          box-shadow:
            0 1px 0 rgba(0,0,0,0.04),
            0 8px 24px -12px rgba(0,0,0,0.18);
        }
      `}</style>
    </div>
  );
}

AdminVodsIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>;
