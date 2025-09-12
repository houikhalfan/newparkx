import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    FileText, 
    ArrowLeft, 
    Edit3, 
    Download, 
    User, 
    Calendar, 
    HardDrive, 
    Eye, 
    Shield, 
    Clock,
    File,
    Image,
    FileSpreadsheet,
    FileCode,
    Archive,
    Music,
    Video,
    Globe,
    Lock,
    Users,
    CheckCircle
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ document }) {
    const getVisibilityBadges = (visibility) => {
        const badgeConfig = {
            public: { 
                bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
                text: 'text-emerald-800 dark:text-emerald-300', 
                icon: Globe,
                label: 'Public' 
            },
            private: { 
                bg: 'bg-red-100 dark:bg-red-900/30', 
                text: 'text-red-800 dark:text-red-300', 
                icon: Lock,
                label: 'Private' 
            },
            contractant: { 
                bg: 'bg-blue-100 dark:bg-blue-900/30', 
                text: 'text-blue-800 dark:text-blue-300', 
                icon: Users,
                label: 'Contractor' 
            },
        };

        return visibility.map((v, index) => {
            const config = badgeConfig[v] || { 
                bg: 'bg-slate-100 dark:bg-slate-800', 
                text: 'text-slate-800 dark:text-slate-300', 
                icon: CheckCircle,
                label: v 
            };
            const Icon = config.icon;
            
            return (
                <motion.span
                    key={v}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${config.bg} ${config.text} border border-current/20`}
                >
                    <Icon className="w-4 h-4" />
                    {config.label}
                </motion.span>
            );
        });
    };

    const getFileIcon = (fileType) => {
        const iconConfig = {
            'image/': { icon: Image, color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/30' },
            'application/pdf': { icon: FileText, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
            'text/': { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
            'word': { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
            'document': { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
            'excel': { icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
            'spreadsheet': { icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
            'video/': { icon: Video, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
            'audio/': { icon: Music, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
            'application/zip': { icon: Archive, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
            'application/x-zip-compressed': { icon: Archive, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
        };

        for (const [key, config] of Object.entries(iconConfig)) {
            if (fileType.includes(key)) {
                return config;
            }
        }

        return { icon: File, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800' };
    };

    const fileIconConfig = getFileIcon(document.file_type);
    const FileIcon = fileIconConfig.icon;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const iconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                duration: 0.6,
                ease: "backOut"
            }
        }
    };

    return (
        <AdminLayout>
            <Head title={`Document: ${document.title}`} />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
                {/* Enhanced Animated Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl animate-pulse" />
                </div>

                <div className="relative z-10 py-8">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-8"
                        >
                            {/* Enhanced Header */}
                            <motion.div
                                variants={cardVariants}
                                className="relative"
                            >
                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <motion.div
                                                variants={iconVariants}
                                                className={`p-4 ${fileIconConfig.bg} rounded-2xl shadow-lg`}
                                            >
                                                <FileIcon className={`w-8 h-8 ${fileIconConfig.color}`} />
                                            </motion.div>
                                            <div>
                                                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                                    {document.title}
                                                </h1>
                                                <p className="text-xl font-semibold text-slate-600 dark:text-slate-400 mt-1">
                                                    Détails du document
                                                </p>
                                                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4" />
                                                        <span>{document.file_type}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4" />
                                                        <span>{document.full_name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{new Date(document.created_at).toLocaleDateString('fr-FR')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Link
                                                    href={route('admin.documents.edit', document.id)}
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium shadow-lg hover:shadow-xl"
                                                >
                                                    <Edit3 className="w-5 h-5" />
                                                    Modifier
                                                </Link>
                                            </motion.div>
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Link
                                                    href={route('admin.documents.index')}
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg hover:shadow-xl"
                                                >
                                                    <ArrowLeft className="w-5 h-5" />
                                                    Retour à la liste
                                                </Link>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Main Information - Left Column */}
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Basic Information */}
                                    <motion.div
                                        variants={cardVariants}
                                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                                                <FileText className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Informations générales</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {[
                                                { label: 'Titre', value: document.title, icon: FileText },
                                                { label: 'Nom du fichier', value: document.original_filename, icon: File },
                                                { label: 'Type de fichier', value: document.file_type, icon: FileCode },
                                                { label: 'Taille', value: document.formatted_file_size, icon: HardDrive },
                                                { label: 'Uploadé par', value: document.full_name, icon: User },
                                                { label: 'Date d\'upload', value: new Date(document.created_at).toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }), icon: Calendar }
                                            ].map((item, index) => (
                                                <motion.div
                                                    key={item.label}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <item.icon className="w-5 h-5 text-slate-500" />
                                                        <span className="font-medium text-slate-600 dark:text-slate-300">{item.label}:</span>
                                                    </div>
                                                    <span className="font-semibold text-slate-800 dark:text-white text-right max-w-xs truncate" title={item.value}>
                                                        {item.value}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Description */}
                                    {document.description && (
                                        <motion.div
                                            variants={cardVariants}
                                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8"
                                        >
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                                                    <FileText className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Description</h3>
                                            </div>
                                            <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                                    {document.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Metadata */}
                                    {document.meta && (
                                        <motion.div
                                            variants={cardVariants}
                                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8"
                                        >
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                                                    <Shield className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Métadonnées</h3>
                                            </div>
                                            <div className="space-y-4">
                                                {[
                                                    { label: 'Uploadé le', value: document.meta.uploaded_at ? new Date(document.meta.uploaded_at).toLocaleDateString('fr-FR') : 'N/A', icon: Calendar },
                                                    { label: 'Adresse IP', value: document.meta.uploaded_by_ip || 'N/A', icon: Globe }
                                                ].map((item, index) => (
                                                    <motion.div
                                                        key={item.label}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <item.icon className="w-5 h-5 text-slate-500" />
                                                            <span className="font-medium text-slate-600 dark:text-slate-300">{item.label}:</span>
                                                        </div>
                                                        <span className="font-semibold text-slate-800 dark:text-white">{item.value}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Sidebar - Right Column */}
                                <div className="space-y-8">
                                    {/* File Preview */}
                                    <motion.div
                                        variants={cardVariants}
                                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl">
                                                <FileIcon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Fichier</h3>
                                        </div>
                                        <div className="text-center">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                                className={`inline-flex items-center justify-center w-24 h-24 ${fileIconConfig.bg} rounded-3xl mb-4 shadow-lg`}
                                            >
                                                <FileIcon className={`w-12 h-12 ${fileIconConfig.color}`} />
                                            </motion.div>
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 break-all mb-2">
                                                {document.original_filename}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {document.formatted_file_size}
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* Visibility */}
                                    <motion.div
                                        variants={cardVariants}
                                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                                                <Eye className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Visibilité</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {getVisibilityBadges(document.visibility)}
                                        </div>
                                    </motion.div>

                                    {/* Actions */}
                                    <motion.div
                                        variants={cardVariants}
                                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                                                <Download className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Actions</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <motion.a
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                href={route('admin.documents.download', document.id)}
                                                className="block w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center px-6 py-4 rounded-2xl font-medium shadow-lg hover:from-emerald-600 hover:to-teal-600 transition-all hover:shadow-xl"
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    <Download className="w-5 h-5" />
                                                    Télécharger
                                                </div>
                                            </motion.a>
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Link
                                                    href={route('admin.documents.edit', document.id)}
                                                    className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center px-6 py-4 rounded-2xl font-medium shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all hover:shadow-xl"
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Edit3 className="w-5 h-5" />
                                                        Modifier
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}