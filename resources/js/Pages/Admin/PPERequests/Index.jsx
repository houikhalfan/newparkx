import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminPPERequestsIndex({ ppeRequests, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [etatFilter, setEtatFilter] = useState(filters.etat || '');
    const [dateFilter, setDateFilter] = useState(filters.date || '');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        router.get(route('admin.ppe-requests.index'), {
            search: e.target.value,
            etat: etatFilter,
            date: dateFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterChange = (filter, value) => {
        if (filter === 'etat') {
            setEtatFilter(value);
        } else if (filter === 'date') {
            setDateFilter(value);
        }
        
        router.get(route('admin.ppe-requests.index'), {
            search: search,
            etat: filter === 'etat' ? value : etatFilter,
            date: filter === 'date' ? value : dateFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setEtatFilter('');
        setDateFilter('');
        router.get(route('admin.ppe-requests.index'));
    };

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
        <AdminLayout>
            <Head title="Gestion des Demandes d'EPI" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1 className="text-2xl font-semibold mb-4">Gestion des Demandes d'EPI</h1>

                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rechercher
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nom, email..."
                                        value={search}
                                        onChange={handleSearch}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        État
                                    </label>
                                    <select
                                        value={etatFilter}
                                        onChange={(e) => handleFilterChange('etat', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                                    >
                                        <option value="">Tous les états</option>
                                        <option value="en_cours">En cours</option>
                                        <option value="en_traitement">En traitement</option>
                                        <option value="done">Terminé</option>
                                        <option value="rejected">Rejeté</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={dateFilter}
                                        onChange={(e) => handleFilterChange('date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                                    />
                                </div>

                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                    >
                                        Effacer les filtres
                                    </button>
                                </div>
                            </div>

                            {/* PPE Requests Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date de Demande
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Demandeur
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
                                                        <div>
                                                            <div className="font-medium">{request.user.name}</div>
                                                            <div className="text-gray-500">{request.user.email}</div>
                                                        </div>
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
                                                                {request.liste_epi.slice(0, 2).join(', ')}
                                                                {request.liste_epi.length > 2 && ` +${request.liste_epi.length - 2} autres`}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getEtatBadge(request.etat)}
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
                                                            href={route('admin.ppe-requests.show', request.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Voir & Traiter
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <nav className="mt-4 flex justify-center">
                                <ul className="flex items-center -space-x-px h-10 text-base">
                                    {ppeRequests.links.map((link, index) => (
                                        <li key={index}>
                                            {link.url ? (
                                                <Link
                                                    href={link.url}
                                                    className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 ${
                                                        link.active
                                                            ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
                                                            : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
                                                    } ${index === 0 ? 'rounded-l-lg' : ''} ${index === ppeRequests.links.length - 1 ? 'rounded-r-lg' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                    className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 text-gray-400 bg-white cursor-not-allowed ${
                                                        index === 0 ? 'rounded-l-lg' : ''
                                                    } ${index === ppeRequests.links.length - 1 ? 'rounded-r-lg' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
