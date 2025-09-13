import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BarChart3, 
    Search, 
    Filter, 
    Download, 
    Calendar, 
    Building2, 
    Users, 
    Clock, 
    TrendingUp, 
    AlertTriangle, 
    CheckCircle, 
    XCircle, 
    Eye, 
    FileText, 
    ArrowLeft,
    Sparkles,
    Target,
    Award,
    Activity,
    Shield,
    Zap,
    Table,
    LineChart
} from 'lucide-react';
import HseSingleMetricChart from '@/Components/Charts/HseSingleMetricChart';

export default function HseStatisticsAggregated({ 
    aggregatedData, 
    singleMetricData,
    filters: initialFilters = {} 
}) {
    const [filters, setFilters] = useState({
        start_date: initialFilters.start_date || '',
        end_date: initialFilters.end_date || '',
        site: initialFilters.site || '',
        entreprise: initialFilters.entreprise || ''
    });
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'charts'
    const [selectedMetric, setSelectedMetric] = useState('trir'); // Default to TRIR

    // Real-time filtering with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(route('admin.hse-statistics.aggregated'), filters, {
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
            start_date: '',
            end_date: '',
            site: '',
            entreprise: ''
        });
    };

    const exportExcel = () => {
        const params = new URLSearchParams(filters);
        window.open(route('admin.hse-statistics.export-excel') + '?' + params.toString(), '_blank');
    };

    const exportChart = () => {
        if (viewMode === 'charts' && singleMetricData && singleMetricData[selectedMetric]) {
            // Find the chart canvas element
            const chartCanvas = document.querySelector('canvas');
            if (chartCanvas) {
                // Create a download link
                const link = document.createElement('a');
                const metricName = singleMetricData[selectedMetric].name;
                const dateRange = filters.start_date && filters.end_date 
                    ? `_${filters.start_date}_to_${filters.end_date}`
                    : '';
                const siteFilter = filters.site ? `_Site_${filters.site.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
                const companyFilter = filters.entreprise ? `_Entreprise_${filters.entreprise.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
                
                link.download = `HSE_${metricName.replace(/[^a-zA-Z0-9]/g, '_')}${dateRange}${siteFilter}${companyFilter}.png`;
                
                // Convert canvas to blob and download with high quality
                chartCanvas.toBlob((blob) => {
                    link.href = URL.createObjectURL(blob);
                    link.click();
                    URL.revokeObjectURL(link.href);
                }, 'image/png', 1.0);
            } else {
                // Fallback: try to find any canvas in the charts section
                const chartsSection = document.querySelector('[key="charts"]');
                const canvas = chartsSection?.querySelector('canvas');
                if (canvas) {
                    const link = document.createElement('a');
                    const metricName = singleMetricData[selectedMetric].name;
                    const dateRange = filters.start_date && filters.end_date 
                        ? `_${filters.start_date}_to_${filters.end_date}`
                        : '';
                    link.download = `HSE_${metricName.replace(/[^a-zA-Z0-9]/g, '_')}${dateRange}.png`;
                    
                    canvas.toBlob((blob) => {
                        link.href = URL.createObjectURL(blob);
                        link.click();
                        URL.revokeObjectURL(link.href);
                    }, 'image/png', 1.0);
                }
            }
        }
    };

    const formatNumber = (value) => {
        return value ? Number(value).toFixed(2) : '0.00';
    };

    const formatInteger = (value) => {
        return value ? Number(value).toLocaleString() : '0';
    };

    // Helper component for table headers
    const Th = ({ children, className = "" }) => (
        <th className={`px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider ${className}`}>
            {children}
        </th>
    );

    // Helper component for table cells
    const Td = ({ children, className = "" }) => (
        <td className={`px-6 py-4 whitespace-nowrap ${className}`}>
            {children}
        </td>
    );

    return (
        <AdminLayout>
            <Head title="Statistiques HSE Agrégées - Administration" />
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
                                    <BarChart3 className="w-8 h-8 text-white" />
                                </motion.div>
                                    <div>
                                    <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 via-blue-900 via-purple-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:via-purple-100 dark:to-indigo-100 bg-clip-text text-transparent">
                                        Statistiques HSE Agrégées
                                    </h1>
                                    <p className="text-lg text-slate-600 dark:text-slate-300 mt-2 font-medium">
                                            Période: {aggregatedData.period_start && aggregatedData.period_end 
                                                ? `${aggregatedData.period_start} au ${aggregatedData.period_end}`
                                                : 'Toutes les périodes'
                                            }
                                        </p>
                                    </div>
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                    <Link
                                        href={route('admin.hse-statistics.index')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg"
                                    >
                                    <ArrowLeft className="w-5 h-5" />
                                        Retour à la liste
                                    </Link>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Enhanced Summary Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20" />
                            <div className="relative p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                                            {formatInteger(aggregatedData.total_submissions)}
                                        </div>
                                        <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Soumissions</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20" />
                            <div className="relative p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-green-600 dark:text-green-400">
                                            {formatInteger(aggregatedData.effectif_total)}
                                        </div>
                                        <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Effectif Total</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/20 dark:to-orange-900/20" />
                            <div className="relative p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-yellow-600 dark:text-yellow-400">
                                            {formatInteger(aggregatedData.volume_horaire_total)}
                                </div>
                                        <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Volume Horaire Total</div>
                                </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Combined Filters and Display Mode */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl mb-8"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-purple-50/30 to-pink-50/50 dark:from-emerald-900/20 dark:via-purple-900/10 dark:to-pink-900/20" />
                        <div className="relative p-6">
                            {/* Header */}
                            <div className="text-center mb-6">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl mb-4"
                                >
                                    <Filter className="w-7 h-7 text-white" />
                                </motion.div>
                                <h2 className="text-2xl font-black bg-gradient-to-r from-slate-900 via-emerald-900 to-purple-900 dark:from-white dark:via-emerald-100 dark:to-purple-100 bg-clip-text text-transparent mb-2">
                                    Filtres et Affichage
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 font-medium">
                                    Configurez vos statistiques HSE
                                </p>
                            </div>

                            {/* Filters Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                                            Date de début
                                        </label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="date"
                                            value={filters.start_date}
                                            onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                            className="w-full pl-10 pr-3 py-3 rounded-xl border-2 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                                        />
                                    </div>
                                </div>

                                    <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                                            Date de fin
                                        </label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="date"
                                            value={filters.end_date}
                                            onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                            className="w-full pl-10 pr-3 py-3 rounded-xl border-2 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                                        />
                                    </div>
                                </div>

                                    <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                                            Site
                                        </label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={filters.site}
                                            onChange={(e) => handleFilterChange('site', e.target.value)}
                                            className="w-full pl-10 pr-3 py-3 rounded-xl border-2 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                                            placeholder="Rechercher par site..."
                                        />
                                    </div>
                                </div>

                                    <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                                            Entreprise
                                        </label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={filters.entreprise}
                                            onChange={(e) => handleFilterChange('entreprise', e.target.value)}
                                            className="w-full pl-10 pr-3 py-3 rounded-xl border-2 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                                            placeholder="Rechercher par entreprise..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Display Mode and Actions Row */}
                            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 xl:gap-6">
                                {/* View Mode Toggle */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                                        Mode d'affichage:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setViewMode('table')}
                                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 font-medium shadow-lg text-sm ${
                                                viewMode === 'table'
                                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                                            }`}
                                        >
                                            <Table className="w-4 h-4" />
                                            Tableau
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setViewMode('charts')}
                                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 font-medium shadow-lg text-sm ${
                                                viewMode === 'charts'
                                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                                            }`}
                                        >
                                            <LineChart className="w-4 h-4" />
                                            Courbes
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Metric Selector (only when charts mode is selected) */}
                                {viewMode === 'charts' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full xl:w-auto"
                                    >
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                                            Métrique:
                                        </span>
                                        <div className="relative group w-full sm:w-auto">
                                            <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                                            <select
                                                value={selectedMetric}
                                                onChange={(e) => setSelectedMetric(e.target.value)}
                                                className="w-full sm:w-auto pl-10 pr-8 py-2 rounded-xl border-2 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 appearance-none cursor-pointer min-w-[180px] sm:min-w-[200px]"
                                            >
                                                {singleMetricData && Object.entries(singleMetricData).map(([key, metric]) => (
                                                    <option key={key} value={key}>
                                                        {metric.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-start xl:justify-end">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={exportExcel}
                                        className="group relative inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all duration-300 font-medium shadow-lg overflow-hidden text-sm"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                            className="relative z-10"
                                        >
                                            <Download className="w-4 h-4" />
                                        </motion.div>
                                        <span className="relative z-10">Excel</span>
                                    </motion.button>

                                    {viewMode === 'charts' && (
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={exportChart}
                                            className="group relative inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 transition-all duration-300 font-medium shadow-lg overflow-hidden text-sm"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <motion.div
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                                className="relative z-10"
                                            >
                                                <Download className="w-4 h-4" />
                                            </motion.div>
                                            <span className="relative z-10">Courbe</span>
                                        </motion.button>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={clearFilters}
                                        className="inline-flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-all font-medium text-sm"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Effacer
                                    </motion.button>
                                </div>
                            </div>
                            </div>
                    </motion.div>

                    {/* Content Area - Table or Charts */}
                    <AnimatePresence mode="wait">
                        {viewMode === 'table' ? (
                            /* Enhanced Statistics Table */
                    <motion.div
                                key="table"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.6 }}
                        className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10" />
                        <div className="relative overflow-x-auto">
                            {aggregatedData.statistics && aggregatedData.statistics.length > 0 ? (
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-700">
                                            <Th>Contractant</Th>
                                            <Th>Entreprise</Th>
                                            <Th>Site</Th>
                                            <Th>Date</Th>
                                            <Th>Effectif</Th>
                                            <Th>Volume Horaire</Th>
                                            <Th>TRIR</Th>
                                            <Th>LTIR</Th>
                                            <Th>DART</Th>
                                            <Th>Acc. Mortel</Th>
                                            <Th>Acc. Arrêt</Th>
                                            <Th>Acc. Soins</Th>
                                            <Th>Acc. Restriction</Th>
                                            <Th>Premier Soin</Th>
                                            <Th>Presque Accident</Th>
                                            <Th>Dommage Matériel</Th>
                                            <Th>Incident Env.</Th>
                                            <Th>Sensibilisations</Th>
                                            <Th>Personnes Sens.</Th>
                                            <Th>Inductions</Th>
                                            <Th>H. Formation</Th>
                                            <Th>H. Induction</Th>
                                            <Th>H. Formation Spéc.</Th>
                                            <Th>PTSR Total</Th>
                                            <Th>PTSR Contrôlés</Th>
                                            <Th>Permis Général</Th>
                                            <Th>Permis Excavation</Th>
                                            <Th>Permis Point Chaud</Th>
                                            <Th>Permis Espace Confiné</Th>
                                            <Th>Permis Travail Hauteur</Th>
                                            <Th>Permis Levage</Th>
                                            <Th>Permis Consignation</Th>
                                            <Th>Permis Électrique</Th>
                                            <Th>Observations HSE</Th>
                                            <Th>Actions</Th>
                                            </tr>
                                        </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {aggregatedData.statistics.map((stat, index) => (
                                            <motion.tr
                                                key={stat.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05, duration: 0.4 }}
                                                whileHover={{ scale: 1.01 }}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
                                            >
                                                <Td>
                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                        {stat.contractor_name}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="text-slate-600 dark:text-slate-400">
                                                        {stat.entreprise}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="text-slate-600 dark:text-slate-400">
                                                        {stat.site}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="text-slate-600 dark:text-slate-400">
                                                        {stat.date}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                        {formatInteger(stat.effectif_personnel)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                        {formatInteger(stat.total_heures)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                        {formatNumber(stat.trir)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                        {formatNumber(stat.ltir)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                        {formatNumber(stat.dart)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-bold text-red-600 dark:text-red-400">
                                                        {formatInteger(stat.acc_mortel)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-orange-600 dark:text-orange-400">
                                                        {formatInteger(stat.acc_arret)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-orange-600 dark:text-orange-400">
                                                        {formatInteger(stat.acc_soins_medicaux)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-orange-600 dark:text-orange-400">
                                                        {formatInteger(stat.acc_restriction_temporaire)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-yellow-600 dark:text-yellow-400">
                                                        {formatInteger(stat.premier_soin)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-yellow-600 dark:text-yellow-400">
                                                        {formatInteger(stat.presque_accident)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-yellow-600 dark:text-yellow-400">
                                                        {formatInteger(stat.dommage_materiel)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-yellow-600 dark:text-yellow-400">
                                                        {formatInteger(stat.incident_environnemental)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-green-600 dark:text-green-400">
                                                        {formatInteger(stat.nb_sensibilisations)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-green-600 dark:text-green-400">
                                                        {formatInteger(stat.personnes_sensibilisees)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-purple-600 dark:text-purple-400">
                                                        {formatInteger(stat.inductions_total_personnes)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-purple-600 dark:text-purple-400">
                                                        {formatInteger(stat.total_heures_formation)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-purple-600 dark:text-purple-400">
                                                        {formatInteger(stat.total_heures_induction)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-purple-600 dark:text-purple-400">
                                                        {formatInteger(stat.total_heures_formation_specifique)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-indigo-600 dark:text-indigo-400">
                                                        {formatInteger(stat.ptsr_total)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-indigo-600 dark:text-indigo-400">
                                                        {formatInteger(stat.ptsr_controles)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-teal-600 dark:text-teal-400">
                                                        {formatInteger(stat.permis_general)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-teal-600 dark:text-teal-400">
                                                        {formatInteger(stat.permis_excavation)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-teal-600 dark:text-teal-400">
                                                        {formatInteger(stat.permis_point_chaud)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-teal-600 dark:text-teal-400">
                                                        {formatInteger(stat.permis_espace_confine)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-teal-600 dark:text-teal-400">
                                                        {formatInteger(stat.permis_travail_hauteur)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-teal-600 dark:text-teal-400">
                                                        {formatInteger(stat.permis_levage)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-teal-600 dark:text-teal-400">
                                                        {formatInteger(stat.permis_consignation)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-teal-600 dark:text-teal-400">
                                                        {formatInteger(stat.permis_electrique_tension)}
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-semibold text-pink-600 dark:text-pink-400">
                                                        {formatInteger(stat.observations_hse)}
                                                    </div>
                                                </Td>
                                                <Td>
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
                                                </Td>
                                            </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="text-center py-16"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.4, type: "spring" }}
                                        className="flex flex-col items-center gap-6"
                                    >
                                        <div className="p-6 bg-slate-100 dark:bg-slate-700 rounded-full">
                                            <BarChart3 className="w-12 h-12 text-slate-400" />
                                </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                                                Aucune statistique trouvée
                                            </h3>
                                            <p className="text-slate-500 dark:text-slate-400">
                                        {filters.start_date || filters.end_date || filters.site || filters.entreprise
                                            ? 'Aucune donnée pour les filtres sélectionnés'
                                            : 'Aucune statistique HSE soumise'
                                        }
                                    </p>
                                </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                        ) : (
                            /* Charts View */
                            <motion.div
                                key="charts"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.6 }}
                                className="space-y-8"
                            >
                                {aggregatedData.statistics && aggregatedData.statistics.length > 0 && singleMetricData && singleMetricData[selectedMetric] ? (
                                    <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-indigo-50/50 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-indigo-900/20" />
                                        <div className="relative p-8">
                                            <div className="text-center mb-6">
                                                <motion.div
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-2xl shadow-2xl mb-4"
                                                    style={{ background: `linear-gradient(to right, ${singleMetricData[selectedMetric].color}, ${singleMetricData[selectedMetric].color}dd)` }}
                                                >
                                                    <LineChart className="w-7 h-7 text-white" />
                                                </motion.div>
                                                <h3 className="text-2xl font-black bg-gradient-to-r from-slate-900 via-purple-900 to-pink-900 dark:from-white dark:via-purple-100 dark:to-pink-100 bg-clip-text text-transparent mb-2">
                                                    {singleMetricData[selectedMetric].name}
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-400 font-medium">
                                                    Évolution de {singleMetricData[selectedMetric].name.toLowerCase()} dans le temps
                                                </p>
                                            </div>
                                            <HseSingleMetricChart 
                                                data={{
                                                    labels: singleMetricData[selectedMetric].labels,
                                                    values: singleMetricData[selectedMetric].values,
                                                    color: singleMetricData[selectedMetric].color,
                                                    backgroundColor: singleMetricData[selectedMetric].color + '20'
                                                }}
                                                title={`Évolution de ${singleMetricData[selectedMetric].name}`}
                                                metricName={singleMetricData[selectedMetric].name}
                                                chartType={singleMetricData[selectedMetric].type}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="text-center py-16"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.4, type: "spring" }}
                                            className="flex flex-col items-center gap-6"
                                        >
                                            <div className="p-6 bg-slate-100 dark:bg-slate-700 rounded-full">
                                                <BarChart3 className="w-12 h-12 text-slate-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                                                    Aucune donnée disponible pour les graphiques
                                                </h3>
                                                <p className="text-slate-500 dark:text-slate-400">
                                                    {filters.start_date || filters.end_date || filters.site || filters.entreprise
                                                        ? 'Aucune donnée pour les filtres sélectionnés'
                                                        : 'Aucune statistique HSE soumise'
                                                    }
                                                </p>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AdminLayout>
    );
}
