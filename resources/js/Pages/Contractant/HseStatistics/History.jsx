import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BarChart3, History, Users, Clock, Award, Eye, Edit, X, ArrowLeft } from 'lucide-react';
import ContractantSidebar from '@/Components/ContractantSidebar';
import ContractantTopHeader from '@/Components/ContractantTopHeader';

export default function HseStatisticsHistory({ records, contractor }) {
    const { flash } = usePage().props;

    const getSafetyIndicatorColor = (value, type) => {
        if (type === 'trir') {
            return value > 3.0 ? 'text-red-600' : value > 1.0 ? 'text-yellow-600' : 'text-green-600';
        }
        if (type === 'ltir') {
            return value > 1.0 ? 'text-red-600' : value > 0.5 ? 'text-yellow-600' : 'text-green-600';
        }
        if (type === 'dart') {
            return value > 1.0 ? 'text-red-600' : value > 0.5 ? 'text-yellow-600' : 'text-green-600';
        }
        return 'text-gray-600';
    };

    // Calculate summary statistics
    const totalSubmissions = records?.length || 0;
    const totalHeures = records?.reduce((sum, record) => {
        return sum + (record.total_heures ? Number(record.total_heures) : 
                     (Number(record.heures_normales || 0) + Number(record.heures_supplementaires || 0)));
    }, 0) || 0;
    const totalPermis = records?.reduce((sum, record) => sum + Number(record.permis_total || 0), 0) || 0;
    const totalInspections = records?.reduce((sum, record) => {
        return sum + (record.inspections_total_hse || 
                     (Number(record.inspections_generales || 0) + Number(record.inspections_engins || 0)));
    }, 0) || 0;

    return (
        <>
            <Head title="Historique des Statistiques HSE" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden flex">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59,130,246,0.3) 1px, transparent 0)`,
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
                        backRoute={route('contractant.home')}
                        backLabel="Retour au tableau de bord"
                    />

                    {/* Page Content */}
                    <div className="flex-1 px-6 py-8 overflow-y-auto">
                        <div className="max-w-7xl mx-auto">
            {/* Status Messages */}
            <AnimatePresence>
                {flash?.success && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative z-10 px-6 mb-6"
                    >
                        <div className="max-w-7xl mx-auto">
                            <div className="bg-green-50 backdrop-blur-sm border border-green-200 rounded-xl p-4 flex items-center space-x-3 shadow-lg">
                                <BarChart3 className="w-5 h-5 text-green-600" />
                                <p className="text-green-700 font-medium">{flash.success}</p>
                                    </div>
                                </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center mb-12"
            >
                <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                        <History className="w-8 h-8 text-white" />
                    </div>
                </div>
                
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                                            Historique des Statistiques HSE
                                        </h1>
                
                <p className="text-gray-600 text-lg">Consultez l'historique de vos soumissions de statistiques HSE</p>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex justify-center mt-8"
                >
                                        <Link
                                            href={route('contractant.hse-statistics.index')}
                        className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl text-blue-700 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/50 hover:text-blue-600 transition-all duration-300 backdrop-blur-sm"
                                        >
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">Nouvelle Soumission</span>
                                        </Link>
                </motion.div>
            </motion.div>

            {/* Statistics Summary Cards */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
                {/* Total Soumissions */}
                <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/80 backdrop-blur-xl border border-blue-200/50 rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
                    style={{
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.05) 100%)',
                        backdropFilter: 'blur(20px)'
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Total Soumissions</p>
                            <p className="text-3xl font-bold text-blue-600">{totalSubmissions}</p>
                                    </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                            </div>
                </motion.div>

                {/* Heures Total */}
                <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/80 backdrop-blur-xl border border-green-200/50 rounded-2xl p-6 shadow-2xl hover:shadow-green-500/10 transition-all duration-300"
                    style={{
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.05) 100%)',
                        backdropFilter: 'blur(20px)'
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Heures Total</p>
                            <p className="text-3xl font-bold text-green-600">{totalHeures.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-white" />
                                    </div>
                                        </div>
                </motion.div>

                {/* Permis Total */}
                <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/80 backdrop-blur-xl border border-orange-200/50 rounded-2xl p-6 shadow-2xl hover:shadow-orange-500/10 transition-all duration-300"
                    style={{
                        background: 'linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(249,115,22,0.05) 100%)',
                        backdropFilter: 'blur(20px)'
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Permis Total</p>
                            <p className="text-3xl font-bold text-orange-600">{totalPermis}</p>
                                    </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                </motion.div>

                {/* Inspections Total */}
                <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/80 backdrop-blur-xl border border-purple-200/50 rounded-2xl p-6 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
                    style={{
                        background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.05) 100%)',
                        backdropFilter: 'blur(20px)'
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Inspections Total</p>
                            <p className="text-3xl font-bold text-purple-600">{totalInspections}</p>
                                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                </motion.div>
            </motion.div>

                            {/* Records Table */}
            {records && records.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
                        backdropFilter: 'blur(20px)'
                    }}
                >
                                <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">Site</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">Date</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">Personnel</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">Heures Total</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">TRIR</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">LTIR</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">DART</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">Permis</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">Inspections</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">Soumis le</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                            <tbody className="divide-y divide-gray-200">
                                {records.map((record, index) => (
                                    <motion.tr
                                        key={record.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        whileHover={{ backgroundColor: 'rgba(59,130,246,0.05)' }}
                                        className="hover:bg-blue-50/50 transition-colors duration-200"
                                    >
                                        <td className="py-4 px-6 text-gray-800 font-medium">{record.site || 'N/A'}</td>
                                        <td className="py-4 px-6 text-gray-600">{new Date(record.date).toLocaleDateString('fr-FR')}</td>
                                        <td className="py-4 px-6 text-gray-600">{record.effectif_personnel || 0}</td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {record.total_heures ? Number(record.total_heures).toFixed(2) : 
                                             (Number(record.heures_normales || 0) + Number(record.heures_supplementaires || 0)).toFixed(2)}
                                                    </td>
                                        <td className={`py-4 px-6 font-medium ${getSafetyIndicatorColor(record.trir || 0, 'trir')}`}>
                                            {Number(record.trir || 0).toFixed(4)}
                                                    </td>
                                        <td className={`py-4 px-6 font-medium ${getSafetyIndicatorColor(record.ltir || 0, 'ltir')}`}>
                                            {Number(record.ltir || 0).toFixed(4)}
                                                    </td>
                                        <td className={`py-4 px-6 font-medium ${getSafetyIndicatorColor(record.dart || 0, 'dart')}`}>
                                            {Number(record.dart || 0).toFixed(4)}
                                                    </td>
                                        <td className="py-4 px-6 text-gray-600">{record.permis_total || 0}</td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {record.inspections_total_hse || 
                                             (Number(record.inspections_generales || 0) + Number(record.inspections_engins || 0))}
                                                    </td>
                                        <td className="py-4 px-6 text-gray-600">{new Date(record.created_at).toLocaleDateString('fr-FR')}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex space-x-3">
                                                {/* Voir Détails Button */}
                                                            <Link
                                                                href={route('contractant.hse-statistics.show', record.id)}
                                                    className="group relative inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl text-blue-700 hover:from-blue-500/20 hover:to-purple-500/20 hover:border-blue-400/50 hover:text-blue-600 transition-all duration-300 text-sm font-medium backdrop-blur-sm shadow-lg hover:shadow-blue-500/25"
                                                    style={{
                                                        background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)',
                                                        backdropFilter: 'blur(10px)',
                                                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.2)'
                                                    }}
                                                >
                                                    {/* Animated Background Glow */}
                                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 blur-sm transition-opacity duration-300" />
                                                    
                                                    {/* Icon */}
                                                    <div className="relative z-10 flex items-center justify-center w-4 h-4">
                                                        <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                                    </div>
                                                    
                                                    {/* Text */}
                                                    <span className="relative z-10">Voir détails</span>
                                                    
                                                    {/* Hover Effect */}
                                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                            </Link>

                                                {/* Modifier Button */}
                                                            <Link
                                                                href={route('contractant.hse-statistics.edit', record.id)}
                                                    className="group relative inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl text-green-700 hover:from-green-500/20 hover:to-emerald-500/20 hover:border-green-400/50 hover:text-green-600 transition-all duration-300 text-sm font-medium backdrop-blur-sm shadow-lg hover:shadow-green-500/25"
                                                    style={{
                                                        background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(16,185,129,0.1) 100%)',
                                                        backdropFilter: 'blur(10px)',
                                                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(34, 197, 94, 0.2)'
                                                    }}
                                                >
                                                    {/* Animated Background Glow */}
                                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-10 blur-sm transition-opacity duration-300" />
                                                    
                                                    {/* Icon */}
                                                    <div className="relative z-10 flex items-center justify-center w-4 h-4">
                                                        <Edit className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                                    </div>
                                                    
                                                    {/* Text */}
                                                    <span className="relative z-10">Modifier</span>
                                                    
                                                    {/* Hover Effect */}
                                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                            </Link>
                                                        </div>
                                                    </td>
                                    </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-center py-16"
                >
                    <div className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-12 shadow-2xl max-w-md mx-auto"
                         style={{
                             background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
                             backdropFilter: 'blur(20px)'
                         }}>
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <BarChart3 className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Aucun historique</h3>
                        <p className="text-gray-600 mb-6">Vous n'avez pas encore soumis de statistiques HSE.</p>
                                    <Link
                                        href={route('contractant.hse-statistics.index')}
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                                    >
                            <Plus className="w-5 h-5" />
                            <span>Soumettre une Statistique</span>
                                    </Link>
                                </div>
                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
