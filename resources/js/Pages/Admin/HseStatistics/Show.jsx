import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    BarChart3, 
    ArrowLeft, 
    Building2, 
    Calendar, 
    Users, 
    Clock, 
    Shield, 
    AlertTriangle, 
    CheckCircle, 
    Download,
    FileText,
    TrendingUp,
    Award,
    Target,
    Activity,
    Zap
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function HseStatisticsShow({ statistics, source }) {
    const fileFields = [
        { key: 'accident_report', label: 'Rapport d\'Accident', icon: AlertTriangle },
        { key: 'inspection_generales_report', label: 'Rapport Inspections Générales', icon: BarChart3 },
        { key: 'inspection_engins_report', label: 'Rapport Inspections Engins', icon: Activity },
        { key: 'hygiene_base_vie_report', label: 'Rapport Hygiène Base de Vie', icon: Shield },
        { key: 'outils_electroportatifs_report', label: 'Rapport Outils Électroportatifs', icon: Zap },
        { key: 'inspection_electriques_report', label: 'Rapport Inspections Électriques', icon: Zap },
        { key: 'extincteurs_report', label: 'Rapport Extincteurs', icon: Shield },
        { key: 'protections_collectives_report', label: 'Rapport Protections Collectives', icon: Shield },
        { key: 'epi_inspections_report', label: 'Rapport EPI Inspections', icon: Shield },
        { key: 'observations_hse_report', label: 'Rapport Observations HSE', icon: Target },
        { key: 'actions_correctives_cloturees_report', label: 'Rapport Actions Correctives', icon: CheckCircle },
    ];

    const getSafetyIndicatorColor = (value, type) => {
        if (type === 'trir') {
            return value > 3.0 ? 'text-red-500' : value > 1.0 ? 'text-yellow-500' : 'text-emerald-500';
        }
        if (type === 'ltir') {
            return value > 1.0 ? 'text-red-500' : value > 0.5 ? 'text-yellow-500' : 'text-emerald-500';
        }
        if (type === 'dart') {
            return value > 1.0 ? 'text-red-500' : value > 0.5 ? 'text-yellow-500' : 'text-emerald-500';
        }
        return 'text-slate-500';
    };

    const getSafetyIndicatorBg = (value, type) => {
        if (type === 'trir') {
            return value > 3.0 ? 'bg-red-50 border-red-200' : value > 1.0 ? 'bg-yellow-50 border-yellow-200' : 'bg-emerald-50 border-emerald-200';
        }
        if (type === 'ltir') {
            return value > 1.0 ? 'bg-red-50 border-red-200' : value > 0.5 ? 'bg-yellow-50 border-yellow-200' : 'bg-emerald-50 border-emerald-200';
        }
        if (type === 'dart') {
            return value > 1.0 ? 'bg-red-50 border-red-200' : value > 0.5 ? 'bg-yellow-50 border-yellow-200' : 'bg-emerald-50 border-emerald-200';
        }
        return 'bg-slate-50 border-slate-200';
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
        <AdminLayout>
            <Head title={`Statistiques HSE - ${statistics.contractor?.name || 'N/A'}`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
                {/* Enhanced Animated Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl animate-pulse" />
                </div>

                <div className="relative z-10 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                                <BarChart3 className="w-8 h-8 text-white" />
                                            </motion.div>
                                    <div>
                                                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                                    Statistiques HSE
                                        </h1>
                                                <p className="text-xl font-semibold text-slate-600 dark:text-slate-400 mt-1">
                                                    {statistics.contractor?.name || 'N/A'}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-4 h-4" />
                                                        <span>{statistics.site}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4" />
                                                        <span>{statistics.contractor?.company_name || statistics.contractor?.name || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{new Date(statistics.date).toLocaleDateString('fr-FR')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Link
                                                href={source === 'aggregated' ? route('admin.hse-statistics.aggregated') : route('admin.hse-statistics.index')}
                                                className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg hover:shadow-xl"
                                            >
                                                <ArrowLeft className="w-5 h-5" />
                                            Retour
                                        </Link>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Basic Information Cards */}
                            <motion.div
                                variants={cardVariants}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                            >
                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                                            <Building2 className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Informations de Base</h3>
                                        </div>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Site', value: statistics.site, icon: Building2 },
                                            { label: 'Date', value: new Date(statistics.date).toLocaleDateString('fr-FR'), icon: Calendar },
                                            { label: 'Contractant', value: statistics.contractor?.company_name || statistics.contractor?.name || 'N/A', icon: Users },
                                            { label: 'Soumis le', value: new Date(statistics.created_at).toLocaleString('fr-FR'), icon: Clock }
                                        ].map((item, index) => (
                                            <motion.div
                                                key={item.label}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="w-5 h-5 text-slate-500" />
                                                    <span className="font-medium text-slate-600 dark:text-slate-300">{item.label}:</span>
                                        </div>
                                                <span className="font-semibold text-slate-800 dark:text-white">{item.value}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Personnel & Heures</h3>
                                        </div>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Effectif Personnel', value: statistics.effectif_personnel, icon: Users },
                                            { label: 'Heures Normales', value: statistics.heures_normales ? Number(statistics.heures_normales).toFixed(2) : '0.00', icon: Clock },
                                            { label: 'Heures Supplémentaires', value: statistics.heures_supplementaires ? Number(statistics.heures_supplementaires).toFixed(2) : '0.00', icon: Clock },
                                            { label: 'Total Heures', value: statistics.total_heures ? Number(statistics.total_heures).toFixed(2) : '0.00', icon: Clock }
                                        ].map((item, index) => (
                                            <motion.div
                                                key={item.label}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="w-5 h-5 text-slate-500" />
                                                    <span className="font-medium text-slate-600 dark:text-slate-300">{item.label}:</span>
                                        </div>
                                                <span className="font-semibold text-slate-800 dark:text-white">{item.value}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Safety Indicators */}
                            <motion.div
                                variants={cardVariants}
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8"
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Indicateurs de Sécurité</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { key: 'trir', label: 'TRIR', description: 'Total Recordable Incident Rate', value: statistics.trir, icon: TrendingUp },
                                        { key: 'ltir', label: 'LTIR', description: 'Lost Time Incident Rate', value: statistics.ltir, icon: AlertTriangle },
                                        { key: 'dart', label: 'DART', description: 'Days Away, Restricted, or Transferred', value: statistics.dart, icon: Activity }
                                    ].map((indicator, index) => (
                                        <motion.div
                                            key={indicator.key}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.2 }}
                                            className={`p-6 rounded-2xl border-2 ${getSafetyIndicatorBg(indicator.value, indicator.key)} hover:shadow-lg transition-all`}
                                        >
                                    <div className="text-center">
                                                <div className="flex justify-center mb-4">
                                                    <div className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-lg">
                                                        <indicator.icon className="w-8 h-8 text-slate-600" />
                                        </div>
                                    </div>
                                                <div className={`text-4xl font-bold mb-2 ${getSafetyIndicatorColor(indicator.value, indicator.key)}`}>
                                                    {indicator.value ? Number(indicator.value).toFixed(4) : '0.0000'}
                                        </div>
                                                <div className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">{indicator.label}</div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400">{indicator.description}</div>
                                    </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Accidents & Incidents */}
                            <motion.div
                                variants={cardVariants}
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8"
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
                                        <AlertTriangle className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Accidents & Incidents</h3>
                                    </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Accidents Mortels', value: statistics.acc_mortel || 0, color: 'text-red-500', bg: 'bg-red-50 border-red-200' },
                                        { label: 'Accidents avec Arrêt', value: statistics.acc_arret || 0, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200' },
                                        { label: 'Soins Médicaux', value: statistics.acc_soins_medicaux || 0, color: 'text-yellow-500', bg: 'bg-yellow-50 border-yellow-200' },
                                        { label: 'Restriction Temporaire', value: statistics.acc_restriction_temporaire || 0, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
                                        { label: 'Premier Soin', value: statistics.premier_soin || 0, color: 'text-green-500', bg: 'bg-green-50 border-green-200' },
                                        { label: 'Presque Accidents', value: statistics.presque_accident || 0, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-200' },
                                        { label: 'Dommages Matériels', value: statistics.dommage_materiel || 0, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-200' },
                                        { label: 'Incidents Environnementaux', value: statistics.incident_environnemental || 0, color: 'text-pink-500', bg: 'bg-pink-50 border-pink-200' }
                                    ].map((item, index) => (
                                        <motion.div
                                            key={item.label}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`p-4 rounded-2xl border-2 ${item.bg} hover:shadow-lg transition-all`}
                                        >
                                    <div className="text-center">
                                                <div className={`text-3xl font-bold mb-2 ${item.color}`}>{item.value}</div>
                                                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{item.label}</div>
                                    </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Training & Awareness */}
                            <motion.div
                                variants={cardVariants}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                            >
                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                                            <Target className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Sensibilisation</h3>
                                        </div>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Nombre de Sensibilisations', value: statistics.nb_sensibilisations || 0, icon: Target },
                                            { label: 'Personnes Sensibilisées', value: statistics.personnes_sensibilisees || 0, icon: Users },
                                            { label: 'Moyenne Sensibilisation', value: `${statistics.moyenne_sensibilisation_pourcent ? Number(statistics.moyenne_sensibilisation_pourcent).toFixed(2) : '0.00'}%`, icon: TrendingUp }
                                        ].map((item, index) => (
                                            <motion.div
                                                key={item.label}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="w-5 h-5 text-slate-500" />
                                                    <span className="font-medium text-slate-600 dark:text-slate-300">{item.label}:</span>
                                        </div>
                                                <span className="font-semibold text-slate-800 dark:text-white">{item.value}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl">
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Formations</h3>
                                        </div>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Total Séances', value: statistics.formations_total_seances || 0, icon: Calendar },
                                            { label: 'Total Participants', value: statistics.formations_total_participants || 0, icon: Users },
                                            { label: 'Total Heures', value: statistics.formations_total_heures ? Number(statistics.formations_total_heures).toFixed(2) : '0.00', icon: Clock }
                                        ].map((item, index) => (
                                            <motion.div
                                                key={item.label}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="w-5 h-5 text-slate-500" />
                                                    <span className="font-medium text-slate-600 dark:text-slate-300">{item.label}:</span>
                                        </div>
                                                <span className="font-semibold text-slate-800 dark:text-white">{item.value}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Permits & PTSR */}
                            <motion.div
                                variants={cardVariants}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                            >
                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                                            <FileText className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Permis</h3>
                                        </div>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Permis Général', value: statistics.permis_general || 0, icon: FileText },
                                            { label: 'Permis Spécifiques', value: statistics.permis_specifiques_total || 0, icon: FileText },
                                            { label: 'Total Permis', value: statistics.permis_total || 0, icon: FileText }
                                        ].map((item, index) => (
                                            <motion.div
                                                key={item.label}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="w-5 h-5 text-slate-500" />
                                                    <span className="font-medium text-slate-600 dark:text-slate-300">{item.label}:</span>
                                        </div>
                                                <span className="font-semibold text-slate-800 dark:text-white">{item.value}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl">
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">PTSR</h3>
                                        </div>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'PTSR Total', value: statistics.ptsr_total || 0, icon: CheckCircle },
                                            { label: 'PTSR Contrôlés', value: statistics.ptsr_controles || 0, icon: CheckCircle },
                                            { label: 'Pourcentage Contrôlés', value: `${statistics.ptsr_controles_pourcent ? Number(statistics.ptsr_controles_pourcent).toFixed(2) : '0.00'}%`, icon: TrendingUp }
                                        ].map((item, index) => (
                                            <motion.div
                                                key={item.label}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="w-5 h-5 text-slate-500" />
                                                    <span className="font-medium text-slate-600 dark:text-slate-300">{item.label}:</span>
                                        </div>
                                                <span className="font-semibold text-slate-800 dark:text-white">{item.value}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Inspections */}
                            <motion.div
                                variants={cardVariants}
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8"
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                                        <BarChart3 className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Inspections</h3>
                                    </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                                    {[
                                        { label: 'Générales', value: statistics.inspections_generales || 0, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
                                        { label: 'Engins', value: statistics.inspections_engins || 0, color: 'text-green-500', bg: 'bg-green-50 border-green-200' },
                                        { label: 'Hygiène', value: statistics.hygiene_base_vie || 0, color: 'text-yellow-500', bg: 'bg-yellow-50 border-yellow-200' },
                                        { label: 'Observations', value: statistics.observations_hse || 0, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-200' },
                                        { label: 'Actions Clôturées', value: statistics.actions_correctives_cloturees || 0, color: 'text-red-500', bg: 'bg-red-50 border-red-200' }
                                    ].map((item, index) => (
                                        <motion.div
                                            key={item.label}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`p-4 rounded-2xl border-2 ${item.bg} hover:shadow-lg transition-all`}
                                        >
                                    <div className="text-center">
                                                <div className={`text-2xl font-bold mb-2 ${item.color}`}>{item.value}</div>
                                                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{item.label}</div>
                                    </div>
                                        </motion.div>
                                    ))}
                                    </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl"
                                    >
                                        <span className="font-medium text-slate-600 dark:text-slate-300">Total Inspections HSE:</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">{statistics.inspections_total_hse || 0}</span>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl"
                                    >
                                        <span className="font-medium text-slate-600 dark:text-slate-300">Taux de Fermeture Actions:</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">{statistics.taux_fermeture_actions_pourcent ? Number(statistics.taux_fermeture_actions_pourcent).toFixed(2) : '0.00'}%</span>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* File Downloads */}
                            <motion.div
                                variants={cardVariants}
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8"
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                                        <Download className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Rapports Téléchargés</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {fileFields.map(({ key, label, icon: Icon }, index) => (
                                        <motion.div
                                            key={key}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white dark:bg-slate-600 rounded-lg">
                                                    <Icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                                                </div>
                                                <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
                            </div>
                                            {statistics[key] ? (
                                                <motion.a
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    href={route('admin.hse-statistics.download', [statistics.id, key])}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all font-medium shadow-lg"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Télécharger
                                                </motion.a>
                                            ) : (
                                                <span className="text-sm text-slate-400 dark:text-slate-500">Non fourni</span>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}