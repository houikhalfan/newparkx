import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, 
    User, 
    Calendar, 
    Clock, 
    CheckCircle, 
    XCircle, 
    AlertCircle, 
    ArrowLeft, 
    Save, 
    Package, 
    Users, 
    Mail, 
    FileText, 
    Zap,
    Sparkles,
    Eye,
    Edit3,
    History,
    UserCheck,
    Building2
} from 'lucide-react';

export default function AdminEPIRequestShow({ epiRequest }) {
    const [formData, setFormData] = useState({
        etat: epiRequest.etat,
        commentaires_admin: epiRequest.commentaires_admin || '',
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
        
        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        router.put(route('admin.epi-requests.update', epiRequest.id), formData, {
            onError: (errors) => setErrors(errors),
            onSuccess: () => {
                // Success message will be handled by the controller
            },
        });
    };

    const getEtatBadge = (etat) => {
        const badges = {
            en_cours: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
            en_traitement: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            done: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        };

        const labels = {
            en_cours: 'En cours',
            en_traitement: 'En traitement',
            done: 'Terminé',
            rejected: 'Rejeté',
        };

        const icons = {
            en_cours: <Clock className="w-4 h-4" />,
            en_traitement: <AlertCircle className="w-4 h-4" />,
            done: <CheckCircle className="w-4 h-4" />,
            rejected: <XCircle className="w-4 h-4" />,
        };

        return (
            <motion.span
                whileHover={{ scale: 1.05 }}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${badges[etat] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'}`}
            >
                {icons[etat] || <AlertCircle className="w-4 h-4" />}
                {labels[etat] || etat}
            </motion.span>
        );
    };

    const formattedEpiList = epiRequest.formatted_epi_list || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
            {/* Enhanced Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl animate-pulse" />
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
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                                className="p-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-2xl"
                            >
                                <Shield className="w-8 h-8 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 via-blue-900 via-purple-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:via-purple-100 dark:to-indigo-100 bg-clip-text text-transparent">
                                    Demande d'EPI
                                </h1>
                                <p className="text-lg text-slate-600 dark:text-slate-300 mt-2 font-medium">
                                    {epiRequest.nom_prenom} • {new Date(epiRequest.date_demande).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href={route('admin.epi-requests.index')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Retour à la liste
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Request Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="lg:col-span-2"
                    >
                        <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-indigo-900/20" />
                            <div className="relative p-8">
                                <div className="text-center mb-8">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-2xl shadow-2xl mb-4"
                                    >
                                        <FileText className="w-7 h-7 text-white" />
                                    </motion.div>
                                    <h2 className="text-2xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-2">
                                        Détails de la demande
                                    </h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                        className="p-4 bg-white/80 dark:bg-slate-700/80 rounded-2xl border border-white/20 dark:border-slate-600/50"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <User className="w-5 h-5 text-blue-500" />
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Nom et Prénom</label>
                                        </div>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{epiRequest.nom_prenom}</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                        className="p-4 bg-white/80 dark:bg-slate-700/80 rounded-2xl border border-white/20 dark:border-slate-600/50"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Calendar className="w-5 h-5 text-green-500" />
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Date de demande</label>
                                        </div>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{new Date(epiRequest.date_demande).toLocaleDateString()}</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6, duration: 0.5 }}
                                        className="p-4 bg-white/80 dark:bg-slate-700/80 rounded-2xl border border-white/20 dark:border-slate-600/50"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <UserCheck className="w-5 h-5 text-purple-500" />
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Demandeur</label>
                                        </div>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{epiRequest.user.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{epiRequest.user.email}</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7, duration: 0.5 }}
                                        className="p-4 bg-white/80 dark:bg-slate-700/80 rounded-2xl border border-white/20 dark:border-slate-600/50"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Shield className="w-5 h-5 text-orange-500" />
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">État actuel</label>
                                        </div>
                                        <div className="mt-1">
                                            {getEtatBadge(epiRequest.etat)}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* EPI List */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                >
                                    <div className="text-center mb-6">
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl mb-3"
                                        >
                                            <Package className="w-6 h-6 text-white" />
                                        </motion.div>
                                        <h3 className="text-xl font-black bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 dark:from-white dark:via-emerald-100 dark:to-teal-100 bg-clip-text text-transparent">
                                            Liste des EPI demandés
                                        </h3>
                                    </div>
                                    <div className="space-y-4">
                                        {formattedEpiList.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                className="bg-white/80 dark:bg-slate-700/80 rounded-2xl p-6 border border-white/20 dark:border-slate-600/50 shadow-lg"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{item.epi}</h4>
                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                                            <div className="flex items-center gap-2">
                                                                <Package className="w-4 h-4" />
                                                                <span>Quantité: <strong className="text-slate-900 dark:text-white">{item.quantite}</strong></span>
                                                            </div>
                                                            {item.taille && (
                                                                <div className="flex items-center gap-2">
                                                                    <User className="w-4 h-4" />
                                                                    <span>Taille: <strong className="text-slate-900 dark:text-white">{item.taille}</strong></span>
                                                                </div>
                                                            )}
                                                            {item.pointure && (
                                                                <div className="flex items-center gap-2">
                                                                    <Shield className="w-4 h-4" />
                                                                    <span>Pointure: <strong className="text-slate-900 dark:text-white">{item.pointure}</strong></span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Admin Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="lg:col-span-1"
                    >
                        <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50 dark:from-emerald-900/20 dark:via-teal-900/10 dark:to-cyan-900/20" />
                            <div className="relative p-8">
                                <div className="text-center mb-8">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl mb-4"
                                    >
                                        <Edit3 className="w-7 h-7 text-white" />
                                    </motion.div>
                                    <h2 className="text-2xl font-black bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 dark:from-white dark:via-emerald-100 dark:to-teal-100 bg-clip-text text-transparent mb-2">
                                        Traiter la demande
                                    </h2>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                    >
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">
                                            État de la demande
                                        </label>
                                        <div className="relative group">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                            <select
                                                value={formData.etat}
                                                onChange={(e) => handleInputChange('etat', e.target.value)}
                                                className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
                                                    errors.etat ? "border-red-500 focus:ring-red-500/20" : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                                                }`}
                                            >
                                                <option value="en_cours">En cours</option>
                                                <option value="en_traitement">En traitement</option>
                                                <option value="done">Terminé</option>
                                                <option value="rejected">Rejeté</option>
                                            </select>
                                        </div>
                                        {errors.etat && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                                            >
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.etat}
                                            </motion.p>
                                        )}
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6, duration: 0.5 }}
                                    >
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">
                                            Commentaires
                                        </label>
                                        <textarea
                                            value={formData.commentaires_admin}
                                            onChange={(e) => handleInputChange('commentaires_admin', e.target.value)}
                                            rows={4}
                                            className={`w-full px-4 py-4 rounded-2xl border-2 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none ${
                                                errors.commentaires_admin ? "border-red-500 focus:ring-red-500/20" : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                                            }`}
                                            placeholder="Ajoutez des commentaires sur le traitement de cette demande..."
                                        />
                                        {errors.commentaires_admin && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                                            >
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.commentaires_admin}
                                            </motion.p>
                                        )}
                                    </motion.div>

                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        className="w-full group relative inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white rounded-2xl hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 transition-all duration-300 font-bold shadow-2xl overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                            className="relative z-10"
                                        >
                                            <Save className="w-5 h-5" />
                                        </motion.div>
                                        <span className="relative z-10">Mettre à jour la demande</span>
                                    </motion.button>
                                </form>

                                {/* Processing History */}
                                {epiRequest.admin && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7, duration: 0.5 }}
                                        className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700"
                                    >
                                        <div className="text-center mb-4">
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl shadow-2xl mb-3"
                                            >
                                                <History className="w-5 h-5 text-white" />
                                            </motion.div>
                                            <h3 className="text-lg font-black bg-gradient-to-r from-slate-900 via-purple-900 to-pink-900 dark:from-white dark:via-purple-100 dark:to-pink-100 bg-clip-text text-transparent">
                                                Historique
                                            </h3>
                                        </div>
                                        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <UserCheck className="w-4 h-4 text-purple-500" />
                                                <span>Traité par: <strong className="text-slate-900 dark:text-white">{epiRequest.admin.full_name || epiRequest.admin.email}</strong></span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-blue-500" />
                                                <span>Dernière mise à jour: <strong className="text-slate-900 dark:text-white">{new Date(epiRequest.updated_at).toLocaleDateString()}</strong></span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

// Set the layout
AdminEPIRequestShow.layout = (page) => <AdminLayout>{page}</AdminLayout>;