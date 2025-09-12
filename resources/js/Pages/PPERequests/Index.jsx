import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
  Package, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  User, 
  Calendar, 
  Shield,
  CheckCircle,
  AlertCircle,
  Sparkles,
  LogOut,
  UserCircle
} from 'lucide-react';

export default function PPERequestsIndex({ availableEpiTypes, availableSizes, availablePointures }) {
    const { auth } = usePage().props || {};
    const { user } = auth || {};
    const [formData, setFormData] = useState({
        nom_prenom: '',
        date_demande: new Date().toISOString().split('T')[0],
        liste_epi: [''],
        quantites: [1],
        tailles: [''],
        pointures: [''],
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (field, index, value) => {
        const newData = { ...formData };
        
        if (index !== undefined) {
            newData[field][index] = value;
        } else {
            newData[field] = value;
        }
        
        setFormData(newData);
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
    };

    const addEpiItem = () => {
        setFormData({
            ...formData,
            liste_epi: [...formData.liste_epi, ''],
            quantites: [...formData.quantites, 1],
            tailles: [...formData.tailles, ''],
            pointures: [...formData.pointures, ''],
        });
    };

    const removeEpiItem = (index) => {
        if (formData.liste_epi.length > 1) {
            const newData = { ...formData };
            newData.liste_epi.splice(index, 1);
            newData.quantites.splice(index, 1);
            newData.tailles.splice(index, 1);
            newData.pointures.splice(index, 1);
            setFormData(newData);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Filter out empty EPI items
        const filteredData = {
            ...formData,
            liste_epi: formData.liste_epi.filter(epi => epi !== ''),
            quantites: formData.quantites.filter((_, index) => formData.liste_epi[index] !== ''),
            tailles: formData.tailles.filter((_, index) => formData.liste_epi[index] !== ''),
            pointures: formData.pointures.filter((_, index) => formData.liste_epi[index] !== ''),
        };

        router.post(route('ppe-requests.store'), filteredData, {
            onError: (errors) => setErrors(errors),
        });
    };

    const needsSize = (epi) => {
        const sizeRequiredEpi = ['Polo', 'T-shirt', 'Gilet HV', 'Parka', 'Pantalon', 'Harnais de sécurité'];
        return sizeRequiredEpi.includes(epi);
    };

    const needsPointure = (epi) => {
        const pointureRequiredEpi = ['Chaussures de sécurité', 'Botte de sécurité'];
        return pointureRequiredEpi.includes(epi);
    };

    return (
        <>
            <Head title="Demande d'EPI" />
      
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
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                                            <Package className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse" />
                                    </motion.div>
                                    <div>
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                            Demande d'EPI
                                        </h1>
                                        <p className="text-sm text-slate-500 font-medium">Équipements de protection individuelle</p>
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
                                            style={{ background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' }}
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            <span>Retour au Tableau de Bord</span>
                                        </Link>
                                    </motion.div>

                                    {/* Mes Demandes Button */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                    >
                                        <Link
                                            href={route('ppe-requests.history')}
                                            className="group relative inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                        >
                                            <Shield className="w-4 h-4" />
                                            <span>Mes Demandes</span>
                                        </Link>
                                    </motion.div>

                                    {/* Logout Button */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
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
                                        transition={{ delay: 0.6, duration: 0.5 }}
                                        className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
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
                    <div className="max-w-4xl mx-auto">
                        {/* Page Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Demande d'EPI
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Demandez vos équipements de protection individuelle
                            </p>
                        </motion.div>

                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20"
                        >
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Personal Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6, duration: 0.5 }}
                                    >
                                        <label className="block text-sm font-bold text-slate-700 mb-3">
                                            <User className="inline w-4 h-4 mr-2" />
                                            Nom et Prénom *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nom_prenom}
                                            onChange={(e) => handleInputChange('nom_prenom', undefined, e.target.value)}
                                            className={`w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-slate-800 bg-white/70 backdrop-blur-sm ${
                                                errors.nom_prenom ? 'border-red-500' : 'border-slate-200'
                                            }`}
                                            placeholder="Votre nom complet"
                                        />
                                        {errors.nom_prenom && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-2 text-sm text-red-600 flex items-center"
                                            >
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.nom_prenom}
                                            </motion.p>
                                        )}
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7, duration: 0.5 }}
                                    >
                                        <label className="block text-sm font-bold text-slate-700 mb-3">
                                            <Calendar className="inline w-4 h-4 mr-2" />
                                            Date de Demande *
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.date_demande}
                                            onChange={(e) => handleInputChange('date_demande', undefined, e.target.value)}
                                            className={`w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-slate-800 bg-white/70 backdrop-blur-sm ${
                                                errors.date_demande ? 'border-red-500' : 'border-slate-200'
                                            }`}
                                        />
                                        {errors.date_demande && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-2 text-sm text-red-600 flex items-center"
                                            >
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.date_demande}
                                            </motion.p>
                                        )}
                                    </motion.div>
                                </div>

                                {/* EPI List */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold text-slate-800 flex items-center">
                                            <Package className="w-6 h-6 mr-3 text-purple-600" />
                                            Liste des EPI
                                        </h3>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="button"
                                            onClick={addEpiItem}
                                            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl text-white font-bold transition-all duration-300 shadow-lg"
                                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Ajouter un EPI</span>
                                        </motion.button>
                                    </div>

                                    <div className="space-y-6">
                                        {formData.liste_epi.map((epi, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                                                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-lg font-bold text-slate-700 flex items-center">
                                                        <Shield className="w-5 h-5 mr-2 text-purple-600" />
                                                        EPI #{index + 1}
                                                    </h4>
                                                    {formData.liste_epi.length > 1 && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            type="button"
                                                            onClick={() => removeEpiItem(index)}
                                                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-all duration-300"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </motion.button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    {/* EPI Type */}
                                                    <div>
                                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                            Type d'EPI *
                                                        </label>
                                                        <select
                                                            value={epi}
                                                            onChange={(e) => handleInputChange('liste_epi', index, e.target.value)}
                                                            className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-slate-800 bg-white ${
                                                                errors[`liste_epi.${index}`] ? 'border-red-500' : 'border-slate-200'
                                                            }`}
                                                        >
                                                            <option value="">Sélectionner un EPI</option>
                                                            {availableEpiTypes.map((type) => (
                                                                <option key={type} value={type}>
                                                                    {type}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors[`liste_epi.${index}`] && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="mt-2 text-sm text-red-600 flex items-center"
                                                            >
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors[`liste_epi.${index}`]}
                                                            </motion.p>
                                                        )}
                                                    </div>

                                                    {/* Quantity */}
                                                    <div>
                                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                            Quantité *
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="10"
                                                            value={formData.quantites[index] || 1}
                                                            onChange={(e) => handleInputChange('quantites', index, parseInt(e.target.value))}
                                                            className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-slate-800 bg-white ${
                                                                errors[`quantites.${index}`] ? 'border-red-500' : 'border-slate-200'
                                                            }`}
                                                        />
                                                        {errors[`quantites.${index}`] && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="mt-2 text-sm text-red-600 flex items-center"
                                                            >
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors[`quantites.${index}`]}
                                                            </motion.p>
                                                        )}
                                                    </div>

                                                    {/* Size (if needed) */}
                                                    {needsSize(epi) && (
                                                        <div>
                                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                                Taille
                                                            </label>
                                                            <select
                                                                value={formData.tailles[index] || ''}
                                                                onChange={(e) => handleInputChange('tailles', index, e.target.value)}
                                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-slate-800 bg-white"
                                                            >
                                                                <option value="">Sélectionner une taille</option>
                                                                {availableSizes.map((size) => (
                                                                    <option key={size} value={size}>
                                                                        {size}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}

                                                    {/* Pointure (if needed) */}
                                                    {needsPointure(epi) && (
                                                        <div>
                                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                                Pointure
                                                            </label>
                                                            <select
                                                                value={formData.pointures[index] || ''}
                                                                onChange={(e) => handleInputChange('pointures', index, e.target.value)}
                                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-slate-800 bg-white"
                                                            >
                                                                <option value="">Sélectionner une pointure</option>
                                                                {availablePointures.map((pointure) => (
                                                                    <option key={pointure} value={pointure}>
                                                                        {pointure}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {errors.liste_epi && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 text-sm text-red-600 flex items-center"
                                        >
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.liste_epi}
                                        </motion.p>
                                    )}
                                </motion.div>

                                {/* Submit Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2, duration: 0.6 }}
                                    className="flex justify-center"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        className="inline-flex items-center space-x-3 px-12 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 shadow-xl"
                                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                    >
                                        <CheckCircle className="w-6 h-6" />
                                        <span>Soumettre la Demande</span>
                                        <Sparkles className="w-5 h-5" />
                                    </motion.button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}