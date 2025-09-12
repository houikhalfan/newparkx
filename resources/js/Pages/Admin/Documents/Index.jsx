import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit3, 
  Download, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  User,
  HardDrive,
  Globe,
  Lock,
  Users,
  CheckSquare,
  Square
} from 'lucide-react';

export default function DocumentsIndex({ documents, filters }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [visibilityFilter, setVisibilityFilter] = useState(filters.visibility || '');
    const [selectedDocuments, setSelectedDocuments] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        router.get(route('admin.documents.index'), {
            search: e.target.value,
            visibility: visibilityFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterChange = (filter, value) => {
        if (filter === 'visibility') {
            setVisibilityFilter(value);
        }
        
        router.get(route('admin.documents.index'), {
            search: search,
            visibility: filter === 'visibility' ? value : visibilityFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setVisibilityFilter('');
        router.get(route('admin.documents.index'));
    };

    const handleSelectDocument = (documentId) => {
        setSelectedDocuments(prev => 
            prev.includes(documentId) 
                ? prev.filter(id => id !== documentId)
                : [...prev, documentId]
        );
    };

    const handleSelectAll = () => {
        if (selectedDocuments.length === documents.data.length) {
            setSelectedDocuments([]);
        } else {
            setSelectedDocuments(documents.data.map(doc => doc.id));
        }
    };

    const handleBulkDelete = () => {
        if (selectedDocuments.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${selectedDocuments.length} document(s)?`)) {
            router.post(route('admin.documents.bulk-delete'), {
                documents: selectedDocuments,
            });
        }
    };

    const getVisibilityBadges = (visibility) => {
        const badges = {
            public: { 
                bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
                text: 'text-emerald-700 dark:text-emerald-300', 
                icon: Globe,
                label: 'Public'
            },
            private: { 
                bg: 'bg-rose-100 dark:bg-rose-900/30', 
                text: 'text-rose-700 dark:text-rose-300', 
                icon: Lock,
                label: 'Private'
            },
            contractant: { 
                bg: 'bg-blue-100 dark:bg-blue-900/30', 
                text: 'text-blue-700 dark:text-blue-300', 
                icon: Users,
                label: 'Contractor'
            },
        };

        return visibility.map(v => {
            const badge = badges[v] || { 
                bg: 'bg-gray-100 dark:bg-gray-700', 
                text: 'text-gray-700 dark:text-gray-300', 
                icon: AlertCircle,
                label: v
            };
            const Icon = badge.icon;
            
            return (
                <motion.span
                    key={v}
                    whileHover={{ scale: 1.05 }}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text} shadow-sm`}
                >
                    <Icon className="w-3 h-3" />
                    {badge.label}
                </motion.span>
            );
        });
    };

    return (
        <AdminLayout>
            <Head title="Documents" />
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
                                <FileText className="w-7 h-7 text-white" />
                            </motion.div>
                                <div>
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                                    Gestion des Documents
                                </h1>
                                <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                                    Gérez vos documents et fichiers de manière centralisée
                                </p>
                            </div>
                                </div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                                <Link
                                    href={route('admin.documents.create')}
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <Plus className="w-5 h-5" />
                                Ajouter un document
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
                                        Rechercher
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={handleSearch}
                                        placeholder="Rechercher par titre ou description..."
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                        Visibilité
                                    </label>
                                    <select
                                        value={visibilityFilter}
                                        onChange={(e) => handleFilterChange('visibility', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">Toutes les visibilités</option>
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                        <option value="contractant">Contractor</option>
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={clearFilters}
                                        className="w-full px-4 py-3 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium"
                                    >
                                        Effacer les filtres
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                            {/* Bulk Actions */}
                <AnimatePresence>
                            {selectedDocuments.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                        >
                                    <div className="flex items-center justify-between">
                                <span className="text-sm text-red-800 dark:text-red-300 font-medium">
                                            {selectedDocuments.length} document(s) sélectionné(s)
                                        </span>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                            onClick={handleBulkDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                        >
                                            Supprimer sélection
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Enhanced Documents Table */}
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
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Liste des documents</h2>
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-sm font-medium">
                                {documents.data.length} document{documents.data.length !== 1 ? 's' : ''}
                            </span>
                                    </div>
                                </div>

                            <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleSelectAll}
                                            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                        >
                                            {selectedDocuments.length === documents.data.length && documents.data.length > 0 ? (
                                                <CheckSquare className="w-5 h-5 text-blue-600" />
                                            ) : (
                                                <Square className="w-5 h-5 text-slate-400" />
                                            )}
                                        </motion.button>
                                            </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                                Document
                                            </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                                Visibilité
                                            </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                                Taille
                                            </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                                Date
                                            </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                                Uploadé par
                                            </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                <AnimatePresence>
                                    {documents.data.length === 0 && (
                                        <motion.tr
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="border-b last:border-0"
                                        >
                                            <td colSpan={7} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                                        <FileText className="w-8 h-8 text-slate-400" />
                                                    </div>
                                                    <p className="text-slate-500 dark:text-slate-400 text-lg">Aucun document trouvé</p>
                                                    <p className="text-slate-400 dark:text-slate-500 text-sm">Commencez par ajouter votre premier document</p>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )}

                                    {documents.data.map((document, idx) => (
                                        <motion.tr
                                            key={document.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                        >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleSelectDocument(document.id)}
                                                    className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                                >
                                                    {selectedDocuments.includes(document.id) ? (
                                                        <CheckSquare className="w-5 h-5 text-blue-600" />
                                                    ) : (
                                                        <Square className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </motion.button>
                                                </td>
                                                <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-semibold text-lg">
                                                        {document.file_icon}
                                                    </div>
                                                        <div>
                                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                                                {document.title}
                                                            </div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                {document.original_filename}
                                                        </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-wrap gap-1">
                                                        {getVisibilityBadges(document.visibility)}
                                                    </div>
                                                </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <HardDrive className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm text-slate-900 dark:text-white font-medium">
                                                    {document.formatted_file_size}
                                                    </span>
                                                </div>
                                                </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    {new Date(document.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm text-slate-900 dark:text-white font-medium">
                                                    {document.full_name}
                                                    </span>
                                                </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Link
                                                            href={route('admin.documents.show', document.id)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all font-medium shadow-lg"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            Voir détails
                                                        </Link>
                                                    </motion.div>
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Link
                                                            href={route('admin.documents.edit', document.id)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium shadow-lg"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                            Modifier
                                                        </Link>
                                                    </motion.div>
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <a
                                                            href={route('admin.documents.download', document.id)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all font-medium shadow-lg"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Télécharger
                                                        </a>
                                                    </motion.div>
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this document?')) {
                                                                    router.delete(route('admin.documents.destroy', document.id));
                                                                }
                                                            }}
                                                            className="inline-flex items-center gap-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 px-3 py-1.5 text-xs font-semibold transition-colors"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                            Supprimer
                                                        </button>
                                                    </motion.div>
                                                    </div>
                                                </td>
                                        </motion.tr>
                                        ))}
                                </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>

                    {/* Enhanced Pagination */}
                            {documents.links && (
                        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="text-sm text-slate-700 dark:text-slate-300">
                                    Affichage de <span className="font-semibold">{documents.from}</span> à <span className="font-semibold">{documents.to}</span> sur <span className="font-semibold">{documents.total}</span> résultats
                                </div>
                                <div className="flex flex-wrap items-center gap-2 justify-center">
                                    {documents.links.map((link, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {link.url ? (
                                                <Link
                                                                href={link.url}
                                                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                                                                    link.active
                                                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300"
                                                                }`}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        ) : (
                                                            <span
                                                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-slate-100 text-slate-400 cursor-default dark:bg-slate-700 dark:text-slate-500"
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                            )}
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