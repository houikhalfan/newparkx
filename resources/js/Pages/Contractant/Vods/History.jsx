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
      className="p-6 rounded-3xl shadow-xl border border-blue-200/50 
                 bg-gradient-to-br from-white via-blue-50 to-purple-50 
                 backdrop-blur-xl space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-800">
          Historique des VODs
        </h2>
        <input
          className="px-4 py-3 rounded-xl border border-gray-300 
                     bg-white text-gray-800
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-80"
          placeholder="Filtrer par date / projet / activité…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* Mobile cards */}
      <ul className="space-y-4 md:hidden">
        {filtered.length === 0 && (
          <li className="text-sm text-gray-600">
            Aucun résultat.
          </li>
        )}
        {filtered.map((v) => {
          const pdf = pdfHref(v);
          const dl = downloadHref(v);
          return (
            <li
              key={
                v.id ??
                `${v.date}-${v.projet}-${v.activite}-${Math.random()}`
              }
              className="p-4 rounded-2xl border border-blue-200/50 
                         bg-white/90 shadow-lg space-y-2"
            >
              <div className="text-sm text-gray-600">
                {fmtDate(v.date || v.created_at)}
              </div>
              <div className="font-semibold text-gray-800">
                {v.projet || "Projet —"}
              </div>
              <div className="text-sm text-gray-600">
                {v.activite || "Activité —"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Obs : {v.observateur || "—"}
              </div>

              {(pdf || dl) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {pdf && (
                    <a
                      href={pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-lg 
                                 bg-gradient-to-r from-blue-500 to-purple-500 
                                 text-white text-xs font-semibold shadow-lg hover:scale-105 transition"
                    >
                      Voir PDF
                    </a>
                  )}
                  {dl && (
                    <a
                      href={dl}
                      className="inline-flex items-center px-4 py-2 rounded-lg 
                                 bg-gray-100 text-gray-700 
                                 text-xs font-semibold hover:bg-gray-200 transition"
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
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-blue-200/50 shadow-lg">
        <table className="min-w-full text-sm bg-white/90 backdrop-blur-xl">
          <thead>
            <tr className="text-left text-gray-700 border-b border-gray-200">
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Projet</th>
              <th className="py-3 px-4 font-semibold">Activité</th>
              <th className="py-3 px-4 font-semibold">Observateur</th>
              <th className="py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-gray-600"
                >
                  Aucun résultat.
                </td>
              </tr>
            )}
            {filtered.map((v) => {
              const pdf = pdfHref(v);
              const dl = downloadHref(v);
              return (
                <tr
                  key={
                    v.id ??
                    `${v.date}-${v.projet}-${v.activite}-${Math.random()}`
                  }
                  className="border-b last:border-0 border-gray-200 hover:bg-blue-50/50 transition"
                >
                  <td className="py-3 px-4">{fmtDate(v.date || v.created_at)}</td>
                  <td className="py-3 px-4">{v.projet || "—"}</td>
                  <td className="py-3 px-4">{v.activite || "—"}</td>
                  <td className="py-3 px-4">{v.observateur || "—"}</td>
                  <td className="py-3 px-4">
                    {(pdf || dl) ? (
                      <div className="flex items-center gap-2">
                        {pdf && (
                          <a
                            href={pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 rounded-lg 
                                       bg-gradient-to-r from-blue-500 to-purple-500 
                                       text-white text-xs font-semibold shadow-lg hover:scale-105 transition"
                          >
                            Voir PDF
                          </a>
                        )}
                        {dl && (
                          <a
                            href={dl}
                            className="inline-flex items-center px-4 py-2 rounded-lg 
                                       bg-gray-100 text-gray-700 
                                       text-xs font-semibold hover:bg-gray-200 transition"
                            download
                          >
                            Télécharger
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
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
