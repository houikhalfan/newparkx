import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
  Package, 
  ArrowLeft, 
  Plus, 
  Eye, 
  Edit, 
  Calendar, 
  User, 
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function PPERequestsHistory({ ppeRequests, flash }) {
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

    return (
        <>
            <Head title="Historique des Demandes d'EPI" />

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
                                            Mes Demandes d'EPI
                                        </h1>
                                        <p className="text-sm text-slate-500 font-medium">Historique des demandes d'EPI</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    className="flex space-x-3"
                                >
                                    <Link
                                        href="/dashboard"
                                        className="group relative inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' }}
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span>Retour au Tableau de Bord</span>
                                    </Link>
                                    <Link
                                        href={route('ppe-requests.index')}
                                        className="group relative inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Nouvelle Demande</span>
                                    </Link>
                                </motion.div>
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
                                Mes Demandes d'EPI
                            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Historique de toutes vos demandes d'équipements de protection individuelle
                            </p>
                        </motion.div>

                        {/* Success Message */}
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

                        {/* Requests Table */}
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
                                                Date de Demande
                                            </th>
                                            <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                Nom et Prénom
                                            </th>
                                            <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                EPI Demandés
                                            </th>
                                            <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                État
                                            </th>
                                            <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                Commentaires
                                            </th>
                                            <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                Traité par
                                            </th>
                                            <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {ppeRequests.data.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-8 py-12 text-center">
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.8, duration: 0.6 }}
                                                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 max-w-md mx-auto"
                                                    >
                                                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                                            <Package className="w-8 h-8 text-purple-600" />
                                                        </div>
                                                        <h3 className="text-xl font-bold text-slate-800 mb-2">Aucune demande d'EPI</h3>
                                                        <p className="text-slate-600">Aucune demande d'EPI trouvée.</p>
                                                    </motion.div>
                                                </td>
                                            </tr>
                                        ) : (
                                            ppeRequests.data.map((request, index) => (
                                                <motion.tr
                                                    key={request.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                                                    className="hover:bg-slate-50/80 transition-all duration-300 group"
                                                >
                                                    <td className="px-8 py-6 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            <Calendar className="w-4 h-4 text-slate-400" />
                                                            <span className="text-sm font-semibold text-slate-700">
                                                                {new Date(request.date_demande).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            <User className="w-4 h-4 text-slate-400" />
                                                            <span className="text-sm font-bold text-slate-800">
                                                                {request.nom_prenom}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-sm text-slate-800">
                                                        <div className="max-w-xs">
                                                            <div className="font-bold text-slate-800 mb-1">
                                                                {request.liste_epi.length} EPI demandé(s)
                                                            </div>
                                                            <div className="text-slate-500 text-xs">
                                                                {request.liste_epi.slice(0, 3).join(', ')}
                                                                {request.liste_epi.length > 3 && ` +${request.liste_epi.length - 3} autres`}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 whitespace-nowrap">
                                                        {getEtatBadge(request.etat)}
                                                    </td>
                                                    <td className="px-8 py-6 text-sm text-slate-800 max-w-xs">
                                                        {request.commentaires_admin ? (
                                                            <div className="truncate" title={request.commentaires_admin}>
                                                                {request.commentaires_admin}
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 italic">Aucun commentaire</span>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-6 whitespace-nowrap text-sm text-slate-800">
                                                        {request.admin ? (
                                                            <div>
                                                                <div className="font-bold text-slate-800">{request.admin.full_name || request.admin.email}</div>
                                                                {request.updated_at && (
                                                                    <div className="text-xs text-slate-500">
                                                                        {new Date(request.updated_at).toLocaleDateString()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 italic">Non traité</span>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-6 whitespace-nowrap">
                                                        <div className="flex space-x-2">
                                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                                <Link
                                                                    href={route('ppe-requests.show', request.id)}
                                                                    className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg"
                                                                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                    <span className="text-white">Voir</span>
                                                                </Link>
                                                            </motion.div>
                                                            {request.etat === 'en_cours' && (
                                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                                    <Link
                                                                        href={route('ppe-requests.edit', request.id)}
                                                                        className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg"
                                                                        style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                        <span className="text-white">Modifier</span>
                                                                    </Link>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>

                        {/* Pagination */}
                        {ppeRequests.links && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 0.6 }}
                                className="mt-8"
                            >
                                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                                    <nav className="flex items-center justify-between">
                                        <div className="flex-1 flex justify-between sm:hidden">
                                            {ppeRequests.links.prev ? (
                                                <Link
                                                    href={ppeRequests.links.prev}
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
                                            
                                            {ppeRequests.links.next ? (
                                                <Link
                                                    href={ppeRequests.links.next}
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
                                                    Affichage de <span className="font-bold text-slate-800">{ppeRequests.from}</span> à <span className="font-bold text-slate-800">{ppeRequests.to}</span> sur <span className="font-bold text-slate-800">{ppeRequests.total}</span> résultats
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-2xl shadow-lg -space-x-px">
                                                    {ppeRequests.links.map((link, index) => (
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
                    </div>
                </div>
            </div>
        </>
    );
}