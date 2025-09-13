import React, { useEffect, useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/Layouts/AdminLayout";
import Swal from "sweetalert2";
import {
  FolderOpen,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  User,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Pause,
  XCircle,
} from "lucide-react";

function ProjectsIndex() {
  const { projects, sites, filters, csrf_token, flash = {} } = usePage().props || {};
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.q || "");
  const [siteFilter, setSiteFilter] = useState(filters.site || "");
  const [statusFilter, setStatusFilter] = useState(filters.status || "");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (flash?.success) {
      Swal.fire({
        icon: "success",
        title: flash.success,
        timer: 1600,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-2xl',
          title: 'text-slate-900 dark:text-white'
        }
      });
    } else if (flash?.error) {
      Swal.fire({
        icon: "error",
        title: flash.error,
        customClass: {
          popup: 'rounded-2xl',
          title: 'text-slate-900 dark:text-white'
        }
      });
    }
  }, [flash]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    router.get(route("admin.projects.index"), {
      q: value || undefined,
      site: siteFilter || undefined,
      status: statusFilter || undefined,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleSiteFilter = (value) => {
    setSiteFilter(value);
    router.get(route("admin.projects.index"), {
      q: searchTerm || undefined,
      site: value || undefined,
      status: statusFilter || undefined,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    router.get(route("admin.projects.index"), {
      q: searchTerm || undefined,
      site: siteFilter || undefined,
      status: value || undefined,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSiteFilter("");
    setStatusFilter("");
    router.get(route("admin.projects.index"), {}, {
      preserveState: true,
      replace: true,
    });
  };

  const deleteProject = (id, name) => {
    Swal.fire({
      title: "Supprimer le projet",
      text: `Êtes-vous sûr de vouloir supprimer le projet "${name}" ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      customClass: {
        popup: 'rounded-2xl',
        title: 'text-slate-900 dark:text-white'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route("admin.projects.destroy", id), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "Projet supprimé",
              timer: 1200,
              showConfirmButton: false,
              customClass: {
                popup: 'rounded-2xl',
                title: 'text-slate-900 dark:text-white'
              }
            });
          },
          onError: () => {
            Swal.fire({
              icon: "error",
              title: "Impossible de supprimer le projet",
              customClass: {
                popup: 'rounded-2xl',
                title: 'text-slate-900 dark:text-white'
              }
            });
          },
        });
      }
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      actif: { label: "Actif", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle },
      en_cours: { label: "En cours", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: Clock },
      termine: { label: "Terminé", className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400", icon: CheckCircle },
      suspendu: { label: "Suspendu", className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", icon: Pause },
    };
    return badges[status] || badges.actif;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg"
              >
                <FolderOpen className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 dark:from-white dark:via-purple-100 dark:to-indigo-100 bg-clip-text text-transparent">
                  Gestion des Projets
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                  Gérez les projets par site
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
              <Link
                href={route("admin.projects.create")}
                className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10"
                >
                  <Plus className="w-5 h-5" />
                </motion.div>
                <span className="relative z-10">Nouveau Projet</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Filtres et Recherche
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Trouvez rapidement vos projets
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Rechercher par nom..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Site Filter */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  value={siteFilter}
                  onChange={(e) => handleSiteFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="">Tous les sites</option>
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="">Tous les statuts</option>
                  <option value="actif">Actif</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                  <option value="suspendu">Suspendu</option>
                </select>
              </div>

              {/* Clear Filters */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-4 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-all font-medium"
              >
                <XCircle className="w-4 h-4" />
                Effacer
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Projects Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
            {projects.data.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                          NOM DU PROJET
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                          SITE
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                          STATUT
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                          BUDGET
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                          MANAGER
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                          DATES
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      <AnimatePresence>
                        {projects.data.map((project, index) => {
                          const statusBadge = getStatusBadge(project.status);
                          const StatusIcon = statusBadge.icon;

                          return (
                            <motion.tr
                              key={project.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div>
                                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                                    {project.name}
                                  </div>
                                  {project.description && (
                                    <div className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">
                                      {project.description}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-slate-400" />
                                  <span className="text-sm text-slate-900 dark:text-white">
                                    {project.site?.name || "Non assigné"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusBadge.className}`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {statusBadge.label}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-green-500" />
                                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                                    {formatCurrency(project.budget)}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-slate-400" />
                                  <span className="text-sm text-slate-900 dark:text-white">
                                    {project.project_manager}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-4 h-4 text-slate-400" />
                                  <div>
                                    <div className="text-slate-900 dark:text-white">
                                      {formatDate(project.start_date)}
                                    </div>
                                    {project.end_date && (
                                      <div className="text-slate-500 dark:text-slate-400">
                                        → {formatDate(project.end_date)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Link
                                      href={route("admin.projects.show", project.id)}
                                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                      title="Voir"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Link>
                                  </motion.button>

                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Link
                                      href={route("admin.projects.edit", project.id)}
                                      className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                      title="Modifier"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </Link>
                                  </motion.button>

                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => deleteProject(project.id, project.name)}
                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {projects.links && projects.links.length > 3 && (
                  <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        Affichage de {projects.from} à {projects.to} sur {projects.total} projets
                      </div>
                      <div className="flex items-center gap-2">
                        {projects.links.map((link, index) => (
                          <Link
                            key={index}
                            href={link.url || "#"}
                            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                              link.active
                                ? "bg-purple-600 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-6"
                >
                  <FolderOpen className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                </motion.div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Aucun projet trouvé
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {searchTerm || siteFilter || statusFilter
                    ? "Aucun projet ne correspond à vos critères de recherche."
                    : "Créez votre premier projet pour commencer."}
                </p>
                {!searchTerm && !siteFilter && !statusFilter && (
                  <Link
                    href={route("admin.projects.create")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Créer un projet
                  </Link>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

ProjectsIndex.layout = (page) => <AdminLayout children={page} />;
export default ProjectsIndex;