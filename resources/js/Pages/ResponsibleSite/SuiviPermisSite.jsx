import React from "react";
import { usePage, Link, router } from "@inertiajs/react";
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
  UserCircle,
  Search,
  Filter,
  HardHat,
  Shield,
  Flame,
  PenTool,
} from "lucide-react";

export default function SuiviPermisSite() {
  const { permis = [], filters = {}, auth } = usePage().props;
  const { user } = auth || {};

  // State for filters
  const [search, setSearch] = React.useState(filters.q || '');
  const [statusFilter, setStatusFilter] = React.useState(filters.s || '');
  const [typeFilter, setTypeFilter] = React.useState(filters.t || '');

  // Handle search input
  const handleSearch = (e) => {
    setSearch(e.target.value);
    router.get(route('responsible.suivi-permis.index'), {
      q: e.target.value,
      s: statusFilter,
      t: typeFilter,
    }, { preserveState: true, replace: true });
  };

  // Handle status filter
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    router.get(route('responsible.suivi-permis.index'), {
      q: search,
      s: e.target.value,
      t: typeFilter,
    }, { preserveState: true, replace: true });
  };

  // Handle type filter
  const handleTypeFilter = (e) => {
    setTypeFilter(e.target.value);
    router.get(route('responsible.suivi-permis.index'), {
      q: search,
      s: statusFilter,
      t: e.target.value,
    }, { preserveState: true, replace: true });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setTypeFilter('');
    router.get(route('responsible.suivi-permis.index'));
  };

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

  const getTypeIcon = (type) => {
    const icons = {
      excavation: <HardHat className="w-4 h-4 text-blue-600" />,
      travail_securitaire: <Shield className="w-4 h-4 text-green-600" />,
      travail_chaud: <Flame className="w-4 h-4 text-orange-600" />,
    };
    return icons[type] || <FileText className="w-4 h-4 text-gray-600" />;
  };

  const getTypeLabel = (type) => {
    const labels = {
      excavation: "Permis d'Excavation",
      travail_securitaire: "Permis de Travail Sécuritaire",
      travail_chaud: "Permis de Travail à Chaud",
    };
    return labels[type] || "Permis";
  };

  // Get the appropriate signing route based on permit type - UPDATED TO MATCH YOUR ROUTES
 // Get the appropriate signing route based on permit type - UPDATED
const getSigningRoute = (permis) => {
  switch(permis.type) {
    case 'excavation':
      return route('responsibleSite.permis.show', permis.id);
    case 'travail_securitaire':
      return route('responsibleSite.permis-travail-securitaire.show', permis.id);
    case 'travail_chaud':
      // ADD THIS LINE - route for travail chaud
      return route('responsibleSite.permis-travail-chaud.show', permis.id);
    default:
      return '#';
  }
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
                    Suivi des Permis
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">
                    Gérez tous vos permis (Excavation + Travail Sécuritaire + Travail à Chaud)
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
          Consultez et suivez tous vos permis (Excavation, Travail Sécuritaire et Travail à Chaud)
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
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                placeholder="Recherche (numéro, date, type…)"
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
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

            {/* Type filter */}
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={typeFilter}
                onChange={handleTypeFilter}
                className="pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 appearance-none bg-white"
                title="Filtrer par type"
              >
                <option value="">Tous les types</option>
                <option value="excavation">Permis d'Excavation</option>
                <option value="travail_securitaire">Permis de Travail Sécuritaire</option>
                <option value="travail_chaud">Permis de Travail à Chaud</option>
              </select>
            </div>

            {/* Clear filters button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg bg-gradient-to-r from-red-500 to-pink-500"
            >
              Effacer
            </motion.button>
          </div>
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
                Consultez et gérez tous vos permis (Excavation, Travail Sécuritaire, Travail à Chaud)
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
                    <FileText className="w-4 h-4" />
                    <span>Type</span>
                  </div>
                </th>
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
                  <td colSpan={6} className="px-6 py-12 text-center">
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
                    key={`${p.type}-${p.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="border-b border-slate-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
                  >
                    {/* Type Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(p.type)}
                        <span className="font-medium text-slate-700">
                          {getTypeLabel(p.type)}
                        </span>
                      </div>
                    </td>

                    {/* Numéro Permis */}
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {p.numero_permis}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-600">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString("fr-FR") : "—"}
                    </td>

                    {/* Statut */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${statusBadge.bg} ${statusBadge.text}`}
                      >
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                    </td>

                    {/* PDF Final */}
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

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      {p.status === "en_attente" ? (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link
                            href={getSigningRoute(p)}
                            className="inline-flex items-center px-4 py-2 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105"
                          >
                            <PenTool className="w-4 h-4 mr-2" />
                            Signer
                          </Link>
                        </motion.div>
                      ) : p.status === "en_cours" ? (
                        <span className="text-blue-600 font-medium">En traitement</span>
                      ) : p.status === "signe" ? (
                        <span className="text-green-600 font-medium">Déjà signé</span>
                      ) : (
                        <span className="text-slate-400 italic">En traitement</span>
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