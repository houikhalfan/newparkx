import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Shield, 
    User, 
    Calendar, 
    Package, 
    Plus, 
    Trash2, 
    ArrowLeft, 
    Save,
    Edit3,
    AlertCircle,
    X,
    LogOut,
    UserCircle
} from 'lucide-react';

export default function EPIRequestEdit({ epiRequest, availableEpiTypes, availableSizes, availablePointures }) {
    const [formData, setFormData] = useState({
        nom_prenom: epiRequest.nom_prenom || '',
        date_demande: epiRequest.date_demande || new Date().toISOString().split('T')[0],
        liste_epi: epiRequest.liste_epi || [''],
        quantites: epiRequest.quantites || [1],
        tailles: epiRequest.tailles || [''],
        pointures: epiRequest.pointures || [''],
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

    const addEpi = () => {
        setFormData({
            ...formData,
            liste_epi: [...formData.liste_epi, ''],
            quantites: [...formData.quantites, 1],
            tailles: [...formData.tailles, ''],
            pointures: [...formData.pointures, ''],
        });
    };

    const removeEpi = (index) => {
        if (formData.liste_epi.length > 1) {
            const newData = { ...formData };
            newData.liste_epi.splice(index, 1);
            newData.quantites.splice(index, 1);
            newData.tailles.splice(index, 1);
            newData.pointures.splice(index, 1);
            setFormData(newData);
        }
    };

    const needsSize = (epi) => {
        const sizeEpi = ['Polo', 'T-shirt', 'Gilet HV', 'Parka', 'Pantalon'];
        return sizeEpi.includes(epi);
    };

    const needsPointure = (epi) => {
        const pointureEpi = ['Chaussures de sécurité', 'Botte de sécurité'];
        return pointureEpi.includes(epi);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        router.put(route('epi-requests.update', epiRequest.id), formData, {
            onError: (errors) => setErrors(errors),
            onSuccess: () => {
                // Success will be handled by the controller redirect
            },
        });
    };


    return (
        <>
            <Head title="Modifier ma Demande d'EPI" />

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
                                            <Edit3 className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse" />
                                    </motion.div>
                                    <div>
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                            Modifier ma Demande d'EPI
                                        </h1>
                                        <p className="text-sm text-slate-500 font-medium">Équipements de protection individuelle</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    className="flex items-center space-x-4"
                                >
                                    {/* Back Button */}
                                    <Link
                                        href={route('epi-requests.show', epiRequest.id)}
                                        className="group relative inline-flex items-center space-x-3 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' }}
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        <span>Retour à l'historique</span>
                                    </Link>

                                    {/* Dashboard Button */}
                                    <Link
                                        href="/dashboard"
                                        className="group relative inline-flex items-center space-x-3 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                    >
                                        <Shield className="w-5 h-5" />
                                        <span>Tableau de Bord</span>
                                    </Link>

                                    {/* Logout Button */}
                                    <Link
                                        href="/logout"
                                        method="post"
                                        className="group relative inline-flex items-center space-x-3 px-5 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg bg-red-500 hover:bg-red-600"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Déconnexion</span>
                                    </Link>

                                    {/* User Info */}
                                    <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-gray-100">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                                            <UserCircle className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-slate-800">
                                            <p className="text-sm font-semibold">{formData.nom_prenom || 'Utilisateur'}</p>
                                            <p className="text-xs text-slate-500">ParkX</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.header>

                {/* Main Content */}
                <div className="relative z-10 py-8 px-6">
                    <div className="max-w-7xl mx-auto">

                        {/* Main Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden"
                        >
                            <div className="p-10">
                                {/* Info Alert */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="mb-10 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                                <AlertCircle className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-blue-900 font-bold text-lg mb-2">Information importante</h3>
                                            <p className="text-blue-800 leading-relaxed">
                                                Vous pouvez uniquement modifier les demandes qui sont encore "En cours". 
                                                Une fois qu'un administrateur commence à traiter votre demande, vous ne pourrez plus la modifier.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                <form onSubmit={handleSubmit} className="space-y-10">
                                    {/* Basic Information */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <div className="flex items-center space-x-3 mb-8">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                                <User className="h-5 w-5 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800">Informations de base</h3>
                                        </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Nom et Prénom *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.nom_prenom}
                                                onChange={(e) => handleInputChange('nom_prenom', undefined, e.target.value)}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 ${
                                                    errors.nom_prenom ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'
                                                }`}
                                                placeholder="Votre nom complet"
                                            />
                                            {errors.nom_prenom && (
                                                <p className="mt-1 text-sm text-red-600 font-medium">{errors.nom_prenom}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Date de Demande *
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.date_demande}
                                                onChange={(e) => handleInputChange('date_demande', undefined, e.target.value)}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 ${
                                                    errors.date_demande ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'
                                                }`}
                                            />
                                            {errors.date_demande && (
                                                <p className="mt-1 text-sm text-red-600 font-medium">{errors.date_demande}</p>
                                            )}
                                        </div>
                                    </div>
                                    </motion.div>

                                    {/* EPI List */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                                    <Package className="h-5 w-5 text-white" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-800">Équipements de Protection Individuelle</h3>
                                            </div>
                                            <motion.button
                                                type="button"
                                                onClick={addEpi}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-xl hover:shadow-lg transition-all duration-200"
                                            >
                                                <Plus className="w-6 h-6" />
                                                <span>Ajouter un EPI</span>
                                            </motion.button>
                                        </div>

                                        <div className="space-y-8">
                                            {formData.liste_epi.map((epi, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.9 + index * 0.1 }}
                                                    className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:shadow-lg transition-all duration-200"
                                                >
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                                                            <span className="text-white font-bold text-lg">{index + 1}</span>
                                                        </div>
                                                        <h4 className="text-xl font-bold text-gray-900">EPI #{index + 1}</h4>
                                                    </div>
                                                    {formData.liste_epi.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeEpi(index)}
                                                            className="inline-flex items-center px-5 py-3 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition-colors"
                                                        >
                                                            <Trash2 className="h-5 w-5 mr-2" />
                                                            Supprimer
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                            Type d'EPI *
                                                        </label>
                                                        <select
                                                            value={epi}
                                                            onChange={(e) => handleInputChange('liste_epi', index, e.target.value)}
                                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 ${
                                                                errors[`liste_epi.${index}`] ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'
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
                                                            <p className="mt-1 text-sm text-red-600 font-medium">{errors[`liste_epi.${index}`]}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                            Quantité *
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="10"
                                                            value={formData.quantites[index] || 1}
                                                            onChange={(e) => handleInputChange('quantites', index, parseInt(e.target.value))}
                                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 ${
                                                                errors[`quantites.${index}`] ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'
                                                            }`}
                                                        />
                                                        {errors[`quantites.${index}`] && (
                                                            <p className="mt-1 text-sm text-red-600 font-medium">{errors[`quantites.${index}`]}</p>
                                                        )}
                                                    </div>

                                                    {needsSize(epi) && (
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                                Taille
                                                            </label>
                                                            <select
                                                                value={formData.tailles[index] || ''}
                                                                onChange={(e) => handleInputChange('tailles', index, e.target.value)}
                                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900"
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

                                                    {needsPointure(epi) && (
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                                Pointure
                                                            </label>
                                                            <select
                                                                value={formData.pointures[index] || ''}
                                                                onChange={(e) => handleInputChange('pointures', index, e.target.value)}
                                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900"
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
                                    </motion.div>

                                        {/* Submit Buttons */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.0 }}
                                            className="flex justify-end space-x-6 pt-6 border-t border-white/20"
                                        >
                                            <Link
                                                href={route('epi-requests.show', epiRequest.id)}
                                                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all duration-200 text-lg"
                                            >
                                                <X className="h-6 w-6 mr-3" />
                                                Annuler
                                            </Link>
                                            <motion.button
                                                type="submit"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="inline-flex items-center px-8 py-4 rounded-xl text-white font-bold transition-all duration-300 shadow-lg text-lg"
                                                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                            >
                                                <Save className="h-6 w-6 mr-3" />
                                                Mettre à jour la Demande →
                                            </motion.button>
                                        </motion.div>
                            </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
