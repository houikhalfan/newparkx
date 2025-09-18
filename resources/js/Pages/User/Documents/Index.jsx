import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  X, 
  Download, 
  ArrowLeft,
  Calendar,
  User,
  File,
  Image,
  FileSpreadsheet,
  FileType,
  Archive,
  Sparkles,
  Shield,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  LogOut,
  UserCircle
} from 'lucide-react';

export default function DocumentsIndex({ documents, filters }) {
    const { auth } = usePage().props || {};
    const { user } = auth || {};
    const [search, setSearch] = useState(filters.search || '');
    const [date, setDate] = useState(filters.date || '');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        router.get(route('documents'), {
            search: e.target.value,
            date: date,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
        router.get(route('documents'), {
            search: search,
            date: e.target.value,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setDate('');
        router.get(route('documents'));
    };

    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) {
            return <Image className="w-8 h-8" style={{ color: '#FF6B9D' }} />;
        } else if (fileType === 'application/pdf') {
            return <FileText className="w-8 h-8" style={{ color: '#FF6B6B' }} />;
        } else if (fileType.startsWith('text/')) {
            return <FileText className="w-8 h-8" style={{ color: '#4ECDC4' }} />;
        } else if (fileType.includes('word') || fileType.includes('document')) {
            return <FileType className="w-8 h-8" style={{ color: '#45B7D1' }} />;
        } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
            return <FileSpreadsheet className="w-8 h-8" style={{ color: '#96CEB4' }} />;
        } else {
            return <Archive className="w-8 h-8" style={{ color: '#FFEAA7' }} />;
        }
    };

    return (
        <>
            <Head title="Documents" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
                {/* Animated Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-emerald-400/10 rounded-full blur-2xl animate-pulse" />
                </div>

                {/* Modern Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                >
                    <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
                        <div className="max-w-7xl mx-auto px-6 py-6">
                            <div className="flex items-center justify-between">
                                {/* Logo & Brand */}
                                <div className="flex items-center space-x-4">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                        className="relative"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                                            <FileText className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse" />
                                    </motion.div>
                                    <div>
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                            Documents
                                        </h1>
                                        <p className="text-sm text-slate-500 font-medium">Gestion des documents publics</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-3">
                                    {/* Back Button */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                    >
                                        <Link
                                            href="/dashboard"
                                            className="group relative inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            <span>Retour au Tableau de Bord</span>
                                        </Link>
                                    </motion.div>

                                 

                                    {/* User Info */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                        className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                                            <UserCircle className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-slate-800">
                                            <p className="text-sm font-medium">{user?.name || 'Utilisateur'}</p>
                                            <p className="text-xs text-slate-600">ParkX</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.header>

                {/* Main Content */}
                <div className="relative z-10 py-6 px-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Page Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Documents Publics
                            </h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Consultez et téléchargez les documents publics
                            </p>
                        </motion.div>

                        {/* Compact Search Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="mb-6"
                        >
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 max-w-4xl mx-auto">
                                <div className="flex flex-col sm:flex-row gap-4 items-end">
                                    {/* Search Input */}
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium mb-1 text-slate-600">
                                            Titre
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={search}
                                                onChange={handleSearch}
                                                placeholder="Rechercher par titre..."
                                                className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="w-full sm:w-48">
                                        <label className="block text-xs font-medium mb-1 text-slate-600">
                                            Date
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={handleDateChange}
                                                className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Clear Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={clearFilters}
                                        className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 shadow-md"
                                            style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
                                        >
                                        <X className="w-3 h-3" />
                                            <span className="text-white">Effacer</span>
                                        </motion.button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Documents Cards Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                                        {documents.data.map((document, index) => (
                                <motion.div
                                                key={document.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ 
                                        delay: 0.8 + index * 0.1, 
                                        duration: 0.6,
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                    whileHover={{ 
                                        scale: 1.05, 
                                        y: -8,
                                        transition: { duration: 0.2 }
                                    }}
                                    className="group relative"
                                >
                                    {/* Glass-morphism Card */}
                                    <div 
                                        className="relative h-full bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500"
                                        style={{
                                            background: `linear-gradient(135deg, 
                                                ${index % 4 === 0 ? 'rgba(147, 51, 234, 0.15)' : 
                                                  index % 4 === 1 ? 'rgba(59, 130, 246, 0.15)' :
                                                  index % 4 === 2 ? 'rgba(236, 72, 153, 0.15)' :
                                                  'rgba(16, 185, 129, 0.15)'}, 
                                                ${index % 4 === 0 ? 'rgba(236, 72, 153, 0.1)' : 
                                                  index % 4 === 1 ? 'rgba(147, 51, 234, 0.1)' :
                                                  index % 4 === 2 ? 'rgba(16, 185, 129, 0.1)' :
                                                  'rgba(59, 130, 246, 0.1)'}, 
                                                rgba(255, 255, 255, 0.8)
                                            )`
                                        }}
                                    >
                                        {/* Gradient Background Overlay */}
                                        <div 
                                            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{
                                                background: `linear-gradient(135deg, 
                                                    ${index % 4 === 0 ? 'rgba(147, 51, 234, 0.25)' : 
                                                      index % 4 === 1 ? 'rgba(59, 130, 246, 0.25)' :
                                                      index % 4 === 2 ? 'rgba(236, 72, 153, 0.25)' :
                                                      'rgba(16, 185, 129, 0.25)'}, 
                                                    ${index % 4 === 0 ? 'rgba(236, 72, 153, 0.15)' : 
                                                      index % 4 === 1 ? 'rgba(147, 51, 234, 0.15)' :
                                                      index % 4 === 2 ? 'rgba(16, 185, 129, 0.15)' :
                                                      'rgba(59, 130, 246, 0.15)'}
                                                )`
                                            }}
                                        />
                                        
                                        {/* Concentric Circles Background */}
                                        <div className="absolute inset-0 overflow-hidden rounded-3xl">
                                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-xl animate-pulse" />
                                            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/20 rounded-full blur-lg animate-pulse delay-1000" />
                                        </div>

                                        {/* Card Content */}
                                        <div className="relative z-10">
                                            {/* Document Icon */}
                                            <div className="flex justify-center mb-6">
                                                <motion.div
                                                    whileHover={{ rotate: 360 }}
                                                    transition={{ duration: 0.8 }}
                                                    className="w-20 h-20 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20"
                                                >
                                                    <div className="text-4xl">
                                                            {getFileIcon(document.file_type)}
                                                    </div>
                                                </motion.div>
                                            </div>

                                            {/* Document Title */}
                                            <div className="text-center mb-6">
                                                <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-slate-900 transition-colors duration-300">
                                                    {document.title}
                                                </h3>
                                                <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
                                                    {document.original_filename}
                                                </p>
                                            </div>

                                            {/* Document Info */}
                                            <div className="mb-8">
                                                {/* Date */}
                                                <div className="flex items-center justify-center space-x-2 text-slate-700 group-hover:text-slate-800 transition-colors duration-300">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="text-sm font-medium">
                                                        {new Date(document.created_at).toLocaleDateString('fr-FR', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                        </span>
                                                    </div>
                                                    </div>

                                            {/* Download Button */}
                                                    <motion.a
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        href={route('documents.download', document.id)}
                                                className="block w-full"
                                            >
                                                <div 
                                                    className="rounded-2xl px-6 py-4 text-center transition-all duration-300 group-hover:shadow-lg"
                                                    style={{
                                                        background: `linear-gradient(135deg, 
                                                            ${index % 4 === 0 ? '#9333ea' : 
                                                              index % 4 === 1 ? '#3b82f6' :
                                                              index % 4 === 2 ? '#ec4899' :
                                                              '#10b981'}, 
                                                            ${index % 4 === 0 ? '#ec4899' : 
                                                              index % 4 === 1 ? '#9333ea' :
                                                              index % 4 === 2 ? '#10b981' :
                                                              '#3b82f6'}
                                                        )`
                                                    }}
                                                >
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <Download className="w-5 h-5 text-white" />
                                                        <span className="text-white font-semibold">Télécharger</span>
                                                    </div>
                                                </div>
                                                    </motion.a>
                                        </div>

                                        {/* Shimmer Effect */}
                                        <div className="absolute inset-0 -top-2 -left-2 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Pagination */}
                        {documents.links && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 0.6 }}
                                className="mt-8"
                            >
                                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                                    <nav className="flex items-center justify-between">
                                        <div className="flex-1 flex justify-between sm:hidden">
                                            {documents.links.prev ? (
                                                <Link
                                                    href={documents.links.prev}
                                                    className="flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-lg"
                                                    style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
                                                >
                                                    <ArrowLeft className="w-4 h-4" />
                                                    <span className="text-white">Précédent</span>
                                                </Link>
                                            ) : (
                                                <span className="flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-semibold cursor-not-allowed bg-slate-100 text-slate-400">
                                                    <ArrowLeft className="w-4 h-4" />
                                                    <span>Précédent</span>
                                                </span>
                                            )}
                                            
                                            {documents.links.next ? (
                                                <Link
                                                    href={documents.links.next}
                                                    className="ml-3 flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-lg"
                                                    style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
                                                >
                                                    <span className="text-white">Suivant</span>
                                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                                </Link>
                                            ) : (
                                                <span className="ml-3 flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-semibold cursor-not-allowed bg-slate-100 text-slate-400">
                                                    <span>Suivant</span>
                                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-600">
                                                    Affichage de <span className="font-bold text-slate-800">{documents.from}</span> à <span className="font-bold text-slate-800">{documents.to}</span> sur <span className="font-bold text-slate-800">{documents.total}</span> résultats
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-2xl shadow-lg -space-x-px">
                                                    {documents.links.map((link, index) => (
                                                        link.url ? (
                                                            <Link
                                                                key={index}
                                                                href={link.url}
                                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                                                                    link.active
                                                                        ? 'z-10 text-white shadow-lg'
                                                                        : 'text-slate-600 hover:bg-slate-50'
                                                                }`}
                                                                style={{
                                                                    backgroundColor: link.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                                                                    border: '1px solid #e2e8f0'
                                                                }}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        ) : (
                                                            <span
                                                                key={index}
                                                                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold cursor-not-allowed bg-slate-100 text-slate-400"
                                                                style={{ border: '1px solid #e2e8f0' }}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        )
                                                    ))}
                                                </nav>
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                            </motion.div>
                        )}

                        {/* Empty State */}
                        {documents.data.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                className="text-center py-20"
                            >
                                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50 max-w-md mx-auto overflow-hidden">
                                    {/* Background Effects */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-blue-500/10 to-pink-500/15 rounded-3xl" />
                                    <div className="absolute inset-0 overflow-hidden rounded-3xl">
                                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-xl animate-pulse" />
                                        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/20 rounded-full blur-lg animate-pulse delay-1000" />
                                    </div>
                                    
                                    <div className="relative z-10">
                                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center border border-white/30">
                                            <FileText className="w-10 h-10 text-slate-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-3">Aucun document</h3>
                                    <p className="text-lg text-slate-600">Aucun document public n'est disponible.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}