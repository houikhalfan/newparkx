// resources/js/Pages/Admin/Vods/Index.jsx
import React, { useEffect, useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/Layouts/AdminLayout";
import { 
  Download, 
  Search, 
  FileText, 
  Calendar, 
  User, 
  Building2, 
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin
} from "lucide-react";

/* ---------- Enhanced Components ---------- */
function Th({ children, className = "" }) {
  return (
    <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300 ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return <td className={`px-6 py-4 align-middle ${className}`}>{children}</td>;
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

function EnhancedFileLink({ url, label = "Voir le PDF" }) {
  if (!url) return <span className="text-slate-400">—</span>;
  return (
    <motion.a
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg px-3 py-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
      title={url}
    >
      <Download size={16} />
      <span className="text-sm">{label}</span>
    </motion.a>
  );
}

function localizePagination(label) {
  return String(label)
    .replace(/Previous|&laquo;\s*Previous/gi, "Précédent")
    .replace(/Next|Next\s*&raquo;/gi, "Suivant");
}

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
  const [isLoaded, setIsLoaded] = useState(false);

  const list = normalizeVods(vods);
  const q = (filters && filters.q) || "";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 p-6 md:p-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg"
            >
              <FileText className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                Visites d'Observation
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                Recherchez et visualisez les VODs soumises par les utilisateurs
              </p>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10" />
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg"
                >
                  <Search className="w-5 h-5 text-white" />
                </motion.div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recherche et filtres</h2>
              </div>
              
              <form method="GET" className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            name="q"
            defaultValue={q}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 pl-12 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Rechercher (utilisateur, projet, activité, entreprise…)"
          />
        </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 to-blue-900 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Filter className="w-4 h-4" />
                  Filtrer
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Enhanced VODs Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg"
        >
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg"
                >
                  <Eye className="w-5 h-5 text-white" />
                </motion.div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Liste des VODs</h2>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-sm font-medium">
                  {list.data.length} VOD{list.data.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

        <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-700">
                <tr className="text-left text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-600">
                <Th>Observateur</Th>
                  <Th>Date d'émission</Th>
                <Th>Date de la visite</Th>
                <Th>Projet</Th>
                <Th>Entreprises observées</Th>
                  <Th className="pr-6 text-center">PDF</Th>
              </tr>
            </thead>

            <tbody>
                <AnimatePresence>
              {list.data.length === 0 && (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b last:border-0"
                    >
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                            <FileText className="w-8 h-8 text-slate-400" />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-lg">Aucune VOD trouvée</p>
                          <p className="text-slate-400 dark:text-slate-500 text-sm">Aucune visite d'observation n'a été soumise</p>
                        </div>
                  </td>
                    </motion.tr>
              )}

              {list.data.map((v, idx) => {
                const entreprises = Array.isArray(v.entreprises) && v.entreprises.length
                  ? v.entreprises.join(", ")
                  : Array.isArray(v.entreprise_observee) && v.entreprise_observee.length
                  ? v.entreprise_observee.join(", ")
                  : "—";

                const emitted = fmtDate(v.emitted_at ?? v.created_at, true);
                    const visit = fmtDate(v.visit_date ?? v.date);

                return (
                      <motion.tr
                    key={v.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                          idx % 2 ? "bg-slate-50/30 dark:bg-slate-800/30" : ""
                        }`}
                  >
                    <Td>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {v.user?.name?.charAt(0) || "?"}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white">{v.user?.name || "—"}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">{v.user?.email || ""}</div>
                            </div>
                          </div>
                        </Td>
                        
                        <Td>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-900 dark:text-white">{emitted}</span>
                          </div>
                        </Td>
                        
                        <Td>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-900 dark:text-white">{visit}</span>
                          </div>
                        </Td>
                        
                        <Td>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {v.projet || "—"}
                          </span>
                        </Td>
                        
                        <Td>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-900 dark:text-white truncate max-w-[200px]" title={entreprises}>
                              {entreprises}
                            </span>
                          </div>
                    </Td>
                        
                        <Td className="text-center pr-6">
                          <EnhancedFileLink url={v.pdf_url} label="Télécharger" />
                    </Td>
                      </motion.tr>
                );
              })}
                </AnimatePresence>
            </tbody>
          </table>
        </div>

          {/* Enhanced Pagination */}
        {list.links.length > 0 && (
            <div className="p-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-wrap items-center gap-2 justify-center">
            {list.links.map((l, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
              <Link
                href={l.url || "#"}
                preserveScroll
                preserveState
                className={[
                        "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                        l.active 
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                          : l.url 
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300" 
                            : "bg-slate-100 text-slate-400 cursor-default dark:bg-slate-700 dark:text-slate-500"
                ].join(" ")}
                dangerouslySetInnerHTML={{ __html: localizePagination(l.label) }}
              />
                  </motion.div>
            ))}
              </div>
          </div>
        )}
        </motion.div>
      </div>
    </div>
  );
}

AdminVodsIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>;
