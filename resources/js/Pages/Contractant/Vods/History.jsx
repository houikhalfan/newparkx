import React, { useMemo, useState } from "react";

export default function VodsHistory({ vods = [] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return vods;
    const s = q.toLowerCase();
    return vods.filter((v) => {
      const date = (v.date || v.created_at || "").toString().toLowerCase();
      const projet = (v.projet || "").toString().toLowerCase();
      const activite = (v.activite || "").toString().toLowerCase();
      const obs = (v.observateur || v.observer || "").toString().toLowerCase();
      return (
        date.includes(s) ||
        projet.includes(s) ||
        activite.includes(s) ||
        obs.includes(s)
      );
    });
  }, [q, vods]);

  return (
    <div
      className="p-6 rounded-2xl shadow-xl border border-gray-200 
                 bg-white/95 dark:bg-cyan-950/20
                 transition-colors duration-300 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Historique des VODs
        </h2>
        <input
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-cyan-600/40 
                     bg-gray-50 dark:bg-cyan-900/30 text-gray-800 dark:text-gray-100
                     focus:ring-2 focus:ring-cyan-500 w-full sm:w-80"
          placeholder="Filtrer par date / projet / activité…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* Mobile cards */}
      <ul className="space-y-4 md:hidden">
        {filtered.length === 0 && (
          <li className="text-sm text-gray-500 dark:text-gray-300">
            Aucun résultat.
          </li>
        )}
        {filtered.map((v) => {
          const pdf = pdfHref(v);
          const dl = downloadHref(v);
          return (
            <li
              key={v.id ?? `${v.date}-${v.projet}-${v.activite}-${Math.random()}`}
              className="p-4 rounded-xl border border-gray-200 dark:border-cyan-600/30 
                         bg-gray-50 dark:bg-cyan-950/10 shadow-sm space-y-2"
            >
              <div className="text-sm text-gray-500 dark:text-gray-300">
                {fmtDate(v.date || v.created_at)}
              </div>
              <div className="font-semibold text-gray-800 dark:text-gray-100">
                {v.projet || "Projet —"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-200">
                {v.activite || "Activité —"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Obs : {v.observateur || "—"}
              </div>

              {(pdf || dl) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {pdf && (
                    <a
                      href={pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 rounded-lg 
                                 border border-cyan-400 text-cyan-700 bg-cyan-50 
                                 hover:bg-cyan-100 text-xs font-medium 
                                 dark:border-cyan-500 dark:text-cyan-200 dark:bg-cyan-900/30"
                    >
                      Voir PDF
                    </a>
                  )}
                  {dl && (
                    <a
                      href={dl}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg 
                                 border border-gray-300 text-gray-700 bg-gray-50 
                                 hover:bg-gray-100 text-xs font-medium 
                                 dark:border-cyan-600/40 dark:text-gray-100 dark:bg-cyan-950/20"
                      download
                    >
                      Télécharger
                    </a>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 dark:border-cyan-600/30 shadow">
       <table className="min-w-full divide-y divide-white/20">
  <thead className="bg-white/10">
    <tr>
      <th className="px-4 py-3 text-left text-sm font-semibold text-white">
        Date
      </th>
      <th className="px-4 py-3 text-left text-sm font-semibold text-white">
        Projet
      </th>
      <th className="px-4 py-3 text-left text-sm font-semibold text-white">
        Activité
      </th>
      <th className="px-4 py-3 text-left text-sm font-semibold text-white">
        Observateur
      </th>
      <th className="px-4 py-3 text-left text-sm font-semibold text-white">
        Actions
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-white/10">
    {vods.map((vod) => (
      <tr key={vod.id} className="hover:bg-white/5">
        <td className="px-4 py-3 text-sm text-white">{vod.date}</td>
        <td className="px-4 py-3 text-sm text-white">{vod.projet || "—"}</td>
        <td className="px-4 py-3 text-sm text-white">{vod.activite}</td>
        <td className="px-4 py-3 text-sm text-white">{vod.observateur}</td>
        <td className="px-4 py-3 text-sm flex gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-xs">
            Voir PDF
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs">
            Télécharger
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>
    </div>
  );
}

/* Helpers */
function fmtDate(d) {
  if (!d) return "—";
  try {
    const date = new Date(d);
    return date.toLocaleDateString("fr-FR");
  } catch {
    return d;
  }
}
function pdfHref(v) {
  if (v?.pdf_url) return v.pdf_url;
  if (v?.urls?.pdf) return v.urls.pdf;
  return v?.id ? `/contractant/vods/${v.id}/pdf` : null;
}
function downloadHref(v) {
  if (v?.download_url) return v.download_url;
  if (v?.urls?.download) return v.urls.download;
  return v?.id ? `/contractant/vods/${v.id}/download` : null;
}
