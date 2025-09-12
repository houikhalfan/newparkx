import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Download, 
  Calendar, 
  User, 
  Building, 
  Eye,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function VodsHistory({ vods = [] }) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    if (!q.trim()) return vods;
    const s = q.toLowerCase();
    return vods.filter(v => {
      const date = (v.date || v.created_at || '').toString().toLowerCase();
      const projet = (v.projet || '').toString().toLowerCase();
      const activite = (v.activite || '').toString().toLowerCase();
      const obs = (v.observateur || v.observer || '').toString().toLowerCase();
      return date.includes(s) || projet.includes(s) || activite.includes(s) || obs.includes(s);
    });
  }, [q, vods]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Historique des VODs</h2>
              <p className="text-emerald-100 text-sm">Consultez vos visites d'observation</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              className="w-full sm:w-80 pl-10 pr-4 py-3 rounded-xl border-2 border-white/20 bg-white/90 backdrop-blur-sm text-slate-800 placeholder-slate-500 focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-300"
              placeholder="Filtrer par date/projet/activité…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Mobile cards */}
        <div className="space-y-4 md:hidden">
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-gray-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">Aucun résultat trouvé.</p>
            </motion.div>
          )}
          {filtered.map((v, index) => {
            const pdf = pdfHref(v);
            const dl = downloadHref(v);
            return (
              <motion.div
                key={v.id ?? `${v.date}-${v.projet}-${v.activite}-${Math.random()}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl bg-gradient-to-r from-white to-slate-50 border-2 border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-500">{fmtDate(v.date || v.created_at)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{v.projet || 'Projet —'}</h3>
                    <p className="text-slate-600 mb-2">{v.activite || 'Activité —'}</p>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-500">Obs: {v.observateur || '—'}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>

                {(pdf || dl) && (
                  <div className="flex flex-wrap gap-2">
                    {pdf && (
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
                        aria-label="Voir le PDF"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Voir PDF</span>
                      </motion.a>
                    )}
                    {dl && (
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={dl}
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-slate-500 to-gray-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
                        aria-label="Télécharger le PDF"
                        download
                      >
                        <Download className="w-4 h-4" />
                        <span>Télécharger</span>
                      </motion.a>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-gray-50">
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-200">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Date</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-200">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4" />
                    <span>Projet</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-200">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Activité</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-200">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Observateur</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-200">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Actions</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-gray-100 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">Aucun résultat trouvé.</p>
                  </td>
                </tr>
              )}
              {filtered.map((v, index) => {
                const pdf = pdfHref(v);
                const dl = downloadHref(v);
                return (
                  <motion.tr
                    key={v.id ?? `${v.date}-${v.projet}-${v.activite}-${Math.random()}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="border-b border-slate-200 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-300"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="font-medium text-slate-800">{fmtDate(v.date || v.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{v.projet || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600">{v.activite || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-slate-600">{v.observateur || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {(pdf || dl) ? (
                        <div className="flex items-center gap-2">
                          {pdf && (
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              href={pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
                              aria-label="Voir le PDF"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Voir PDF</span>
                            </motion.a>
                          )}
                          {dl && (
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              href={dl}
                              className="inline-flex items-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-slate-500 to-gray-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
                              aria-label="Télécharger le PDF"
                              download
                            >
                              <Download className="w-4 h-4" />
                              <span>Télécharger</span>
                            </motion.a>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

/* Helpers */

function fmtDate(d) {
  if (!d) return '—';
  try {
    const date = new Date(d);
    return date.toLocaleDateString('fr-FR');
  } catch {
    return d;
  }
}

// Prefer URLs provided by the backend; otherwise fall back to REST-style paths
function pdfHref(v) {
  if (v?.pdf_url) return v.pdf_url;
  if (v?.urls?.pdf) return v.urls.pdf;
  return v?.id ? `/vods/${v.id}/pdf` : null;
}

function downloadHref(v) {
  if (v?.download_url) return v.download_url;
  if (v?.urls?.download) return v.urls.download;
  return v?.id ? `/vods/${v.id}/download` : null;
}