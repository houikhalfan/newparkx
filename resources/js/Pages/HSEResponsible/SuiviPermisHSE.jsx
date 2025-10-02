import React from "react";
import { usePage, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Filter,
  Calendar,
  UserCircle,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  ArrowRight,
  LogOut,
  HardHat,
  Flame,
  Shield,
} from "lucide-react";

export default function SuiviPermisHSE() {
  const { permis = [], flash = {}, q = "", s = "", t = "", auth } = usePage().props;
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
        bg: "bg-gradient-to-r from-amber-500 to-orange-500",
        text: "text-white",
        label: "En cours",
        icon: <Clock className="w-3 h-3 mr-1" />,
      },
      attente_hse: {
        bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
        text: "text-white",
        label: "En attente HSE",
        icon: <Clock className="w-3 h-3 mr-1" />,
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

  const getTypeIcon = (type) => {
    const icons = {
      excavation: <HardHat className="w-4 h-4" />,
      travail_chaud: <Flame className="w-4 h-4" />,
      travail_securitaire: <Shield className="w-4 h-4" />,
    };
    return icons[type] || <FileText className="w-4 h-4" />;
  };

  const getTypeLabel = (type) => {
    const labels = {
      excavation: "Excavation",
      travail_chaud: "Travail à chaud",
      travail_securitaire: "Travail sécuritaire",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      excavation: "from-blue-500 to-cyan-500",
      travail_chaud: "from-orange-500 to-red-500",
      travail_securitaire: "from-green-500 to-emerald-500",
    };
    return colors[type] || "from-gray-500 to-slate-500";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch {
      return "—";
    }
  };

  // Fonction pour obtenir la route correcte basée sur le type de permis
  const getPermisRoute = (type, id) => {
    const routes = {
      excavation: route("hseResponsible.permis.show", id),
      travail_chaud: route("hseResponsible.permis-travail-chaud.show", id),
    travail_securitaire: route("hseResponsible.permis-travail-securitaire.show", id),
    };
    return routes[type] || "#";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Gestion des Permis HSE
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Signature HSE Manager - Tous les permis
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition"
                style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
              >
                <ArrowRight className="w-4 h-4 inline-block mr-2" />
                Retour au Tableau de Bord
              </Link>

              <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name || "Utilisateur"}</p>
                  <p className="text-xs text-slate-600">HSE Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 py-8 px-6 max-w-7xl mx-auto">
        {flash?.success && (
          <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-emerald-700 text-sm shadow-md">
            {flash.success}
          </div>
        )}

        {/* ✅ Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
            Signature des Permis
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Signez les permis en attente de validation HSE
          </p>
        </motion.div>

        {/* 🔎 Filter Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
            <form method="GET" className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  name="q"
                  defaultValue={q}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  placeholder="Recherche (numéro, site…)"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  name="s"
                  defaultValue={s}
                  className="pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 appearance-none bg-white"
                  title="Filtrer par statut"
                >
                  <option value="">Tous les statuts</option>
                  <option value="attente_hse">En attente HSE</option>
                  <option value="en_cours">En cours</option>
                  <option value="signe">Signé</option>
                </select>
              </div>

              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  name="t"
                  defaultValue={t}
                  className="pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 appearance-none bg-white"
                  title="Filtrer par type"
                >
                  <option value="">Tous les types</option>
                  <option value="excavation">Excavation</option>
                  <option value="travail_chaud">Travail à chaud</option>
                  <option value="travail_securitaire">Travail sécuritaire</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg"
                style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
              >
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Filtrer</span>
                </div>
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* 📊 Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {/* Total Permis */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Permis</p>
                <p className="text-3xl font-bold text-slate-800">{permis.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* En attente HSE */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">En attente signature</p>
                <p className="text-3xl font-bold text-amber-600">
                  {permis.filter(p => p.status === 'attente_hse').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Signés */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Signés</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {permis.filter(p => p.status === 'signe').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* En cours */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">En cours</p>
                <p className="text-3xl font-bold text-blue-600">
                  {permis.filter(p => p.status === 'en_cours').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 📋 Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Permis en Attente de Signature HSE</h3>
                <p className="text-blue-100 text-sm">Signez les permis validés par les responsables de site</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-gray-50">
                <tr>
                  {["#", "Type", "Numéro", "Site", "Date création", "Statut", "PDF", "Action"].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-200"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permis.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-gray-100 flex items-center justify-center">
                        <Package className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">Aucun permis trouvé.</p>
                      <p className="text-slate-400 text-sm mt-2">
                        Aucun permis ne correspond à vos critères de recherche.
                      </p>
                    </td>
                  </tr>
                ) : (
                  permis.map((p, idx) => {
                    const status = getStatusBadge(p.status);
                    return (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.5 }}
                        className="border-b border-slate-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300"
                      >
                        <td className="px-6 py-4 font-medium">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getTypeColor(p.type)} flex items-center justify-center`}>
                              {getTypeIcon(p.type)}
                            </div>
                            <span className="font-medium text-slate-800">
                              {getTypeLabel(p.type)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-sm text-slate-600">
                          {p.numero_permis || "—"}
                        </td>
                        <td className="px-6 py-4">
                          {p.site?.name || p.site_id || "—"}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {formatDate(p.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${status.bg} ${status.text}`}
                          >
                            {status.icon}
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {p.pdf_signed ? (
                            <a
                              href={p.pdf_signed}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                            >
                              <FileText className="w-4 h-4" />
                              <span>PDF Signé</span>
                            </a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {p.status === "signe" ? (
                            <span className="text-gray-400 italic text-sm">Déjà signé</span>
                          ) : (
                            <Link
                              href={getPermisRoute(p.type, p.id)}
                              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg hover:scale-105"
                              style={{
                                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                              }}
                            >
                              <FileText className="w-4 h-4" />
                              <span>Signer</span>
                            </Link>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

SuiviPermisHSE.layout = (page) => page;