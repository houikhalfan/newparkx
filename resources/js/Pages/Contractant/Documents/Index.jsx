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

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden flex">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" />
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59,130,246,0.2) 1px, transparent 0)`,
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
                                <div className="bg-green-50 backdrop-blur-sm border border-green-200 rounded-xl p-4 flex items-center space-x-3 shadow-lg">
                                    <FileText className="w-5 h-5 text-green-500" />
                                    <p className="text-green-700 font-semibold">{flash.success}</p>
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
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Documents</span>
                            </h1>
                            <p className="text-gray-600 text-lg">Consultez et téléchargez les documents partagés</p>
                        </motion.div>

                        {/* Search Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-6 shadow-xl mb-8 max-w-4xl mx-auto"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.1)'
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Titre
                                        </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={handleSearch}
                                            placeholder="Rechercher par titre..."
                                            className="w-full pl-9 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="date"
                                            value={dateFilter}
                                            onChange={handleDateFilter}
                                            className="w-full pl-9 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={clearFilters}
                                        className="px-6 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-200 transition-all duration-300 text-sm font-semibold"
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
                            className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.1)'
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
                                            className="group bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-6 hover:bg-white hover:border-blue-300/60 hover:shadow-lg transition-all duration-300"
                                        >
                                            {/* Document Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                                                    <FileText className="w-6 h-6 text-white" />
                                                </div>
                                                <motion.a
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    href={route('contractant.documents.download', document.id)}
                                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl"
                                                >
                                                    <Download className="w-4 h-4 inline mr-1" />
                                                    Télécharger
                                                </motion.a>
                            </div>

                                            {/* Document Info */}
                                            <div className="space-y-3">
                                                        <div>
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                                                                {document.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 truncate">
                                                                {document.original_filename}
                                                    </p>
                                                            </div>

                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                                                    <span>{new Date(document.created_at).toLocaleDateString()}</span>
                                                    </div>
                            </div>

                                            {/* Hover Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="p-4 bg-blue-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                        <FileText className="w-10 h-10 text-blue-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun document</h3>
                                    <p className="text-gray-600">Aucun document n'est disponible pour vous.</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {documents.links && documents.data.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            Affichage de <span className="font-semibold text-gray-800">{documents.from}</span> à <span className="font-semibold text-gray-800">{documents.to}</span> sur <span className="font-semibold text-gray-800">{documents.total}</span> résultats
                                        </div>
                                        <div className="flex items-center space-x-2">
                                                    {documents.links.map((link, index) => (
                                                        link.url ? (
                                                            <Link
                                                                key={index}
                                                                href={link.url}
                                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                                                    link.active
                                                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
                                                                }`}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        ) : (
                                                            <span
                                                                key={index}
                                                        className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 cursor-not-allowed"
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
