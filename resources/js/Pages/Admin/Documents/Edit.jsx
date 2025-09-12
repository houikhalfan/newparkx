import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, 
    Upload, 
    X, 
    Save, 
    ArrowLeft, 
    Eye, 
    EyeOff, 
    Users, 
    Shield, 
    Building2, 
    CheckCircle, 
    AlertCircle,
    Sparkles,
    Zap,
    File,
    Image,
    FileSpreadsheet,
    FileImage,
    Download,
    Calendar,
    Clock,
    User
} from 'lucide-react';

export default function Edit({ document }) {
    const [dragActive, setDragActive] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        title: document.title,
        description: document.description || '',
        visibility: document.visibility || ['private'],
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.documents.update', document.id));
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setData('file', e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setData('file', e.target.files[0]);
        }
    };

    const handleVisibilityChange = (visibility) => {
        const currentVisibility = data.visibility;
        if (currentVisibility.includes(visibility)) {
            setData('visibility', currentVisibility.filter(v => v !== visibility));
        } else {
            setData('visibility', [...currentVisibility, visibility]);
        }
    };

    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) {
            return <FileImage className="w-8 h-8 text-purple-500" />;
        } else if (fileType === 'application/pdf') {
            return <FileText className="w-8 h-8 text-red-500" />;
        } else if (fileType.startsWith('text/')) {
            return <FileText className="w-8 h-8 text-blue-500" />;
        } else if (fileType.includes('word') || fileType.includes('document')) {
            return <FileText className="w-8 h-8 text-blue-500" />;
        } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
            return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
        } else {
            return <File className="w-8 h-8 text-slate-500" />;
        }
    };

    const getVisibilityIcon = (type) => {
        switch (type) {
            case 'public':
                return <Eye className="w-5 h-5" />;
            case 'private':
                return <Shield className="w-5 h-5" />;
            case 'contractant':
                return <Building2 className="w-5 h-5" />;
            default:
                return <Users className="w-5 h-5" />;
        }
    };

    const getVisibilityColor = (type) => {
        switch (type) {
            case 'public':
                return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
            case 'private':
                return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
            case 'contractant':
                return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
            default:
                return 'text-slate-600 bg-slate-50 dark:bg-slate-900/20 dark:text-slate-400';
        }
    };

    return (
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
                                <FileText className="w-8 h-8 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 via-blue-900 via-purple-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:via-purple-100 dark:to-indigo-100 bg-clip-text text-transparent">
                                    Modifier le document
                                </h1>
                                <p className="text-lg text-slate-600 dark:text-slate-300 mt-2 font-medium">
                                    Mettre à jour les informations du document
                                </p>
                            </div>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href={route('admin.documents.show', document.id)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Retour au document
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

                            {/* Current File Info */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl mb-8"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50 dark:from-emerald-900/20 dark:via-teal-900/10 dark:to-cyan-900/20" />
                    <div className="relative p-6">
                        <div className="text-center mb-6">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl mb-4"
                            >
                                <FileText className="w-7 h-7 text-white" />
                            </motion.div>
                            <h2 className="text-2xl font-black bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 dark:from-white dark:via-emerald-100 dark:to-teal-100 bg-clip-text text-transparent mb-2">
                                Fichier actuel
                            </h2>
                                    </div>
                        <div className="flex items-center justify-center">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-4 p-4 bg-white/80 dark:bg-slate-700/80 rounded-2xl border border-white/20 dark:border-slate-600/50"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4, type: "spring" }}
                                >
                                    {getFileIcon(document.file_type)}
                                </motion.div>
                                <div className="text-center">
                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{document.original_filename}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{document.formatted_file_size}</p>
                                </div>
                            </motion.div>
                                </div>
                            </div>
                </motion.div>

                {/* Enhanced Form */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-indigo-900/20" />
                    <div className="relative p-8 md:p-10">
                        <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Title */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                <label htmlFor="title" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">
                                        Titre du document *
                                    </label>
                                <div className="relative group">
                                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
                                            errors.title ? "border-red-500 focus:ring-red-500/20" : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                                        }`}
                                        placeholder="Entrez le titre du document"
                                    />
                                </div>
                                {errors.title && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.title}
                                    </motion.p>
                                )}
                            </motion.div>

                                {/* Description */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                            >
                                <label htmlFor="description" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                    className="w-full px-4 py-4 rounded-2xl border-2 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 resize-none"
                                        placeholder="Décrivez le contenu du document"
                                    />
                                    {errors.description && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.description}
                                    </motion.p>
                                )}
                            </motion.div>

                                {/* Visibility */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                            >
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">
                                        Visibilité *
                                    </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { value: 'public', label: 'Public', description: 'Visible par tous les utilisateurs ParkX' },
                                        { value: 'private', label: 'Privé', description: 'Visible uniquement par les administrateurs' },
                                        { value: 'contractant', label: 'Contractant', description: 'Visible uniquement par les contractants' }
                                    ].map((option) => (
                                        <motion.label
                                            key={option.value}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`relative flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                                                data.visibility.includes(option.value)
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.visibility.includes(option.value)}
                                                onChange={() => handleVisibilityChange(option.value)}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${getVisibilityColor(option.value)}`}>
                                                    {getVisibilityIcon(option.value)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                        {option.label}
                                                    </div>
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                                        {option.description}
                                                    </div>
                                                </div>
                                    </div>
                                            {data.visibility.includes(option.value) && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute top-2 right-2"
                                                >
                                                    <CheckCircle className="w-5 h-5 text-blue-500" />
                                                </motion.div>
                                            )}
                                        </motion.label>
                                    ))}
                                </div>
                                {errors.visibility && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.visibility}
                                    </motion.p>
                                )}
                            </motion.div>

                                {/* File Replacement */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                            >
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">
                                        Remplacer le fichier (optionnel)
                                    </label>
                                    
                                {/* Enhanced Drag and Drop Area */}
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                                            dragActive 
                                            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105' 
                                            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                                        }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                    <AnimatePresence mode="wait">
                                        {data.file ? (
                                            <motion.div
                                                key="file-selected"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="space-y-4"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.2, type: "spring" }}
                                                    className="flex items-center justify-center"
                                                >
                                                    {getFileIcon(data.file.type)}
                                                </motion.div>
                                                <div>
                                                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                                                        {data.file.name}
                                                    </div>
                                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                                        {(data.file.size / 1024 / 1024).toFixed(2)} MB
                                                    </div>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    type="button"
                                                    onClick={() => setData('file', null)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Supprimer le nouveau fichier
                                                </motion.button>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="file-empty"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="space-y-4"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ delay: 0.2, type: "spring" }}
                                                    className="flex justify-center"
                                                >
                                                    <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                                                        <Upload className="w-12 h-12 text-white" />
                                                    </div>
                                                </motion.div>
                                                <div>
                                                    <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                                                        Glissez-déposez un nouveau fichier ici
                                                    </p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                        ou{' '}
                                                        <label htmlFor="file-upload" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 cursor-pointer font-semibold">
                                                            cliquez pour sélectionner
                                                        </label>
                                                    </p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                                        Laisser vide pour conserver le fichier actuel
                                                    </p>
                                                </div>
                                                <input
                                                    id="file-upload"
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                                    
                                    {errors.file && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.file}
                                    </motion.p>
                                )}
                            </motion.div>

                                {/* Error Messages */}
                            <AnimatePresence>
                                {errors.error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4"
                                    >
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                            <p className="text-sm text-red-600 dark:text-red-400">{errors.error}</p>
                                    </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                                {/* Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9, duration: 0.5 }}
                                className="flex items-center justify-end gap-4 pt-6"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href={route('admin.documents.show', document.id)}
                                        className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium"
                                    >
                                        <X className="w-5 h-5" />
                                        Annuler
                                    </Link>
                                </motion.div>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        disabled={processing || !data.title || data.visibility.length === 0}
                                    className="group relative inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white rounded-2xl hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 transition-all duration-300 font-bold shadow-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                        className="relative z-10"
                                    >
                                        {processing ? <Zap className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                                    </motion.div>
                                    <span className="relative z-10">
                                        {processing ? 'Mise à jour...' : 'Mettre à jour'}
                                    </span>
                                </motion.button>
                            </motion.div>
                            </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// Set the layout
Edit.layout = (page) => <AdminLayout>{page}</AdminLayout>;