import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
  BarChart3, 
  Search, 
  Filter, 
  TrendingUp, 
  Building2, 
  Calendar,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  FileText
} from 'lucide-react';

export default function HseStatisticsIndex({ statistics, filters: initialFilters = {} }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [filters, setFilters] = useState({
        site: initialFilters.site || '',
        date: initialFilters.date || '',
        entreprise: initialFilters.entreprise || ''
    });

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Real-time filtering with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(route('admin.hse-statistics.index'), filters, {
                preserveState: true,
                replace: true
            });
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [filters]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            site: '',
            date: '',
            entreprise: ''
        });
    };

    const getRiskLevel = (value, type) => {
        if (type === 'trir') {
            if (value > 3.0) return { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', label: 'Élevé' };
            if (value > 1.0) return { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Moyen' };
            return { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Faible' };
        }
        if (type === 'ltir') {
            if (value > 1.0) return { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', label: 'Élevé' };
            if (value > 0.5) return { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Moyen' };
            return { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Faible' };
        }
        if (type === 'dart') {
            if (value > 1.0) return { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', label: 'Élevé' };
            if (value > 0.5) return { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Moyen' };
            return { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Faible' };
        }
        return { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', label: 'N/A' };
    };


    return (
        <AdminLayout>
            <Head title="Statistiques HSE - Administration" />
            <div className="relative p-6 md:p-8">
                {/* Enhanced Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg"
                            >
                                <BarChart3 className="w-7 h-7 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                                    Statistiques HSE
                                </h1>
                                <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                                    Gestion des statistiques de santé, sécurité et environnement
                                </p>
                            </div>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href={route('admin.hse-statistics.aggregated')}
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <TrendingUp className="w-5 h-5" />
                                Statistiques Agrégées
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Enhanced Search & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10" />
                        <div className="relative p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <motion.div
                                    whileHover={{ rotate: 5 }}
                                    className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg"
                                >
                                    <Search className="w-5 h-5 text-white" />
                                </motion.div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recherche et filtres</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                        Site
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={filters.site}
                                            onChange={(e) => handleFilterChange('site', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Rechercher par site..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                        Date
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="date"
                                            value={filters.date}
                                            onChange={(e) => handleFilterChange('date', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                        Entreprise
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={filters.entreprise}
                                            onChange={(e) => handleFilterChange('entreprise', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Rechercher par entreprise..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={clearFilters}
                                    className="px-4 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-all font-medium"
                                >
                                    Effacer les filtres
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Enhanced Statistics Table */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg"
                >
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <motion.div
                                whileHover={{ rotate: 5 }}
                                className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg"
                            >
                                <FileText className="w-5 h-5 text-white" />
                            </motion.div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Liste des statistiques</h2>
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-sm font-medium">
                                {statistics.data.length} statistique{statistics.data.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-[1600px] w-full text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Contractant
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Site
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Entreprise
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Personnel
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Heures Total
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        TRIR
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        LTIR
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        DART
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Permis Total
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Inspections
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Soumis le
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Modifié le
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                <AnimatePresence>
                                    {statistics.data.length === 0 && (
                                        <motion.tr
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="border-b last:border-0"
                                        >
                                            <td colSpan={14} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                                        <BarChart3 className="w-8 h-8 text-slate-400" />
                                                    </div>
                                                    <p className="text-slate-500 dark:text-slate-400 text-lg">Aucune statistique trouvée</p>
                                                    <p className="text-slate-400 dark:text-slate-500 text-sm">Les contractants n'ont pas encore soumis de statistiques</p>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )}

                                    {statistics.data.map((stat, idx) => {
                                        const trirRisk = getRiskLevel(Number(stat.trir), 'trir');
                                        const ltirRisk = getRiskLevel(Number(stat.ltir), 'ltir');
                                        const dartRisk = getRiskLevel(Number(stat.dart), 'dart');

                                        return (
                                            <motion.tr
                                                key={stat.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                            {stat.contractor?.name?.charAt(0) || "?"}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                                                {stat.contractor?.name || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-slate-400" />
                                                        <span className="text-sm text-slate-900 dark:text-white font-medium">{stat.site}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-slate-900 dark:text-white font-medium">
                                                        {stat.contractor?.company_name || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                        <span className="text-sm text-slate-900 dark:text-white">
                                                            {new Date(stat.date).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-slate-400" />
                                                        <span className="text-sm text-slate-900 dark:text-white font-medium">
                                                            {stat.effectif_personnel}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                        <span className="text-sm text-slate-900 dark:text-white font-medium">
                                                            {stat.total_heures ? Number(stat.total_heures).toFixed(2) : '0.00'}h
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <motion.span
                                                        whileHover={{ scale: 1.05 }}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${trirRisk.color} shadow-sm`}
                                                    >
                                                        {trirRisk.label === 'Élevé' && <AlertTriangle className="w-3 h-3" />}
                                                        {trirRisk.label === 'Moyen' && <AlertTriangle className="w-3 h-3" />}
                                                        {trirRisk.label === 'Faible' && <CheckCircle className="w-3 h-3" />}
                                                        {stat.trir ? Number(stat.trir).toFixed(4) : '0.0000'}
                                                    </motion.span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <motion.span
                                                        whileHover={{ scale: 1.05 }}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${ltirRisk.color} shadow-sm`}
                                                    >
                                                        {ltirRisk.label === 'Élevé' && <AlertTriangle className="w-3 h-3" />}
                                                        {ltirRisk.label === 'Moyen' && <AlertTriangle className="w-3 h-3" />}
                                                        {ltirRisk.label === 'Faible' && <CheckCircle className="w-3 h-3" />}
                                                        {stat.ltir ? Number(stat.ltir).toFixed(4) : '0.0000'}
                                                    </motion.span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <motion.span
                                                        whileHover={{ scale: 1.05 }}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${dartRisk.color} shadow-sm`}
                                                    >
                                                        {dartRisk.label === 'Élevé' && <AlertTriangle className="w-3 h-3" />}
                                                        {dartRisk.label === 'Moyen' && <AlertTriangle className="w-3 h-3" />}
                                                        {dartRisk.label === 'Faible' && <CheckCircle className="w-3 h-3" />}
                                                        {stat.dart ? Number(stat.dart).toFixed(4) : '0.0000'}
                                                    </motion.span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-slate-900 dark:text-white font-medium">
                                                        {stat.permis_total || 0}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-slate-900 dark:text-white font-medium">
                                                        {stat.inspections_total_hse || 0}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                                            {new Date(stat.created_at).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {stat.updated_at && stat.updated_at !== stat.created_at ? (
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-blue-500" />
                                                            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                                                {new Date(stat.updated_at).toLocaleDateString('fr-FR')}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-slate-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <motion.div
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <Link
                                                            href={route('admin.hse-statistics.show', stat.id)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all font-medium shadow-lg"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            Voir détails
                                                        </Link>
                                                    </motion.div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Enhanced Pagination */}
                    {statistics.links && (
                        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="text-sm text-slate-700 dark:text-slate-300">
                                    Affichage de <span className="font-semibold">{statistics.from}</span> à <span className="font-semibold">{statistics.to}</span> sur <span className="font-semibold">{statistics.total}</span> résultats
                                </div>
                                <div className="flex flex-wrap items-center gap-2 justify-center">
                                    {statistics.links.map((link, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Link
                                                href={link.url || '#'}
                                                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                                                    link.active
                                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                                        : link.url
                                                        ? "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300"
                                                        : "bg-slate-100 text-slate-400 cursor-default dark:bg-slate-700 dark:text-slate-500"
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AdminLayout>
    );
}
