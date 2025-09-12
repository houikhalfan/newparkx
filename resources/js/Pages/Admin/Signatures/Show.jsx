import React from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import { motion } from 'framer-motion';
import { 
    FileText, 
    ArrowLeft, 
    Download, 
    MessageSquare, 
    User, 
    Calendar, 
    Clock, 
    CheckCircle, 
    XCircle, 
    AlertCircle,
    Building2,
    Mail,
    Eye,
    Shield,
    Users,
    FileSignature
} from 'lucide-react';
import AdminLayout from "@/Layouts/AdminLayout";

function AdminSignShow() {
  const { req, csrf_token, users = [] } = usePage().props;

  // Only keep "assign" for admin
  const assignForm = useForm({ user_id: "" });
  const assign = (e) => {
    e.preventDefault();
    assignForm.post(route("admin.signatures.assign", req.id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "backOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl animate-pulse" />
      </div>

      <div className="relative z-10 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Enhanced Header */}
            <motion.div
              variants={cardVariants}
              className="relative"
            >
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <motion.div
                      variants={iconVariants}
                      className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg"
                    >
                      <FileSignature className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Demande de signature
                      </h1>
                      <p className="text-xl font-semibold text-slate-600 dark:text-slate-400 mt-1">
                        {req.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          <span>{req.contractor?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{req.contractor?.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(req.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge s={req.status} />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={route("admin.signatures.index")}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg hover:shadow-xl"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Retour aux demandes
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content Card */}
            <motion.div
              variants={cardVariants}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-8 border-b border-slate-200 dark:border-slate-700">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                          {req.title}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                          <StatusBadge s={req.status} />
                        </div>
                      </div>
                    </div>

                    {req.message && (
                      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {req.message}
                        </p>
                      </div>
                    )}

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                        <Building2 className="w-5 h-5 text-slate-500" />
                        <div>
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Contractant</span>
                          <p className="font-semibold text-slate-800 dark:text-white">{req.contractor?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                        <Mail className="w-5 h-5 text-slate-500" />
                        <div>
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Email</span>
                          <p className="font-semibold text-slate-800 dark:text-white">{req.contractor?.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Document Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {req.original_path && (
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={route("admin.signatures.download.original", req.id)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-600 transition-all font-medium shadow-lg hover:shadow-xl"
                      >
                        <Download className="w-5 h-5" />
                        Télécharger l'original
                      </motion.a>
                    )}

                    {req.signed_path && (
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={route("admin.signatures.download.signed", req.id)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all font-medium shadow-lg hover:shadow-xl"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Document signé
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8">
                {/* Comments Section */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Commentaires</h3>
                  </div>

                  {req.request_comments?.length ? (
                    <div className="space-y-4">
                      {req.request_comments.map((comment, index) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                comment.author_type?.includes("Admin") ? "bg-slate-900 dark:bg-white" : "bg-blue-600"
                              }`} />
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                {comment.author_type?.includes("Admin") ? "Admin" : "Contractant"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                              <Clock className="w-4 h-4" />
                              <span>
                                {new Date(comment.created_at).toLocaleString("fr-FR", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="text-slate-800 dark:text-slate-200 leading-relaxed">
                            {comment.body}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-2xl inline-block mb-4">
                        <MessageSquare className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-lg">Aucun commentaire pour le moment</p>
                    </div>
                  )}
                </section>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ s }) {
  const statusConfig = {
    submitted: { 
      bg: "bg-blue-100 dark:bg-blue-900/30", 
      text: "text-blue-800 dark:text-blue-300", 
      border: "border-blue-200 dark:border-blue-700", 
      label: "Soumise",
      icon: Clock
    },
    assigned: { 
      bg: "bg-amber-100 dark:bg-amber-900/30", 
      text: "text-amber-800 dark:text-amber-300", 
      border: "border-amber-200 dark:border-amber-700", 
      label: "Assignée",
      icon: Users
    },
    signed: { 
      bg: "bg-emerald-100 dark:bg-emerald-900/30", 
      text: "text-emerald-800 dark:text-emerald-300", 
      border: "border-emerald-200 dark:border-emerald-700", 
      label: "Signée",
      icon: CheckCircle
    },
    rejected: { 
      bg: "bg-red-100 dark:bg-red-900/30", 
      text: "text-red-800 dark:text-red-300", 
      border: "border-red-200 dark:border-red-700", 
      label: "Rejetée",
      icon: XCircle
    },
    pending: { 
      bg: "bg-slate-100 dark:bg-slate-800", 
      text: "text-slate-800 dark:text-slate-300", 
      border: "border-slate-200 dark:border-slate-700", 
      label: "En attente",
      icon: AlertCircle
    },
  };

  const config = statusConfig[s] || { 
    bg: "bg-slate-100 dark:bg-slate-800", 
    text: "text-slate-800 dark:text-slate-300", 
    border: "border-slate-200 dark:border-slate-700", 
    label: s || "—",
    icon: AlertCircle
  };

  const Icon = config.icon;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      <Icon className="w-4 h-4" />
      {config.label}
    </motion.span>
  );
}

AdminSignShow.layout = (page) => <AdminLayout>{page}</AdminLayout>;
export default AdminSignShow;