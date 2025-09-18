import React from "react";
import { usePage, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Sparkles,
  Hash,
  ArrowRight,
  LogOut,
  UserCircle,
  Search,
  Filter,
} from "lucide-react";

export default function SuiviPermisSite() {
  const { permis = [], q = "", s = "", auth } = usePage().props;
  const { user } = auth || {};

  const getStatusBadge = (status) => {
    const badges = {
      signe: {
        bg: "bg-gradient-to-r from-emerald-500 to-teal-500",
        text: "text-white",
        label: "Signé",
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
      },
      en_cours: {
        bg: "bg-gradient-to-r from-blue-500 to-indigo-500",
        text: "text-white",
        label: "En cours",
        icon: <Clock className="w-3 h-3 mr-1" />,
      },
      en_attente: {
        bg: "bg-gradient-to-r from-amber-500 to-orange-500",
        text: "text-white",
        label: "En attente",
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
      },
      rejeté: {
        bg: "bg-gradient-to-r from-red-500 to-pink-500",
        text: "text-white",
        label: "Rejeté",
        icon: <XCircle className="w-3 h-3 mr-1" />,
      },
    };
    return (
      badges[status] || {
        bg: "bg-gradient-to-r from-gray-400 to-gray-500",
        text: "text-white",
        label: status || "—",
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Background Gradient Animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Top Bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              {/* Logo & Brand */}
              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Permis d’excavation
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">
                    Gérez vos permis au niveau de votre site
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Retour au Tableau de Bord</span>
                </Link>

             

                <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-slate-800">
                    <p className="text-sm font-medium">
                      {user?.name || "Utilisateur"}
                    </p>
                    <p className="text-xs text-slate-600">ParkX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center pt-12 mb-10 relative z-10"
      >
        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Liste des Permis
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Consultez et suivez vos permis d’excavation
        </p>
      </motion.div>

      {/* 🔎 Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="max-w-5xl mx-auto mb-8"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
          <form method="GET" className="flex flex-col sm:flex-row gap-4">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                name="q"
                defaultValue={q}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                placeholder="Recherche (numéro, date…)"
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                name="s"
                defaultValue={s}
                className="pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 appearance-none bg-white"
                title="Filtrer par statut"
              >
                <option value="">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="en_cours">En cours</option>
                <option value="signe">Signé</option>
                <option value="rejeté">Rejeté</option>
              </select>
            </div>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              }}
            >
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Filtrer</span>
              </div>
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="max-w-7xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden"
      >
        {/* Table Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Liste des Permis</h3>
              <p className="text-indigo-100 text-sm">
                Consultez et gérez vos permis d’excavation
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-200">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4" />
                    <span>Numéro Permis</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-200">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Date Création</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-200">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Statut</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-200">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>PDF Final</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 border-b-2 border-slate-200">
                  <div className="flex items-center justify-end space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Action</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {permis.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-gray-100 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">
                      Aucun permis trouvé.
                    </p>
                  </td>
                </tr>
              )}

              {permis.map((p, index) => {
                const statusBadge = getStatusBadge(p.status);
                return (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="border-b border-slate-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {p.numero_permis}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {p.date || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${statusBadge.bg} ${statusBadge.text}`}
                      >
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                    </td>

                   <td className="px-6 py-4">
  {p.status === "signe" && p.pdf_signed ? (
    <a
      href={p.pdf_signed}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-4 py-2 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-105"
    >
      <Eye className="w-4 h-4 mr-2" />
      Voir PDF
    </a>
  ) : (
    <span className="text-slate-400">Non disponible</span>
  )}
</td>


                    <td className="px-6 py-4 text-right">
                      {p.status === "en_attente" ? (
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Link
                            href={route("responsibleSite.permis.show", p.id)}
                            className="inline-flex items-center px-4 py-2 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500"
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Signer
                          </Link>
                        </motion.div>
                      ) : (
                        <span className="text-slate-400 italic">
                          Déjà signé
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
