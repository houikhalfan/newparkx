import React from "react";
import { usePage, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import AdminLayout from "@/Layouts/AdminLayout";
import {
  ArrowLeft,
  Save,
  Calendar,
  MapPin,
  User,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

function ProjectEdit() {
  const { project, sites, csrf_token } = usePage().props || {};

  const { data, setData, put, processing, errors } = useForm({
    name: project.name || "",
    description: project.description || "",
    site_id: project.site_id || "",
    status: project.status || "actif",
    start_date: project.start_date || "",
    end_date: project.end_date || "",
    budget: project.budget || "",
    project_manager: project.project_manager || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route("admin.projects.update", project.id), {
      preserveScroll: true,
    });
  };

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

          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg"
            >
              <FileText className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent">
                Modifier le projet
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                Modifier les informations du projet "{project.name}"
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Project Name */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                        Nom du Projet *
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="text"
                          value={data.name}
                          onChange={(e) => setData("name", e.target.value)}
                          placeholder="Ex: Construction Bâtiment A"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.name
                              ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                          } text-slate-900 dark:text-white placeholder-slate-400`}
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Project Manager */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                        Chef de Projet *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="text"
                          value={data.project_manager}
                          onChange={(e) => setData("project_manager", e.target.value)}
                          placeholder="Nom du chef de projet"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.project_manager
                              ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                          } text-slate-900 dark:text-white placeholder-slate-400`}
                        />
                      </div>
                      {errors.project_manager && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {errors.project_manager}
                        </p>
                      )}
                    </div>

                    {/* Start Date */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                        Date de Début *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="date"
                          value={data.start_date}
                          onChange={(e) => setData("start_date", e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.start_date
                              ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                          } text-slate-900 dark:text-white`}
                        />
                      </div>
                      {errors.start_date && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {errors.start_date}
                        </p>
                      )}
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                        Budget (MAD) *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={data.budget}
                          onChange={(e) => setData("budget", e.target.value)}
                          placeholder="0.00"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.budget
                              ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                          } text-slate-900 dark:text-white placeholder-slate-400`}
                        />
                      </div>
                      {errors.budget && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {errors.budget}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                        Description
                      </label>
                      <textarea
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        placeholder="Description du projet..."
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          errors.description
                            ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                        } text-slate-900 dark:text-white placeholder-slate-400 resize-none`}
                      />
                      {errors.description && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {errors.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Site */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                        Site *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <select
                          value={data.site_id}
                          onChange={(e) => setData("site_id", e.target.value)}
                          className={`w-full pl-10 pr-8 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer ${
                            errors.site_id
                              ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                          } text-slate-900 dark:text-white`}
                        >
                          <option value="">Sélectionner un site</option>
                          {sites.map((site) => (
                            <option key={site.id} value={site.id}>
                              {site.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {errors.site_id && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {errors.site_id}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                        Statut *
                      </label>
                      <div className="relative">
                        <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <select
                          value={data.status}
                          onChange={(e) => setData("status", e.target.value)}
                          className={`w-full pl-10 pr-8 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer ${
                            errors.status
                              ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                          } text-slate-900 dark:text-white`}
                        >
                          <option value="actif">Actif</option>
                          <option value="en_cours">En cours</option>
                          <option value="termine">Terminé</option>
                          <option value="suspendu">Suspendu</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {errors.status && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {errors.status}
                        </p>
                      )}
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                        Date de Fin
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="date"
                          value={data.end_date}
                          onChange={(e) => setData("end_date", e.target.value)}
                          min={data.start_date}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.end_date
                              ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                          } text-slate-900 dark:text-white`}
                        />
                      </div>
                      {errors.end_date && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {errors.end_date}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <Link
                    href={route("admin.projects.index")}
                    className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                  >
                    Annuler
                  </Link>
                  <motion.button
                    type="submit"
                    disabled={processing}
                    whileHover={{ scale: processing ? 1 : 1.05 }}
                    whileTap={{ scale: processing ? 1 : 0.95 }}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 ${
                      processing
                        ? "bg-slate-400 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700"
                    }`}
                  >
                    <Save className="w-5 h-5" />
                    {processing ? "Mise à jour..." : "Mettre à jour"}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

ProjectEdit.layout = (page) => <AdminLayout children={page} />;
export default ProjectEdit;