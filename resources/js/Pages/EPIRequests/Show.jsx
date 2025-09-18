import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
  Package, 
  ArrowLeft, 
  Calendar, 
  User, 
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Sparkles,
  Edit,
  MessageSquare,
  Database,
  FileText,
  BarChart3,
  LogOut,
  UserCircle
} from 'lucide-react';

export default function EPIRequestShow({ epiRequest, flash }) {
    const { auth } = usePage().props || {};
    const { user } = auth || {};
    const getEtatBadge = (etat) => {
        const badges = {
            en_cours: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
            en_traitement: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
            done: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
            rejected: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
        };

        const labels = {
            en_cours: 'En cours',
            en_traitement: 'En traitement',
            done: 'Terminé',
            rejected: 'Rejeté',
        };

        const icons = {
            en_cours: <Clock className="w-3 h-3 mr-1" />,
            en_traitement: <AlertCircle className="w-3 h-3 mr-1" />,
            done: <CheckCircle className="w-3 h-3 mr-1" />,
            rejected: <XCircle className="w-3 h-3 mr-1" />,
        };

        return (
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${badges[etat] || 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'}`}>
                {icons[etat]}
                {labels[etat] || etat}
            </span>
        );
    };

    const formattedEpiList = epiRequest.formatted_epi_list || [];

    return (
        <>
            <Head title={`Ma Demande d'EPI - ${epiRequest.nom_prenom}`} />

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
                                            Détails de la Demande
                                        </h1>
                                        <p className="text-sm text-slate-500 font-medium">Équipements de protection individuelle</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={route('epi-requests.history')}
                                        className="group relative inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                                        style={{ background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' }}
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span>Retour à l'historique</span>
                                    </Link>
                                    <Link
                                        href="/dashboard"
                                        className="group relative inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        <span>Tableau de Bord</span>
                                    </Link>
                                  
                                    {/* User Info */}
                                    <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-lg border border-gray-100">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                                            <UserCircle className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-slate-800">
                                            <p className="text-sm font-semibold">{user?.name || 'Utilisateur'}</p>
                                            <p className="text-xs text-slate-500">ParkX</p>
                                        </div>
                                    </div>
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
                            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Ma Demande d'EPI - {epiRequest.nom_prenom}
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Demande du {new Date(epiRequest.date_demande).toLocaleDateString()}
                            </p>
                        </motion.div>

                        {/* Success/Error Messages */}
                        {flash?.success && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="mb-8 bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl shadow-lg"
                            >
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 mr-3" />
                                    <span className="font-semibold">{flash.success}</span>
                                </div>
                            </motion.div>
                        )}
                        {flash?.error && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="mb-8 bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-200 text-red-800 px-6 py-4 rounded-2xl shadow-lg"
                            >
                                <div className="flex items-center">
                                    <XCircle className="w-5 h-5 mr-3" />
                                    <span className="font-semibold">{flash.error}</span>
                                </div>
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Request Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                                className="lg:col-span-2 space-y-6"
                            >
                                {/* Request Info Card */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                                        <Database className="w-6 h-6 mr-3 text-purple-600" />
                                        Détails de la demande
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                                                <User className="w-4 h-4 mr-2" />
                                                Nom et Prénom
                                            </label>
                                            <p className="text-lg font-bold text-slate-800">{epiRequest.nom_prenom}</p>
                                        </div>
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                Date de demande
                                            </label>
                                            <p className="text-lg font-bold text-slate-800">{new Date(epiRequest.date_demande).toLocaleDateString()}</p>
                                        </div>
                                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                                                <Shield className="w-4 h-4 mr-2" />
                                                État actuel
                                            </label>
                                            <div className="mt-1">
                                                {getEtatBadge(epiRequest.etat)}
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                                                <Clock className="w-4 h-4 mr-2" />
                                                Date de création
                                            </label>
                                            <p className="text-lg font-bold text-slate-800">{new Date(epiRequest.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* EPI List */}
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                                            <Package className="w-5 h-5 mr-3 text-purple-600" />
                                            Liste des EPI demandés
                                        </h4>
                                        <div className="space-y-4">
                                            {formattedEpiList.map((item, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                                                    className="bg-gradient-to-r from-white to-slate-50 rounded-2xl p-6 border-2 border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <h5 className="text-lg font-bold text-slate-800 mb-3">{item.epi}</h5>
                                                            <div className="flex items-center space-x-6 text-sm">
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                                    <span className="font-semibold text-slate-600">Quantité:</span>
                                                                    <span className="font-bold text-slate-800">{item.quantite}</span>
                                                                </div>
                                                                {item.taille && (
                                                                    <div className="flex items-center space-x-2">
                                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                        <span className="font-semibold text-slate-600">Taille:</span>
                                                                        <span className="font-bold text-slate-800">{item.taille}</span>
                                                                    </div>
                                                                )}
                                                                {item.pointure && (
                                                                    <div className="flex items-center space-x-2">
                                                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                                        <span className="font-semibold text-slate-600">Pointure:</span>
                                                                        <span className="font-bold text-slate-800">{item.pointure}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Admin Processing Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                className="space-y-6"
                            >
                                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                                        <MessageSquare className="w-6 h-6 mr-3 text-blue-600" />
                                        Traitement
                                    </h3>
                                    
                                    {epiRequest.admin ? (
                                        <div className="space-y-6">
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
                                                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                                                    <User className="w-4 h-4 mr-2" />
                                                    Traité par
                                                </label>
                                                <p className="text-lg font-bold text-slate-800">{epiRequest.admin.full_name || epiRequest.admin.email}</p>
                                            </div>
                                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4">
                                                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                                                    <Clock className="w-4 h-4 mr-2" />
                                                    Dernière mise à jour
                                                </label>
                                                <p className="text-lg font-bold text-slate-800">{new Date(epiRequest.updated_at).toLocaleDateString()}</p>
                                            </div>
                                            {epiRequest.commentaires_admin && (
                                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4">
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                                                        <FileText className="w-4 h-4 mr-2" />
                                                        Commentaires
                                                    </label>
                                                    <div className="mt-2 p-4 bg-white rounded-xl border-2 border-purple-100">
                                                        <p className="text-slate-800 font-medium">{epiRequest.commentaires_admin}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                                <Clock className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-slate-600 font-medium">Votre demande n'a pas encore été traitée par un administrateur.</p>
                                        </div>
                                    )}

                                    {/* Edit Button */}
                                    {epiRequest.etat === 'en_cours' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1, duration: 0.6 }}
                                            className="mt-8 pt-6 border-t border-slate-200"
                                        >
                                            <Link
                                                href={route('epi-requests.edit', epiRequest.id)}
                                                className="w-full inline-flex justify-center items-center space-x-2 px-6 py-4 rounded-2xl text-white font-bold transition-all duration-300 shadow-lg hover:scale-105"
                                                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                            >
                                                <Edit className="w-5 h-5" />
                                                <span>Modifier cette demande</span>
                                                <Sparkles className="w-4 h-4" />
                                            </Link>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}