import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Mail, Phone, Building, Shield, Calendar, Edit, Lock, X, CheckCircle, Eye, EyeOff } from "lucide-react";

export default function Profile({ contractor }) {
    const { flash } = usePage().props;
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [formData, setFormData] = useState({
        name: contractor?.name || '',
        email: contractor?.email || '',
        phone: contractor?.phone || '',
        company_name: contractor?.company_name || '',
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEditSubmit = (e) => {
        e.preventDefault();
        router.post(route('contractant.profile.update'), formData, {
            onSuccess: () => {
                setShowEditModal(false);
            }
        });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        // Basic client-side validation
        if (passwordData.password !== passwordData.password_confirmation) {
            setPasswordError('Les nouveaux mots de passe ne correspondent pas.');
            return;
        }
        
        if (passwordData.password.length < 8) {
            setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
            return;
        }
        
        setIsSubmitting(true);
        try {
            const response = await fetch(route('contractant.password.change'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json',
                },
                body: JSON.stringify(passwordData)
            });

            const data = await response.json();

            if (data.success) {
                // Success - show success message first
                setPasswordSuccess(data.message);
                setPasswordError('');
                
                // Close modal after a short delay
                setTimeout(() => {
                    setShowPasswordModal(false);
                    setPasswordData({
                        current_password: '',
                        password: '',
                        password_confirmation: '',
                    });
                    setShowPasswords({
                        current: false,
                        new: false,
                        confirm: false,
                    });
                    setPasswordSuccess('');
                }, 2000);
            } else {
                // Error - show error message and keep modal open
                setPasswordError(data.error || 'Une erreur est survenue. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Password change error:', error);
            setPasswordError('Une erreur de connexion est survenue. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Mon Profil" />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-emerald-900 relative overflow-hidden">
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

                {/* Header */}
                <motion.header 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 p-6"
                >
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <Link 
                            href={route('contractant.home')}
                            className="group flex items-center space-x-3 text-white hover:text-cyan-300 transition-colors duration-300"
                        >
                            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 transition-all duration-300">
                                <ArrowLeft className="w-5 h-5" />
                            </div>
                            <span className="font-medium">Retour au tableau de bord</span>
                        </Link>

                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-300">Connecté en tant que</p>
                                <p className="font-medium text-white">{contractor?.company_name || 'Contractor'}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">
                                    {contractor?.name?.charAt(0)?.toUpperCase() || 'C'}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.header>

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
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <p className="text-green-300 font-medium">{flash.success}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <div className="relative z-10 px-6 pb-12">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-center mb-12"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Mon <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Profil</span>
                            </h1>
                            <p className="text-gray-300 text-lg">Consultez et gérez vos informations personnelles</p>
                        </motion.div>

                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            {/* Profile Header */}
                            <div className="text-center mb-8">
                                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                                    <span className="text-3xl font-bold text-white">
                                        {contractor?.name?.charAt(0)?.toUpperCase() || 'C'}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">{contractor?.name || 'Contractor'}</h2>
                                <p className="text-cyan-300 font-medium">{contractor?.role || 'Contractor'}</p>
                            </div>

                            {/* Profile Information */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-cyan-400" />
                                        Informations Personnelles
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                                            <Mail className="w-5 h-5 text-cyan-400" />
                                            <div>
                                                <p className="text-sm text-gray-400">Email</p>
                                                <p className="text-white font-medium">{contractor?.email || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                                            <Phone className="w-5 h-5 text-cyan-400" />
                                            <div>
                                                <p className="text-sm text-gray-400">Téléphone</p>
                                                <p className="text-white font-medium">{contractor?.phone || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                                            <Building className="w-5 h-5 text-cyan-400" />
                                            <div>
                                                <p className="text-sm text-gray-400">Entreprise</p>
                                                <p className="text-white font-medium">{contractor?.company_name || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                        <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                                        Informations du Compte
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                                            <Shield className="w-5 h-5 text-emerald-400" />
                                            <div>
                                                <p className="text-sm text-gray-400">Statut du Compte</p>
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-2 h-2 rounded-full ${contractor?.is_approved ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                                                    <p className={`font-medium ${contractor?.is_approved ? 'text-green-300' : 'text-yellow-300'}`}>
                                                        {contractor?.is_approved ? 'Approuvé' : 'En attente d\'approbation'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                                            <Calendar className="w-5 h-5 text-emerald-400" />
                                            <div>
                                                <p className="text-sm text-gray-400">Membre depuis</p>
                                                <p className="text-white font-medium">
                                                    {contractor?.created_at ? new Date(contractor.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                                            <Building className="w-5 h-5 text-emerald-400" />
                                            <div>
                                                <p className="text-sm text-gray-400">Projet Assigné</p>
                                                <p className="text-white font-medium">{contractor?.project?.name || 'Aucun projet assigné'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowEditModal(true)}
                                        className="px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 rounded-xl text-cyan-300 hover:from-cyan-500/30 hover:to-emerald-500/30 hover:border-cyan-400/50 hover:text-cyan-200 transition-all duration-300 backdrop-blur-sm flex items-center space-x-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Modifier le Profil</span>
                                    </motion.button>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowPasswordModal(true)}
                                        className="px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 hover:from-emerald-500/30 hover:to-cyan-500/30 hover:border-emerald-400/50 hover:text-emerald-200 transition-all duration-300 backdrop-blur-sm flex items-center space-x-2"
                                    >
                                        <Lock className="w-4 h-4" />
                                        <span>Changer le Mot de Passe</span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Edit Profile Modal */}
                <AnimatePresence>
                    {showEditModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                                onClick={() => setShowEditModal(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white">Modifier le Profil</h3>
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                                    >
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleEditSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Nom</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Téléphone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Entreprise</label>
                                        <input
                                            type="text"
                                            value={formData.company_name}
                                            onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                                        />
                                    </div>

                                    <div className="flex space-x-3 pt-4">
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setShowEditModal(false)}
                                            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
                                        >
                                            Annuler
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl text-white font-medium hover:from-cyan-600 hover:to-emerald-600 transition-all duration-300"
                                        >
                                            Sauvegarder
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Change Password Modal */}
                <AnimatePresence>
                    {showPasswordModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setShowPasswords({
                                        current: false,
                                        new: false,
                                        confirm: false,
                                    });
                                    setPasswordError('');
                                    setPasswordSuccess('');
                                }}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white">Changer le Mot de Passe</h3>
                                    <button
                                        onClick={() => {
                                            setShowPasswordModal(false);
                                            setShowPasswords({
                                                current: false,
                                                new: false,
                                                confirm: false,
                                            });
                                            setPasswordError('');
                                            setPasswordSuccess('');
                                        }}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                                    >
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>

                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    {passwordSuccess && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-3 flex items-center space-x-2"
                                        >
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            <p className="text-green-300 text-sm">{passwordSuccess}</p>
                                        </motion.div>
                                    )}
                                    {flash?.error && (
                                        <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-3 flex items-center space-x-2">
                                            <X className="w-4 h-4 text-red-400" />
                                            <p className="text-red-300 text-sm">{flash.error}</p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe actuel</label>
                                        <motion.div 
                                            className="relative"
                                            animate={passwordError ? { x: [-5, 5, -5, 5, 0] } : {}}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <input
                                                type={showPasswords.current ? "text" : "password"}
                                                name="current_password"
                                                value={passwordData.current_password}
                                                onChange={(e) => {
                                                    setPasswordData({...passwordData, current_password: e.target.value});
                                                    // Clear error when user starts typing
                                                    if (passwordError) {
                                                        setPasswordError('');
                                                    }
                                                }}
                                                className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:ring-1 transition-all duration-300 ${
                                                    passwordError 
                                                        ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/50' 
                                                        : 'border-white/20 focus:border-cyan-400 focus:ring-cyan-400/50'
                                                }`}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                                            >
                                                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </motion.div>
                                        {passwordError && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="mt-2 p-3 bg-red-500/10 border border-red-400/30 rounded-lg"
                                            >
                                                <p className="text-red-400 text-sm flex items-center mb-2">
                                                    <X className="w-4 h-4 mr-2" />
                                                    {passwordError}
                                                </p>
                                                <p className="text-red-300 text-xs">
                                                    Vérifiez votre mot de passe actuel et réessayez.
                                                </p>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Nouveau mot de passe</label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.new ? "text" : "password"}
                                                name="password"
                                                value={passwordData.password}
                                                onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                                                className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                                            >
                                                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {passwordData.password && (
                                            <div className="mt-2">
                                                <div className="flex space-x-1">
                                                    {[1, 2, 3, 4].map((level) => (
                                                        <div
                                                            key={level}
                                                            className={`h-1 flex-1 rounded ${
                                                                passwordData.password.length >= level * 2 
                                                                    ? passwordData.password.length >= 8 
                                                                        ? 'bg-green-400' 
                                                                        : 'bg-yellow-400'
                                                                    : 'bg-gray-600'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-xs mt-1 text-gray-400">
                                                    {passwordData.password.length < 8 ? 'Minimum 8 caractères requis' : 'Mot de passe sécurisé'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Confirmer le nouveau mot de passe</label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.confirm ? "text" : "password"}
                                                name="password_confirmation"
                                                value={passwordData.password_confirmation}
                                                onChange={(e) => setPasswordData({...passwordData, password_confirmation: e.target.value})}
                                                className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:ring-1 transition-all duration-300 ${
                                                    passwordData.password_confirmation && passwordData.password === passwordData.password_confirmation 
                                                        ? 'border-green-400/50 focus:border-green-400 focus:ring-green-400/50' 
                                                        : passwordData.password_confirmation && passwordData.password !== passwordData.password_confirmation
                                                        ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/50'
                                                        : 'border-white/20 focus:border-cyan-400 focus:ring-cyan-400/50'
                                                }`}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                                            >
                                                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {passwordData.password_confirmation && passwordData.password !== passwordData.password_confirmation && (
                                            <p className="text-red-400 text-xs mt-1">Les mots de passe ne correspondent pas</p>
                                        )}
                                        {passwordData.password_confirmation && passwordData.password === passwordData.password_confirmation && (
                                            <p className="text-green-400 text-xs mt-1">Les mots de passe correspondent</p>
                                        )}
                                    </div>

                                    <div className="flex space-x-3 pt-4">
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                setShowPasswordModal(false);
                                                setShowPasswords({
                                                    current: false,
                                                    new: false,
                                                    confirm: false,
                                                });
                                                setPasswordError('');
                                                setPasswordSuccess('');
                                            }}
                                            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
                                        >
                                            Annuler
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                                            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                            className={`flex-1 px-4 py-3 rounded-xl text-white font-medium transition-all duration-300 ${
                                                isSubmitting 
                                                    ? 'bg-gray-500 cursor-not-allowed' 
                                                    : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600'
                                            }`}
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Changement...</span>
                                                </div>
                                            ) : (
                                                'Changer'
                                            )}
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
