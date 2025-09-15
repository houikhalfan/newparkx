import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, FileText, Calendar, Building, Users, Clock, BarChart3, AlertTriangle, Shield, Award, Eye } from 'lucide-react';
import ContractantSidebar from '@/Components/ContractantSidebar';
import ContractantTopHeader from '@/Components/ContractantTopHeader';

export default function HseStatisticsShow({ statistic, contractor }) {
    const getSafetyIndicatorColor = (value, type) => {
        if (type === 'trir') {
            return value > 3.0 ? 'text-red-400' : value > 1.0 ? 'text-yellow-400' : 'text-emerald-400';
        }
        if (type === 'ltir') {
            return value > 1.0 ? 'text-red-400' : value > 0.5 ? 'text-yellow-400' : 'text-emerald-400';
        }
        if (type === 'dart') {
            return value > 1.0 ? 'text-red-400' : value > 0.5 ? 'text-yellow-400' : 'text-emerald-400';
        }
        return 'text-gray-400';
    };

    const totalHeures = Number(statistic.heures_normales || 0) + Number(statistic.heures_supplementaires || 0);
    const totalAccidents = Number(statistic.acc_mortel || 0) + Number(statistic.acc_arret || 0) + Number(statistic.acc_soins_medicaux || 0) + 
                          Number(statistic.acc_restriction_temporaire || 0) + Number(statistic.premier_soin || 0);
    const totalFormations = Number(statistic.formations_total_seances || 0);

    return (
        <>
            <Head title={`Statistiques HSE #${statistic.id}`} />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-emerald-900 relative overflow-hidden flex">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(6,182,212,0.3) 1px, transparent 0)`,
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                {/* Sidebar */}
                <ContractantSidebar />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                    {/* Top Header */}
                    <ContractantTopHeader 
                        contractor={contractor}
                        showBackButton={true}
                        backRoute={route('contractant.hse-statistics.history')}
                        backLabel="Retour à l'historique"
                    />

                    {/* Main Content */}
                    <div className="relative z-10 px-6 pb-12 flex-1 pt-8">
                        <div className="max-w-7xl mx-auto">
                            {/* Page Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-center mb-12"
                            >
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                    <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                                        Statistiques HSE #{statistic.id}
                                    </span>
                                </h1>
                                <div className="flex items-center justify-center space-x-4 text-gray-300">
                                    <div className="flex items-center space-x-2">
                                        <Building className="w-5 h-5 text-cyan-400" />
                                        <span>{statistic.site}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-5 h-5 text-emerald-400" />
                                        <span>{new Date(statistic.date).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                                {/* Total Hours */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-300 mb-1">Total Heures</p>
                                            <p className="text-3xl font-bold text-cyan-300">{totalHeures.toFixed(2)}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                                            <Clock className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Total Accidents */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-300 mb-1">Total Accidents</p>
                                            <p className="text-3xl font-bold text-red-300">{totalAccidents}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                                            <AlertTriangle className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Total Formations */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-300 mb-1">Formations</p>
                                            <p className="text-3xl font-bold text-emerald-300">{totalFormations}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Personnel */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-300 mb-1">Personnel</p>
                                            <p className="text-3xl font-bold text-purple-300">{statistic.effectif_personnel || 0}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Detailed Information */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                {/* Basic Information */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                                            <FileText className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Informations de Base</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                            <span className="text-gray-300">Site:</span>
                                            <span className="font-medium text-white">{statistic.site}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                            <span className="text-gray-300">Date:</span>
                                            <span className="font-medium text-white">{new Date(statistic.date).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-300">Soumis le:</span>
                                            <span className="font-medium text-white">{new Date(statistic.created_at).toLocaleString('fr-FR')}</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Personnel & Hours */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.7 }}
                                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg">
                                            <Clock className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Personnel & Heures</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                            <span className="text-gray-300">Effectif Personnel:</span>
                                            <span className="font-medium text-white">{statistic.effectif_personnel || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                            <span className="text-gray-300">Heures Normales:</span>
                                            <span className="font-medium text-white">{statistic.heures_normales ? Number(statistic.heures_normales).toFixed(2) : '0.00'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                            <span className="text-gray-300">Heures Supplémentaires:</span>
                                            <span className="font-medium text-white">{statistic.heures_supplementaires ? Number(statistic.heures_supplementaires).toFixed(2) : '0.00'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-300">Total Heures:</span>
                                            <span className="font-medium text-cyan-300">{totalHeures.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Safety Indicators */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl mb-8"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                    backdropFilter: 'blur(20px)'
                                }}
                            >
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                                        <BarChart3 className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Indicateurs de Sécurité</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-6 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl border border-red-500/20">
                                        <div className={`text-4xl font-bold ${getSafetyIndicatorColor(statistic.trir, 'trir')}`}>
                                            {statistic.trir ? Number(statistic.trir).toFixed(4) : '0.0000'}
                                        </div>
                                        <div className="text-sm font-medium text-red-300 mt-2">TRIR</div>
                                        <div className="text-xs text-red-400/70 mt-1">Total Recordable Incident Rate</div>
                                    </div>
                                    <div className="text-center p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl border border-yellow-500/20">
                                        <div className={`text-4xl font-bold ${getSafetyIndicatorColor(statistic.ltir, 'ltir')}`}>
                                            {statistic.ltir ? Number(statistic.ltir).toFixed(4) : '0.0000'}
                                        </div>
                                        <div className="text-sm font-medium text-yellow-300 mt-2">LTIR</div>
                                        <div className="text-xs text-yellow-400/70 mt-1">Lost Time Incident Rate</div>
                                    </div>
                                    <div className="text-center p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-xl border border-emerald-500/20">
                                        <div className={`text-4xl font-bold ${getSafetyIndicatorColor(statistic.dart, 'dart')}`}>
                                            {statistic.dart ? Number(statistic.dart).toFixed(4) : '0.0000'}
                                        </div>
                                        <div className="text-sm font-medium text-emerald-300 mt-2">DART</div>
                                        <div className="text-xs text-emerald-400/70 mt-1">Days Away, Restricted, or Transferred</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Accidents & Incidents */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.9 }}
                                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl mb-8"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                    backdropFilter: 'blur(20px)'
                                }}
                            >
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg">
                                        <AlertTriangle className="w-6 h-6 text-red-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Accidents & Incidents</h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { key: 'acc_mortel', label: 'Accidents Mortels', color: 'from-red-500/10 to-red-600/10', borderColor: 'border-red-500/20', textColor: 'text-red-400' },
                                        { key: 'acc_arret', label: 'Accidents avec Arrêt', color: 'from-orange-500/10 to-orange-600/10', borderColor: 'border-orange-500/20', textColor: 'text-orange-400' },
                                        { key: 'acc_soins_medicaux', label: 'Soins Médicaux', color: 'from-yellow-500/10 to-yellow-600/10', borderColor: 'border-yellow-500/20', textColor: 'text-yellow-400' },
                                        { key: 'acc_restriction_temporaire', label: 'Restriction Temporaire', color: 'from-blue-500/10 to-blue-600/10', borderColor: 'border-blue-500/20', textColor: 'text-blue-400' },
                                        { key: 'premier_soin', label: 'Premier Soin', color: 'from-green-500/10 to-green-600/10', borderColor: 'border-green-500/20', textColor: 'text-green-400' },
                                        { key: 'presque_accident', label: 'Presque Accidents', color: 'from-purple-500/10 to-purple-600/10', borderColor: 'border-purple-500/20', textColor: 'text-purple-400' },
                                        { key: 'dommage_materiel', label: 'Dommages Matériels', color: 'from-indigo-500/10 to-indigo-600/10', borderColor: 'border-indigo-500/20', textColor: 'text-indigo-400' },
                                        { key: 'incident_environnemental', label: 'Incidents Environnementaux', color: 'from-pink-500/10 to-pink-600/10', borderColor: 'border-pink-500/20', textColor: 'text-pink-400' },
                                    ].map(({ key, label, color, borderColor, textColor }) => (
                                        <div key={key} className={`text-center p-4 bg-gradient-to-br ${color} rounded-xl border ${borderColor}`}>
                                            <div className={`text-2xl font-bold ${textColor}`}>{statistic[key] || 0}</div>
                                            <div className="text-sm text-gray-300 mt-1">{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Training & Permits Summary */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 1.0 }}
                                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg">
                                            <Users className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Formations</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                            <span className="text-gray-300">Total Séances:</span>
                                            <span className="font-medium text-white">{statistic.formations_total_seances || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                            <span className="text-gray-300">Total Participants:</span>
                                            <span className="font-medium text-white">{statistic.formations_total_participants || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-300">Total Heures:</span>
                                            <span className="font-medium text-emerald-300">{statistic.formations_total_heures ? Number(statistic.formations_total_heures).toFixed(2) : '0.00'}</span>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 1.1 }}
                                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                                            <Shield className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Permis & Inspections</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                            <span className="text-gray-300">Total Permis:</span>
                                            <span className="font-medium text-white">{statistic.permis_total || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                            <span className="text-gray-300">Total Inspections:</span>
                                            <span className="font-medium text-white">{statistic.inspections_total_hse || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-300">PTSR Contrôlés:</span>
                                            <span className="font-medium text-cyan-300">{statistic.ptsr_controles || 0}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* File Downloads */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1.2 }}
                                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                    backdropFilter: 'blur(20px)'
                                }}
                            >
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                                        <Download className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Rapports Téléchargés</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { key: 'accident_report', label: 'Rapport d\'Accident' },
                                        { key: 'inspection_generales_report', label: 'Rapport Inspections Générales' },
                                        { key: 'inspection_engins_report', label: 'Rapport Inspections Engins' },
                                        { key: 'hygiene_base_vie_report', label: 'Rapport Hygiène Base de Vie' },
                                        { key: 'outils_electroportatifs_report', label: 'Rapport Outils Électroportatifs' },
                                        { key: 'inspection_electriques_report', label: 'Rapport Inspections Électriques' },
                                        { key: 'extincteurs_report', label: 'Rapport Extincteurs' },
                                        { key: 'protections_collectives_report', label: 'Rapport Protections Collectives' },
                                        { key: 'epi_inspections_report', label: 'Rapport EPI Inspections' },
                                        { key: 'observations_hse_report', label: 'Rapport Observations HSE' },
                                        { key: 'actions_correctives_cloturees_report', label: 'Rapport Actions Correctives' },
                                    ].map(({ key, label }) => (
                                        <div key={key} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors duration-200">
                                            <span className="text-sm text-gray-300">{label}</span>
                                            {statistic[key] ? (
                                                <Link
                                                    href={route('contractant.hse-statistics.download', [statistic.id, key])}
                                                    className="group inline-flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/50 hover:text-cyan-200 transition-all duration-300 text-xs font-medium"
                                                >
                                                    <Download className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                                    <span>Télécharger</span>
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-gray-500">Non fourni</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}