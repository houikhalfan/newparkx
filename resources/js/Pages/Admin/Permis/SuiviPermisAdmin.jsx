import React, { useEffect, useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/Layouts/AdminLayout";
import {
  FileText,
  Download,
  CheckCircle,
  Clock,
  Pause,
  AlertCircle,
  Search,
  Filter,
  Building2,
  User,
  Calendar,
  Hash,
  Shield,
  Flame,
  Hammer,
} from "lucide-react";

/* ---------------------- Helpers ---------------------- */
function Th({ children, className = "" }) {
  return (
    <th
      className={`px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300 ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return <td className={`px-6 py-4 align-middle ${className}`}>{children}</td>;
}

function getStatusBadge(status) {
  const badges = {
    signe: {
      label: "Signé",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-300",
      icon: CheckCircle,
    },
    en_cours: {
      label: "En cours",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-300",
      icon: Clock,
    },
    en_attente: {
      label: "En attente",
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-300",
      icon: AlertCircle,
    },
    suspendu: {
      label: "Suspendu",
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-700 dark:text-orange-300",
      icon: Pause,
    },
  };
  return badges[status] || badges.en_attente;
}

function getTypeIcon(type) {
  const icons = {
    "Permis d'excavation": Hammer,
    "Permis de travail sécuritaire": Shield,
    "Permis de travail chaud": Flame,
  };
  return icons[type] || FileText;
}

function fmtDate(date) {
  try {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return date || "—";
  }
}

/* ---------------------- Component ---------------------- */
export default function SuiviPermisAdmin() {
  const { permis = [], q = "", s = "", t = "" } = usePage().props;
  
  // Initialiser avec des valeurs par défaut pour éviter null
  const [search, setSearch] = useState(q || "");
  const [status, setStatus] = useState(s || "");
  const [type, setType] = useState(t || "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 p-6 md:p-8">
        {/* Header */}
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
                Suivi des Permis — Admin
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                Recherchez, filtrez et suivez l'état de tous les permis
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="relative p-6">
              <form method="GET" className="flex flex-wrap items-center gap-4">
                {/* Search */}
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="q"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher (numéro, site, contractant)…"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 pl-12 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Type filter */}
                <select
                  name="t"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Tous les types</option>
                  <option value="excavation">Permis d'excavation</option>
                  <option value="securitaire">Permis de travail sécuritaire</option>
                  <option value="chaud">Permis de travail à chaud</option>
                </select>

                {/* Status filter */}
                <select
                  name="s"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Tous les statuts</option>
                  <option value="signe">Signés</option>
                  <option value="en_cours">En cours</option>
                  <option value="en_attente">En attente</option>
                  <option value="suspendu">Suspendus</option>
                </select>

                {/* Button */}
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

        {/* Table */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-700 text-left">
              <tr>
                <Th>Type</Th>
                <Th>Numéro Permis</Th>
                <Th>Site</Th>
                <Th>Contractant</Th>
                <Th>Date Création</Th>
                <Th>Statut</Th>
                <Th className="text-center">Action</Th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {permis.length === 0 && (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                    >
                      Aucun permis trouvé
                    </td>
                  </motion.tr>
                )}

                {permis.map((p, idx) => {
                  const badge = getStatusBadge(p.status);
                  const StatusIcon = badge.icon;
                  const TypeIcon = getTypeIcon(p.type);
                  
                  return (
                    <motion.tr
                      key={`${p.model_type}-${p.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-t hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <Td>
                        <div className="flex items-center gap-2">
                          <TypeIcon className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{p.type}</span>
                        </div>
                      </Td>
                      <Td className="font-mono text-sm">{p.numero_permis}</Td>
                      <Td>{p.site || "—"}</Td>
                      <Td>{p.contractant || "—"}</Td>
                      <Td>{fmtDate(p.created_at)}</Td>
                      <Td>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {badge.label}
                        </span>
                      </Td>
                      <Td className="text-center">
                        {p.status === "signe" && p.pdf_original ? (
                          <a
                            href={p.pdf_original}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow hover:from-green-700 hover:to-emerald-700 transition"
                          >
                            <Download className="w-4 h-4" />
                            Télécharger
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">—</span>
                        )}
                      </Td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

SuiviPermisAdmin.layout = (page) => <AdminLayout>{page}</AdminLayout>;