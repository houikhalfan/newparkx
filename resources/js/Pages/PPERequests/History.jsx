import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function PPERequestsHistory({ ppeRequests, flash }) {
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

    return (
        <>
            <Head title="Historique des Demandes d'EPI" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Success Message */}
                            {flash?.success && (
                                <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                    ✅ {flash.success}
                                </div>
                            )}
                            
                            {/* Header */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Mes Demandes d'EPI</h1>
                                        <p className="text-gray-600">Historique de toutes vos demandes d'équipements de protection individuelle</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <Link
                                            href="/dashboard"
                                            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700"
                                        >
                                            ← Retour au Tableau de Bord
                                        </Link>
                                        <Link
                                            href={route('ppe-requests.index')}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                                        >
                                            Nouvelle Demande
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Requests Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date de Demande
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nom et Prénom
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                EPI Demandés
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                État
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Commentaires
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Traité par
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {ppeRequests.data.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                    Aucune demande d'EPI trouvée.
                                                </td>
                                            </tr>
                                        ) : (
                                            ppeRequests.data.map((request) => (
                                                <tr key={request.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(request.date_demande).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {request.nom_prenom}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        <div className="max-w-xs">
                                                            <div className="font-medium">
                                                                {request.liste_epi.length} EPI demandé(s)
                                                            </div>
                                                            <div className="text-gray-500 text-xs mt-1">
                                                                {request.liste_epi.slice(0, 3).join(', ')}
                                                                {request.liste_epi.length > 3 && ` +${request.liste_epi.length - 3} autres`}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getEtatBadge(request.etat)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                                        {request.commentaires_admin ? (
                                                            <div className="truncate" title={request.commentaires_admin}>
                                                                {request.commentaires_admin}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">Aucun commentaire</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {request.admin ? (
                                                            <div>
                                                                <div className="font-medium">{request.admin.full_name || request.admin.email}</div>
                                                                {request.updated_at && (
                                                                    <div className="text-xs text-gray-500">
                                                                        {new Date(request.updated_at).toLocaleDateString()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">Non traité</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link
                                                            href={route('ppe-requests.show', request.id)}
                                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                                        >
                                                            Voir
                                                        </Link>
                                                        {request.etat === 'en_cours' && (
                                                            <Link
                                                                href={route('ppe-requests.edit', request.id)}
                                                                className="text-yellow-600 hover:text-yellow-900"
                                                            >
                                                                Modifier
                                                            </Link>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {ppeRequests.links && (
                                <div className="mt-6">
                                    <nav className="flex items-center justify-between">
                                        <div className="flex-1 flex justify-between sm:hidden">
                                            {ppeRequests.links.prev ? (
                                                <Link
                                                    href={ppeRequests.links.prev}
                                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    Précédent
                                                </Link>
                                            ) : (
                                                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-300 bg-white cursor-not-allowed">
                                                    Précédent
                                                </span>
                                            )}
                                            
                                            {ppeRequests.links.next ? (
                                                <Link
                                                    href={ppeRequests.links.next}
                                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    Suivant
                                                </Link>
                                            ) : (
                                                <span className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-300 bg-white cursor-not-allowed">
                                                    Suivant
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    Affichage de <span className="font-medium">{ppeRequests.from}</span> à <span className="font-medium">{ppeRequests.to}</span> sur <span className="font-medium">{ppeRequests.total}</span> résultats
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                    {ppeRequests.links.map((link, index) => (
                                                        link.url ? (
                                                            <Link
                                                                key={index}
                                                                href={link.url}
                                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                    link.active
                                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                }`}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        ) : (
                                                            <span
                                                                key={index}
                                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-300 cursor-not-allowed"
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        )
                                                    ))}
                                                </nav>
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
