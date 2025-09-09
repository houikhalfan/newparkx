// resources/js/Pages/Admin/Material/Index.jsx
import React from "react";
import { usePage, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Download } from "lucide-react";

/* --- helpers (same style as Signatures) --- */
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
function StatusBadge({ s }) {
  const map = {
    pending:  { bg: "bg-amber-100",  text: "text-amber-700",  label: "En attente" },
    accepted: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Acceptée" },
    rejected: { bg: "bg-rose-100",    text: "text-rose-700",   label: "Refusée"  },
  };
  const m = map[s] || { bg: "bg-gray-100", text: "text-gray-700", label: s || "—" };
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${m.bg} ${m.text}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {m.label}
    </span>
  );
}

function fmt(d) {
  try {
    return new Date(d).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "medium" });
  } catch { return d || "—"; }
}

/* --- friendly download link --- */
function FileLink({ path, kind = "auto" }) {
  if (!path) return <span className="text-gray-400">—</span>;
  const url = `/storage/${String(path).replace(/^\/+/, "")}`;
  const label = kind === "auto" ? buildLabelFromExt(path) : `Télécharger — ${kind}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md px-2 py-1"
      download
      title={path}
    >
      <Download size={16} />
      <span className="text-xs font-medium">{label}</span>
    </a>
  );
}
function buildLabelFromExt(p) {
  const ext = (p.split(".").pop() || "").toLowerCase();
  const map = {
    pdf: "PDF",
    doc: "DOC",
    docx: "DOCX",
    png: "Image",
    jpg: "Image",
    jpeg: "Image",
  };
  return `Télécharger ${map[ext] || "le fichier"}`;
}

export default function AdminMaterialIndex() {
  // Expecting: items (Laravel paginator), q & s for filters
  const { items = { data: [], links: [] }, q = "", s = "" } = usePage().props;

  return (
    <div className="-m-4 md:-m-8 bg-white min-h-[calc(100vh-3.5rem)] p-4 md:p-8">
      {/* En-tête (comme Signatures) */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Ressources matériel — demandes
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Recherchez, filtrez et suivez les demandes envoyées par les contractants.
        </p>
      </div>

      {/* Filtres (même barre que Signatures) */}
      <form method="GET" className="mb-5 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-80">
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
            placeholder="Rechercher (contractant, email, site)…"
          />
        </div>

        <select
          name="s"
          defaultValue={s}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          title="Filtrer par statut"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="accepted">Acceptées</option>
          <option value="rejected">Refusées</option>
        </select>

        <button className="inline-flex items-center gap-2 rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90">
          Filtrer
        </button>
      </form>

      {/* Tableau (même card-frame et table styling que Signatures) */}
      <div className="card-frame overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-sm">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="text-left text-gray-500/90 border-b">
                <Th>Site</Th>
                <Th>Contractant</Th>
                <Th>Statut</Th>
                <Th>Créé le</Th>
                <Th className="text-center">Contrôle réglementaire</Th>
                <Th className="text-center">Assurance</Th>
                <Th className="text-center">Habilitation</Th>
                <Th className="text-center pr-4">Rapport de conformité</Th>
              </tr>
            </thead>

            <tbody>
              {items.data.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">Aucune demande.</td>
                </tr>
              )}

              {items.data.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`border-b last:border-0 ${idx % 2 ? "bg-gray-50/40" : ""} hover:bg-gray-50`}
                >
                  <Td>{row.site?.name ?? "—"}</Td>

                  <Td>
                    <div className="font-medium">{row.contractor?.name ?? "—"}</div>
                    <div className="text-xs text-gray-500">{row.contractor?.email || ""}</div>
                  </Td>

                  <Td><StatusBadge s={row.status} /></Td>
                  <Td>{fmt(row.created_at)}</Td>

                  <Td className="text-center">
                    <FileLink path={row.controle_reglementaire_path} kind="auto" />
                  </Td>
                  <Td className="text-center">
                    <FileLink path={row.assurance_path} kind="auto" />
                  </Td>
                  <Td className="text-center">
                    <FileLink path={row.habilitation_conducteur_path} kind="auto" />
                  </Td>
                  <Td className="text-center pr-4">
                    <FileLink path={row.rapports_conformite_path} kind="auto" />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination (même style que Signatures) */}
        {items.links?.length > 0 && (
          <div className="p-4 flex flex-wrap items-center gap-2 justify-end text-sm">
            {items.links.map((l, i) => (
              <Link
                key={i}
                href={l.url || "#"}
                className={[
                  "rounded-md px-3 py-1.5",
                  l.active ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700",
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

AdminMaterialIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>;

/* --- extras --- */
function localizePagination(label) {
  return String(label)
    .replace(/Previous|&laquo;\s*Previous/gi, "Précédent")
    .replace(/Next|Next\s*&raquo;/gi, "Suivant");
}
