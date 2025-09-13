import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { motion } from 'framer-motion';
import { 
    Shield, 
    Search, 
    Filter, 
    User, 
    Calendar, 
    Clock, 
    CheckCircle, 
    XCircle, 
    AlertCircle, 
    Eye, 
    FileText, 
    Users, 
    Package,
    Edit3,
    Trash2,
    UserCheck,
    Hash
} from 'lucide-react';

export default function Index({ epiRequests }) {
    const [search, setSearch] = useState('');
    const [etatFilter, setEtatFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (type, value) => {
        if (type === 'etat') {
            setEtatFilter(value);
        } else if (type === 'date') {
            setDateFilter(value);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setEtatFilter('');
        setDateFilter('');
    };

    const viewRequest = (request) => {
        // Handle view request
        console.log('View request:', request);
    };

    const editRequest = (request) => {
        // Handle edit request
        console.log('Edit request:', request);
    };

    const deleteRequest = (id) => {
        // Handle delete request
        console.log('Delete request:', id);
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

    // Enhanced status badge with icons and motion
    const getEtatBadge = (etat) => {
        const badges = {
            'en_cours': {
                label: 'En cours',
                className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
                icon: Clock
            },
            'en_traitement': {
                label: 'En traitement',
                className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                icon: AlertCircle
            },
            'done': {
                label: 'Terminé',
                className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                icon: CheckCircle
            },
            'rejected': {
                label: 'Rejeté',
                className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                icon: XCircle
            }
        };

        const badge = badges[etat] || badges['en_cours'];
        const Icon = badge.icon;

        return (
            <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${badge.className}`}
            >
                <Icon className="w-3 h-3" />
                {badge.label}
            </motion.span>
        );
    };

    return (
        <AdminLayout>
            <Head title="Gestion des Demandes d'EPI" />
            <div className="relative p-6 md:p-8">
                    {/* Enhanced Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg"
                            >
                                <Shield className="w-7 h-7 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                                    Demandes d'EPI
                                </h1>
                                <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                                    Gestion des demandes d'équipements de protection individuelle
                                </p>
                            </div>
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
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                        Rechercher
                                    </label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Nom, email..."
                                        value={search}
                                        onChange={handleSearch}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                        </div>
                                </div>

                                <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                        État
                                    </label>
                                    <select
                                        value={etatFilter}
                                        onChange={(e) => handleFilterChange('etat', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">Tous les états</option>
                                        <option value="en_cours">En cours</option>
                                        <option value="en_traitement">En traitement</option>
                                        <option value="done">Terminé</option>
                                        <option value="rejected">Rejeté</option>
                                    </select>
                                </div>

                                <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                        Date
                                    </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        type="date"
                                        value={dateFilter}
                                        onChange={(e) => handleFilterChange('date', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                        </div>
                                </div>

                                <div className="flex items-end">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        onClick={clearFilters}
                                            className="w-full px-4 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-all font-medium"
                                    >
                                        Effacer les filtres
                                        </motion.button>
                                    </div>
                                </div>
                                </div>
                            </div>
                    </motion.div>

                    {/* Enhanced EPI Requests Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10" />
                        <div className="relative overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                        <Th>Date de Demande</Th>
                                        <Th>Demandeur</Th>
                                        <Th>Nom et Prénom</Th>
                                        <Th>EPI Demandés</Th>
                                        <Th>État</Th>
                                        <Th>Traité par</Th>
                                        <Th>Actions</Th>
                                        </tr>
                                    </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {epiRequests.data.length === 0 ? (
                                        <motion.tr
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center"
                                        >
                                            <td colSpan="7" className="px-6 py-12 text-slate-500 dark:text-slate-400">
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.2, type: "spring" }}
                                                    className="flex flex-col items-center gap-4"
                                                >
                                                    <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full">
                                                        <Shield className="w-8 h-8 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                                                            Aucune demande d'EPI trouvée
                                                        </h3>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                                            Les nouvelles demandes apparaîtront ici
                                                        </p>
                                                    </div>
                                                </motion.div>
                                                </td>
                                        </motion.tr>
                                    ) : (
                                        epiRequests.data.map((request, index) => (
                                            <motion.tr
                                                key={request.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                                whileHover={{ scale: 1.01 }}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
                                            >
                                                <Td>
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <Calendar className="w-4 h-4" />
                                                        <span className="text-sm font-medium">
                                                            {new Date(request.date_demande).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="flex items-center gap-3">
                                                        <motion.div
                                                            whileHover={{ scale: 1.1 }}
                                                            className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg"
                                                        >
                                                            <span className="text-white font-bold text-sm">
                                                                {request.user.name.charAt(0)}
                                                            </span>
                                                        </motion.div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900 dark:text-white">
                                                                {request.user.name}
                                                            </div>
                                                            <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                                <User className="w-3 h-3" />
                                                                {request.user.email}
                                                            </div>
                                                        </div>
                                                        </div>
                                                </Td>
                                                <Td>
                                                    <div className="font-medium text-slate-900 dark:text-white">
                                                        {request.nom_prenom}
                                                    </div>
                                                </Td>
                                                <Td>
                                                        <div className="max-w-xs">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Package className="w-4 h-4 text-blue-500" />
                                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                                {request.liste_epi.length} EPI demandé(s)
                                                            </span>
                                                            </div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                                                {request.liste_epi.slice(0, 2).join(', ')}
                                                                {request.liste_epi.length > 2 && ` +${request.liste_epi.length - 2} autres`}
                                                            </div>
                                                        </div>
                                                </Td>
                                                <Td>
                                                        {getEtatBadge(request.etat)}
                                                </Td>
                                                <Td>
                                                        {request.admin ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                                                                <UserCheck className="w-4 h-4 text-white" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-slate-900 dark:text-white text-sm">
                                                                    {request.admin.full_name || request.admin.email}
                                                                </div>
                                                                {request.updated_at && (
                                                                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                                        <Clock className="w-3 h-3" />
                                                                        {new Date(request.updated_at).toLocaleDateString('fr-FR')}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            </div>
                                                        ) : (
                                                        <div className="flex items-center gap-2 text-slate-400">
                                                            <AlertCircle className="w-4 h-4" />
                                                            <span className="text-sm">Non traité</span>
                                                        </div>
                                                    )}
                                                </Td>
                                                <Td>
                                                    <motion.div
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <Link
                                                            href={route('admin.epi-requests.show', request.id)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all font-medium text-sm shadow-lg"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            Voir & Traiter
                                                        </Link>
                                                    </motion.div>
                                                </Td>
                                            </motion.tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                    </motion.div>

                    {/* Enhanced Pagination */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mt-8"
                    >
                        <nav className="flex justify-center">
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-2">
                                    {epiRequests.links.map((link, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                            {link.url ? (
                                                <Link
                                                    href={link.url}
                                                className={`flex items-center justify-center px-4 py-2 rounded-xl font-medium transition-all ${
                                                        link.active
                                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                                }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                className="flex items-center justify-center px-4 py-2 rounded-xl text-slate-400 dark:text-slate-600 cursor-not-allowed"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )}
                                    </motion.div>
                                    ))}
                            </div>
                            </nav>
                    </motion.div>
            </div>
        </AdminLayout>
    );
}
