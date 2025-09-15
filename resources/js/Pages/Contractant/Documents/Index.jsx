import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Download, FileText, Calendar } from 'lucide-react';
import ContractantSidebar from '@/Components/ContractantSidebar';
import ContractantTopHeader from '@/Components/ContractantTopHeader';

export default function DocumentsIndex({ documents, filters, contractor }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [dateFilter, setDateFilter] = useState(filters.date || '');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        
        // Trigger search immediately
        router.get(route('contractant.documents'), {
            search: e.target.value,
            date: dateFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDateFilter = (e) => {
        setDateFilter(e.target.value);
        
        // Trigger filter immediately
        router.get(route('contractant.documents'), {
            search: search,
            date: e.target.value,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setDateFilter('');
        router.get(route('contractant.documents'));
    };

    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) {
            return '🖼️';
        } else if (fileType === 'application/pdf') {
            return '📄';
        } else if (fileType.startsWith('text/')) {
            return '📝';
        } else if (fileType.includes('word') || fileType.includes('document')) {
            return '📄';
        } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
            return '📊';
        } else {
            return '📎';
        }
    };


    return (
        <>
            <Head title="Documents" />

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
                        backRoute={route('contractant.home')}
                        backLabel="Retour au tableau de bord"
                    />

                {/* Success Message */}
                <AnimatePresence>
                    {flash?.success && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="relative z-10 px-6 mb-6"
                        >
                            <div className="max-w-7xl mx-auto">
                                <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-4 flex items-center space-x-3">
                                    <FileText className="w-5 h-5 text-green-400" />
                                    <p className="text-green-300 font-medium">{flash.success}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <div className="relative z-10 px-6 pb-12">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-center mb-12"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Documents</span>
                            </h1>
                            <p className="text-gray-300 text-lg">Consultez et téléchargez les documents partagés</p>
                        </motion.div>

                        {/* Search Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl mb-8 max-w-4xl mx-auto"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Titre
                                        </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={handleSearch}
                                            placeholder="Rechercher par titre..."
                                            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300 text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Date
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="date"
                                            value={dateFilter}
                                            onChange={handleDateFilter}
                                            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300 text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={clearFilters}
                                        className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm text-sm"
                                    >
                                        Effacer
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Documents Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            {documents.data.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {documents.data.map((document, index) => (
                                        <motion.div
                                            key={document.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300"
                                        >
                                            {/* Document Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-xl">
                                                    <FileText className="w-6 h-6 text-cyan-400" />
                                                </div>
                                                <motion.a
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    href={route('contractant.documents.download', document.id)}
                                                    className="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:from-cyan-500/30 hover:to-emerald-500/30 hover:border-cyan-400/50 hover:text-cyan-200 transition-all duration-300 backdrop-blur-sm text-sm"
                                                >
                                                    <Download className="w-4 h-4 inline mr-1" />
                                                    Télécharger
                                                </motion.a>
                            </div>

                                            {/* Document Info */}
                                            <div className="space-y-3">
                                                        <div>
                                                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300">
                                                                {document.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-400 truncate">
                                                                {document.original_filename}
                                                    </p>
                                                            </div>

                                                <div className="flex items-center text-sm text-gray-300">
                                                    <Calendar className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0" />
                                                    <span>{new Date(document.created_at).toLocaleDateString()}</span>
                                                    </div>
                            </div>

                                            {/* Hover Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="p-4 bg-white/5 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                        <FileText className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-2">Aucun document</h3>
                                    <p className="text-gray-400">Aucun document n'est disponible pour vous.</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {documents.links && documents.data.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-300">
                                            Affichage de <span className="font-medium text-white">{documents.from}</span> à <span className="font-medium text-white">{documents.to}</span> sur <span className="font-medium text-white">{documents.total}</span> résultats
                                        </div>
                                        <div className="flex items-center space-x-2">
                                                    {documents.links.map((link, index) => (
                                                        link.url ? (
                                                            <Link
                                                                key={index}
                                                                href={link.url}
                                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                                                    link.active
                                                                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg'
                                                                : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20 hover:text-white'
                                                                }`}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        ) : (
                                                            <span
                                                                key={index}
                                                        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 cursor-not-allowed"
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        )
                                                    ))}
                                        </div>
                                </div>
                                </div>
                            )}
                        </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
