import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function PPERequestShow({ ppeRequest, flash }) {
    const getEtatBadge = (etat) => {
        const badges = {
            en_cours: 'bg-yellow-100 text-yellow-800',
            en_traitement: 'bg-blue-100 text-blue-800',
            done: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };

        const labels = {
            en_cours: 'En cours',
            en_traitement: 'En traitement',
            done: 'Terminé',
            rejected: 'Rejeté',
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[etat] || 'bg-gray-100 text-gray-800'}`}>
                {labels[etat] || etat}
            </span>
        );
    };

    const formattedEpiList = ppeRequest.formatted_epi_list || [];

    return (
        <>
            <Head title={`Ma Demande d'EPI - ${ppeRequest.nom_prenom}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Success/Error Messages */}
                            {flash?.success && (
                                <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                    ✅ {flash.success}
                                </div>
                            )}
                            {flash?.error && (
                                <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    ❌ {flash.error}
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900">
                                        Ma Demande d'EPI - {ppeRequest.nom_prenom}
                                    </h1>
                                    <p className="text-gray-600">
                                        Demande du {new Date(ppeRequest.date_demande).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('ppe-requests.history')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700"
                                    >
                                        ← Retour à l'historique
                                    </Link>
                                    <Link
                                        href="/dashboard"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                                    >
                                        📋 Tableau de Bord
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Request Details */}
                                <div className="lg:col-span-2">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Détails de la demande</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Nom et Prénom</label>
                                                <p className="mt-1 text-sm text-gray-900">{ppeRequest.nom_prenom}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Date de demande</label>
                                                <p className="mt-1 text-sm text-gray-900">{new Date(ppeRequest.date_demande).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">État actuel</label>
                                                <div className="mt-1">
                                                    {getEtatBadge(ppeRequest.etat)}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Date de création</label>
                                                <p className="mt-1 text-sm text-gray-900">{new Date(ppeRequest.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        {/* EPI List */}
                                        <div>
                                            <h4 className="text-md font-medium text-gray-900 mb-3">Liste des EPI demandés</h4>
                                            <div className="space-y-3">
                                                {formattedEpiList.map((item, index) => (
                                                    <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <h5 className="font-medium text-gray-900">{item.epi}</h5>
                                                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                                                    <span>Quantité: <strong>{item.quantite}</strong></span>
                                                                    {item.taille && (
                                                                        <span>Taille: <strong>{item.taille}</strong></span>
                                                                    )}
                                                                    {item.pointure && (
                                                                        <span>Pointure: <strong>{item.pointure}</strong></span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Processing Info */}
                                <div>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Traitement</h3>
                                        
                                        {ppeRequest.admin ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Traité par</label>
                                                    <p className="mt-1 text-sm text-gray-900">{ppeRequest.admin.full_name || ppeRequest.admin.email}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Dernière mise à jour</label>
                                                    <p className="mt-1 text-sm text-gray-900">{new Date(ppeRequest.updated_at).toLocaleDateString()}</p>
                                                </div>
                                                {ppeRequest.commentaires_admin && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Commentaires</label>
                                                        <p className="mt-1 text-sm text-gray-900 bg-white p-3 rounded border">
                                                            {ppeRequest.commentaires_admin}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center text-gray-500">
                                                <p>Votre demande n'a pas encore été traitée par un administrateur.</p>
                                            </div>
                                        )}

                                        {/* Edit Button */}
                                        {ppeRequest.etat === 'en_cours' && (
                                            <div className="mt-6 pt-6 border-t border-gray-200">
                                                <Link
                                                    href={route('ppe-requests.edit', ppeRequest.id)}
                                                    className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    ✏️ Modifier cette demande
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
