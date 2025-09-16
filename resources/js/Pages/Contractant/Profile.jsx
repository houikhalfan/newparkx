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
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
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
                            className="group flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors duration-300"
                        >
                            <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 group-hover:bg-blue-50 group-hover:border-blue-300 transition-all duration-300 shadow-lg">
                                <ArrowLeft className="w-5 h-5" />
                            </div>
                            <span className="font-semibold">Retour au tableau de bord</span>
                        </Link>

                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Connecté en tant que</p>
                                <p className="font-semibold text-gray-800">{contractor?.company_name || 'Contractor'}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">
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
                                <div className="bg-green-50 backdrop-blur-sm border border-green-200 rounded-xl p-4 flex items-center space-x-3 shadow-lg">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <p className="text-green-700 font-semibold">{flash.success}</p>
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
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                                Mon <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Profil</span>
                            </h1>
                            <p className="text-gray-600 text-lg">Consultez et gérez vos informations personnelles</p>
                        </motion.div>

                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.1)'
                            }}
                        >
                            {/* Profile Header */}
                            <div className="text-center mb-8">
                                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
                                    <span className="text-3xl font-bold text-white">
                                        {contractor?.name?.charAt(0)?.toUpperCase() || 'C'}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{contractor?.name || 'Contractor'}</h2>
                                <p className="text-blue-600 font-semibold">{contractor?.role || 'Contractor'}</p>
                            </div>

                            {/* Profile Information */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-blue-500" />
                                        Informations Personnelles
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                            <Mail className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium">Email</p>
                                                <p className="text-gray-800 font-semibold">{contractor?.email || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                            <Phone className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium">Téléphone</p>
                                                <p className="text-gray-800 font-semibold">{contractor?.phone || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                            <Building className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium">Entreprise</p>
                                                <p className="text-gray-800 font-semibold">{contractor?.company_name || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <Shield className="w-5 h-5 mr-2 text-emerald-500" />
                                        Informations du Compte
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                            <Shield className="w-5 h-5 text-emerald-500" />
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium">Statut du Compte</p>
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-2 h-2 rounded-full ${contractor?.is_approved ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                                    <p className={`font-semibold ${contractor?.is_approved ? 'text-green-700' : 'text-yellow-700'}`}>
                                                        {contractor?.is_approved ? 'Approuvé' : 'En attente d\'approbation'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                            <Calendar className="w-5 h-5 text-emerald-500" />
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium">Membre depuis</p>
                                                <p className="text-gray-800 font-semibold">
                                                    {contractor?.created_at ? new Date(contractor.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                            <Building className="w-5 h-5 text-emerald-500" />
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium">Projet Assigné</p>
                                                <p className="text-gray-800 font-semibold">{contractor?.project?.name || 'Aucun projet assigné'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowEditModal(true)}
                                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                                    >
                                        <Edit className="w-5 h-5" />
                                        <span className="font-semibold">Modifier le Profil</span>
                                    </motion.button>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowPasswordModal(true)}
                                        className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                                    >
                                        <Lock className="w-5 h-5" />
                                        <span className="font-semibold">Changer le Mot de Passe</span>
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
                                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                                onClick={() => setShowEditModal(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-6 shadow-2xl"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.1)'
                                }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Modifier le Profil</h3>
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <form onSubmit={handleEditSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Entreprise</label>
                                        <input
                                            type="text"
                                            value={formData.company_name}
                                            onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                        />
                                    </div>

                                    <div className="flex space-x-3 pt-4">
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setShowEditModal(false)}
                                            className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-200 transition-all duration-300 font-semibold"
                                        >
                                            Annuler
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
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
                                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
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
                                className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-6 shadow-2xl"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.1)'
                                }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Changer le Mot de Passe</h3>
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
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    {passwordSuccess && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center space-x-2"
                                        >
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <p className="text-green-700 text-sm font-semibold">{passwordSuccess}</p>
                                        </motion.div>
                                    )}
                                    {flash?.error && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center space-x-2">
                                            <X className="w-4 h-4 text-red-500" />
                                            <p className="text-red-700 text-sm font-semibold">{flash.error}</p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe actuel</label>
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
                                                className={`w-full px-4 py-3 pr-12 bg-white border rounded-xl text-gray-800 placeholder-gray-500 focus:ring-2 transition-all duration-300 ${
                                                    passwordError 
                                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                                                }`}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                            >
                                                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </motion.div>
                                        {passwordError && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                                            >
                                                <p className="text-red-600 text-sm flex items-center mb-2 font-semibold">
                                                    <X className="w-4 h-4 mr-2" />
                                                    {passwordError}
                                                </p>
                                                <p className="text-red-500 text-xs">
                                                    Vérifiez votre mot de passe actuel et réessayez.
                                                </p>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nouveau mot de passe</label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.new ? "text" : "password"}
                                                name="password"
                                                value={passwordData.password}
                                                onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                                                className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
                                                                        ? 'bg-green-500' 
                                                                        : 'bg-yellow-500'
                                                                    : 'bg-gray-300'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-xs mt-1 text-gray-600 font-medium">
                                                    {passwordData.password.length < 8 ? 'Minimum 8 caractères requis' : 'Mot de passe sécurisé'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.confirm ? "text" : "password"}
                                                name="password_confirmation"
                                                value={passwordData.password_confirmation}
                                                onChange={(e) => setPasswordData({...passwordData, password_confirmation: e.target.value})}
                                                className={`w-full px-4 py-3 pr-12 bg-white border rounded-xl text-gray-800 placeholder-gray-500 focus:ring-2 transition-all duration-300 ${
                                                    passwordData.password_confirmation && passwordData.password === passwordData.password_confirmation 
                                                        ? 'border-green-400 focus:border-green-500 focus:ring-green-200' 
                                                        : passwordData.password_confirmation && passwordData.password !== passwordData.password_confirmation
                                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                                                }`}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                            >
                                                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {passwordData.password_confirmation && passwordData.password !== passwordData.password_confirmation && (
                                            <p className="text-red-600 text-xs mt-1 font-medium">Les mots de passe ne correspondent pas</p>
                                        )}
                                        {passwordData.password_confirmation && passwordData.password === passwordData.password_confirmation && (
                                            <p className="text-green-600 text-xs mt-1 font-medium">Les mots de passe correspondent</p>
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
                                            className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-200 transition-all duration-300 font-semibold"
                                        >
                                            Annuler
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                                            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                            className={`flex-1 px-4 py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
                                                isSubmitting 
                                                    ? 'bg-gray-400 cursor-not-allowed' 
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
