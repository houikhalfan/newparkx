import React from "react";
import { usePage, Link } from "@inertiajs/react";
import { motion } from 'framer-motion';
import { 
  Truck, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Building, 
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Sparkles,
  Package,
  MapPin,
  Hash,
  ArrowRight,
  LogOut,
  UserCircle
} from 'lucide-react';
import DashboardLayout from "@/Pages/DashboardLayout";

export default function EmployeeMatIndex() {
  const { items = { data: [], links: [] }, q = "", s = "", auth } = usePage().props;
  const { user } = auth || {};

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
        text: 'text-white',
        label: 'En attente',
        icon: <Clock className="w-3 h-3 mr-1" />
      },
      accepted: {
        bg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        text: 'text-white',
        label: 'Accepté',
        icon: <CheckCircle className="w-3 h-3 mr-1" />
      },
      rejected: {
        bg: 'bg-gradient-to-r from-red-500 to-pink-500',
        text: 'text-white',
        label: 'Rejeté',
        icon: <XCircle className="w-3 h-3 mr-1" />
      },
    };
    const badge = badges[status] || { 
      bg: 'bg-gradient-to-r from-gray-400 to-gray-500', 
      text: 'text-white', 
      label: status || '—',
      icon: <AlertCircle className="w-3 h-3 mr-1" />
    };
    return badge;
  };

  const localizePagination = (label) => {
    return String(label)
      .replace(/Previous|&laquo;\s*Previous/gi, 'Précédent')
      .replace(/Next|Next\s*&raquo;/gi, 'Suivant');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse" />
      </div>

      {/* Modern Header */}
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
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Matériel
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">Gérez vos demandes de matériel</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                {/* Back Button */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Link
                    href="/dashboard"
                    className="group relative inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Retour au Tableau de Bord</span>
                  </Link>
                </motion.div>

                {/* Logout Button */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Link
                    href="/logout"
                    method="post"
                    className="group relative inline-flex items-center space-x-2 px-4 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg bg-red-500 hover:bg-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                  </Link>
                </motion.div>

                {/* User Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-slate-800">
                    <p className="text-sm font-medium">{user?.name || 'Utilisateur'}</p>
                    <p className="text-xs text-slate-600">ParkX</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Ressources Matérielles
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Gérez et suivez vos demandes de matériel assignées
            </p>
          </motion.div>

          {/* Search and Filters */}
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
          placeholder="Recherche (site, contractant, matricule)…"
        />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <select
          name="s"
          defaultValue={s}
                    className="pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 appearance-none bg-white"
                    title="Filtrer par statut"
        >
                    <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="accepted">Accepté</option>
          <option value="rejected">Rejeté</option>
        </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
                >
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Filtrer</span>
                  </div>
                </motion.button>
      </form>
            </div>
          </motion.div>

      {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden"
          >
        {/* Table Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Demandes de Matériel</h3>
              <p className="text-indigo-100 text-sm">Consultez et gérez vos ressources assignées</p>
            </div>
          </div>
        </div>

        {/* Table Content */}
      <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-200">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Site</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-200">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4" />
                    <span>Contractant</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b-2 border-slate-200">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4" />
                    <span>Matricule</span>
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
                    <Calendar className="w-4 h-4" />
                    <span>Créé le</span>
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
              {items.data.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-gray-100 flex items-center justify-center">
                      <Package className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">Aucune demande de matériel assignée.</p>
                  </td>
                </tr>
              )}

              {items.data.map((item, index) => {
                const statusBadge = getStatusBadge(item.status);
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="border-b border-slate-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{item.site?.name || '—'}</h4>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                          <Building className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{item.contractor?.name || '—'}</div>
                          <div className="text-sm text-slate-500">{item.contractor?.email || '—'}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-slate-400" />
                        <span className="font-mono text-slate-600 font-medium">{item.matricule || '—'}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${statusBadge.bg} ${statusBadge.text}`}>
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 font-medium">
                          {new Date(item.created_at).toLocaleString('fr-FR', {
                            dateStyle: 'short',
                            timeStyle: 'medium',
                          })}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          href={route('employee.materiel.show', item.id)}
                          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg"
                          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
                        >
                          <Eye className="w-4 h-4" />
                          <span>Voir</span>
                        </Link>
                      </motion.div>
                    </td>
                  </motion.tr>
                );
              })}
          </tbody>
        </table>
      </div>
      </motion.div>

      {/* Pagination */}
          {items.links?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-2 justify-end"
            >
              {items.links.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
            <Link
                    href={link.url || '#'}
                    className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                link.active
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                        : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200'
              }`}
                    dangerouslySetInnerHTML={{ __html: localizePagination(link.label) }}
            />
                </motion.div>
          ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Inertia layout hook - Full screen layout like VODS */
EmployeeMatIndex.layout = (page) => page;