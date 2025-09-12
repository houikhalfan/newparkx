import React, { useEffect, useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/Layouts/AdminLayout";
import { 
  Download, 
  Search, 
  Filter, 
  Package, 
  Building2, 
  User, 
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Hash
} from "lucide-react";

/* --- Enhanced Components --- */
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

function EnhancedStatusBadge({ s }) {
  const map = {
    pending: { 
      bg: "bg-amber-100 dark:bg-amber-900/30", 
      text: "text-amber-700 dark:text-amber-300", 
      label: "En attente",
      icon: AlertCircle
    },
    accepted: { 
      bg: "bg-emerald-100 dark:bg-emerald-900/30", 
      text: "text-emerald-700 dark:text-emerald-300", 
      label: "Acceptée",
      icon: CheckCircle
    },
    rejected: { 
      bg: "bg-rose-100 dark:bg-rose-900/30", 
      text: "text-rose-700 dark:text-rose-300", 
      label: "Refusée",
      icon: XCircle
    },
  };
  
  const m = map[s] || { 
    bg: "bg-gray-100 dark:bg-gray-700", 
    text: "text-gray-700 dark:text-gray-300", 
    label: s || "—",
    icon: AlertCircle
  };
  
  const Icon = m.icon;
  
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${m.bg} ${m.text} shadow-sm`}
    >
      <Icon className="w-3 h-3" />
      {m.label}
    </motion.span>
  );
}

function fmt(d) {
  try {
    return new Date(d).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "medium" });
  } catch {
    return d || "—";
  }
}

function EnhancedFileLink({ path, kind = "auto" }) {
  if (!path) return <span className="text-slate-400">—</span>;
  const url = `/storage/${String(path).replace(/^\/+/, "")}`;
  const label = kind === "auto" ? buildLabelFromExt(path) : `Télécharger — ${kind}`;
  return (
    <motion.a
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg px-3 py-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
      download
      title={path}
    >
      <Download size={16} />
      <span className="text-sm">{label}</span>
    </motion.a>
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

function localizePagination(label) {
  return String(label)
    .replace(/Previous|&laquo;\s*Previous/gi, "Précédent")
    .replace(/Next|Next\s*&raquo;/gi, "Suivant");
}

export default function AdminMaterialIndex() {
  const { items = { data: [], links: [] }, q = "", s = "" } = usePage().props;
  const [isLoaded, setIsLoaded] = useState(false);

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
              <Package className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                Demandes Matériel
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                Recherchez, filtrez et suivez les demandes de ressources matérielles
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
                    placeholder="Rechercher (contractant, email, site, matricule)…"
                  />
                </div>

                <select
                  name="s"
                  defaultValue={s}
                  className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  title="Filtrer par statut"
                >
                  <option value="">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="accepted">Acceptées</option>
                  <option value="rejected">Refusées</option>
                </select>

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

        {/* Enhanced Material Requests Table */}
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
                  <FileText className="w-5 h-5 text-white" />
                </motion.div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Liste des demandes</h2>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-sm font-medium">
                  {items.data.length} demande{items.data.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1400px] w-full text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-700">
                <tr className="text-left text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-600">
                  <Th>Site</Th>
                  <Th>Contractant</Th>
                  <Th>Matricule</Th>
                  <Th>Statut</Th>
                  <Th>Créé le</Th>
                  <Th className="text-center">Contrôle réglementaire</Th>
                  <Th className="text-center">Assurance</Th>
                  <Th className="text-center">Habilitation</Th>
                  <Th className="text-center pr-6">Rapport de conformité</Th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {items.data.length === 0 && (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b last:border-0"
                    >
                      <td colSpan={9} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-slate-400" />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-lg">Aucune demande trouvée</p>
                          <p className="text-slate-400 dark:text-slate-500 text-sm">Aucune demande de matériel n'a été soumise</p>
                        </div>
                      </td>
                    </motion.tr>
                  )}

                  {items.data.map((row, idx) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        idx % 2 ? "bg-slate-50/30 dark:bg-slate-800/30" : ""
                      }`}
                    >
                      <Td>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-slate-900 dark:text-white">{row.site?.name ?? "—"}</span>
                        </div>
                      </Td>
                      
                      <Td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {row.contractor?.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">{row.contractor?.name ?? "—"}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{row.contractor?.email || ""}</div>
                          </div>
                        </div>
                      </Td>
                      
                      <Td>
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-900 dark:text-white">{row.matricule || "—"}</span>
                        </div>
                      </Td>
                      
                      <Td><EnhancedStatusBadge s={row.status} /></Td>
                      
                      <Td>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900 dark:text-white">{fmt(row.created_at)}</span>
                        </div>
                      </Td>

                      <Td className="text-center">
                        <EnhancedFileLink path={row.controle_reglementaire_path} kind="auto" />
                      </Td>
                      <Td className="text-center">
                        <EnhancedFileLink path={row.assurance_path} kind="auto" />
                      </Td>
                      <Td className="text-center">
                        <EnhancedFileLink path={row.habilitation_conducteur_path} kind="auto" />
                      </Td>
                      <Td className="text-center pr-6">
                        <EnhancedFileLink path={row.rapports_conformite_path} kind="auto" />
                      </Td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination */}
          {items.links?.length > 0 && (
            <div className="p-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-wrap items-center gap-2 justify-center">
                {items.links.map((l, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={l.url || "#"}
                      className={[
                        "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                        l.active 
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300"
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

AdminMaterialIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>;
