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

    const handleSearch = (e) => {
        setSearch(e.target.value);
        router.get(route('documents'), {
            search: e.target.value,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        router.get(route('documents'));
    };

    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) {
            return <Image className="w-5 h-5" style={{ color: '#4A5C6A' }} />;
        } else if (fileType === 'application/pdf') {
            return <FileText className="w-5 h-5" style={{ color: '#4A5C6A' }} />;
        } else if (fileType.startsWith('text/')) {
            return <FileText className="w-5 h-5" style={{ color: '#4A5C6A' }} />;
        } else if (fileType.includes('word') || fileType.includes('document')) {
            return <FileType className="w-5 h-5" style={{ color: '#4A5C6A' }} />;
        } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
            return <FileSpreadsheet className="w-5 h-5" style={{ color: '#4A5C6A' }} />;
        } else {
            return <Archive className="w-5 h-5" style={{ color: '#4A5C6A' }} />;
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

                                    {/* Logout Button */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                    >
                                        <Link
                                            href="/logout"
                                            method="post"
                                            className="group relative inline-flex items-center space-x-2 px-4 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg bg-red-500 hover:bg-red-600"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Déconnexion</span>
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
                <div className="relative z-10 py-8 px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Documents Publics
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Consultez et téléchargez les documents publics
                            </p>
                        </motion.div>

                        {/* Search Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="mb-8"
                        >
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold mb-3 text-slate-700">
                                            Rechercher
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                value={search}
                                                onChange={handleSearch}
                                                placeholder="Rechercher par titre ou description..."
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-end">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={clearFilters}
                                            className="flex items-center space-x-2 px-6 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-lg"
                                            style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
                                        >
                                            <X className="w-4 h-4" />
                                            <span className="text-white">Effacer</span>
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Documents Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden"
                        >
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gradient-to-r from-slate-800 to-slate-700">
                                        <tr>
                                            <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                Document
                                            </th>
                                            <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                Uploadé par
                                            </th>
                                            <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {documents.data.map((document, index) => (
                                            <motion.tr
                                                key={document.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                                                className="hover:bg-slate-50/80 transition-all duration-300 group"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                            {getFileIcon(document.file_type)}
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                                                                {document.title}
                                                            </div>
                                                            <div className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors">
                                                                {document.original_filename}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                        <span className="text-sm font-medium text-slate-600">
                                                            {new Date(document.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <User className="w-4 h-4 text-slate-400" />
                                                        <span className="text-sm font-semibold text-slate-700">
                                                            {document.full_name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <motion.a
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        href={route('documents.download', document.id)}
                                                        className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg"
                                                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        <span className="text-white">Télécharger</span>
                                                    </motion.a>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
                                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                        <FileText className="w-10 h-10 text-blue-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-3">Aucun document</h3>
                                    <p className="text-lg text-slate-600">Aucun document public n'est disponible.</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}