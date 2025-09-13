import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import AdminLayout from "@/Layouts/AdminLayout";
import {
  ArrowLeft,
  Edit3,
  Calendar,
  MapPin,
  User,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  Pause,
  Trash2,
} from "lucide-react";

function ProjectShow() {
  const { project } = usePage().props || {};

  const getStatusBadge = (status) => {
    const badges = {
      actif: { 
        label: "Actif", 
        className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", 
        icon: CheckCircle 
      },
      en_cours: { 
        label: "En cours", 
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", 
        icon: Clock 
      },
      termine: { 
        label: "Terminé", 
        className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400", 
        icon: CheckCircle 
      },
      suspendu: { 
        label: "Suspendu", 
        className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", 
        icon: Pause 
      },
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
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusBadge = getStatusBadge(project.status);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background Elements */}
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
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={route("admin.projects.index")}
                className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 font-medium shadow-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.div
                  whileHover={{ x: -2 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
                >
                  <ArrowLeft className="w-4 h-4" />
                </motion.div>
                <span className="relative z-10">Retour</span>
              </Link>
            </motion.div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
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
                  {project.name}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                  Détails du projet
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={route("admin.projects.edit", project.id)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg"
              >
                <Edit3 className="w-4 h-4" />
                Modifier
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Project Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Informations Générales
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Détails principaux du projet
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nom du Projet
                  </label>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {project.name}
                  </p>
                </div>

                {project.description && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Description
                    </label>
                    <p className="text-slate-900 dark:text-white">
                      {project.description}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Statut
                  </label>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusBadge.className}`}>
                    <StatusIcon className="w-4 h-4" />
                    {statusBadge.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Project Timeline */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Calendrier du Projet
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Dates importantes
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Date de Début
                    </label>
                    <p className="text-slate-900 dark:text-white">
                      {formatDate(project.start_date)}
                    </p>
                  </div>
                </div>

                {project.end_date && (
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Date de Fin Prévue
                      </label>
                      <p className="text-slate-900 dark:text-white">
                        {formatDate(project.end_date)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Manager */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Chef de Projet
                  </h3>
                </div>
              </div>
              <p className="text-slate-900 dark:text-white font-medium">
                {project.project_manager}
              </p>
            </div>

            {/* Site */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Site
                  </h3>
                </div>
              </div>
              <p className="text-slate-900 dark:text-white font-medium">
                {project.site?.name || "Non assigné"}
              </p>
            </div>

            {/* Budget */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Budget
                  </h3>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(project.budget)}
              </p>
            </div>

            {/* Project Metadata */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Métadonnées
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Créé le
                  </label>
                  <p className="text-slate-900 dark:text-white text-sm">
                    {formatDateTime(project.created_at)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Modifié le
                  </label>
                  <p className="text-slate-900 dark:text-white text-sm">
                    {formatDateTime(project.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

ProjectShow.layout = (page) => <AdminLayout children={page} />;
export default ProjectShow;