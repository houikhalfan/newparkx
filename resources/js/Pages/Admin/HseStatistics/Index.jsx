import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function HseStatisticsIndex({ statistics, filters: initialFilters = {} }) {
    const [filters, setFilters] = useState({
        site: initialFilters.site || '',
        date: initialFilters.date || '',
        entreprise: initialFilters.entreprise || ''
    });

    // Real-time filtering with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(route('admin.hse-statistics.index'), filters, {
                preserveState: true,
                replace: true
            });
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [filters]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            site: '',
            date: '',
            entreprise: ''
        });
    };


    return (
        <AdminLayout>
            <Head title="Statistiques HSE - Administration" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-8">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">Statistiques HSE</h1>
                                        <p className="text-gray-600 mt-2">Gestion des statistiques de santé, sécurité et environnement</p>
                                    </div>
                                    <div className="flex gap-3">
                                    <Link
                                        href={route('admin.hse-statistics.aggregated')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Statistiques Agrégées
                                    </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Site
                                        </label>
                                        <input
                                            type="text"
                                            value={filters.site}
                                            onChange={(e) => handleFilterChange('site', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Rechercher par site..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.date}
                                            onChange={(e) => handleFilterChange('date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Entreprise
                                        </label>
                                        <input
                                            type="text"
                                            value={filters.entreprise}
                                            onChange={(e) => handleFilterChange('entreprise', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Rechercher par entreprise..."
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={clearFilters}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                    >
                                        Effacer les filtres
                                    </button>
                                </div>
                            </div>

                            {/* Statistics Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contractant
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Site
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Entreprise
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Personnel
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Heures Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                TRIR
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                LTIR
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                DART
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Permis Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Inspections
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Soumis le
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Modifié le
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {statistics.data.map((stat) => (
                                            <tr key={stat.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {stat.contractor?.name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {stat.site}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {stat.contractor?.company_name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(stat.date).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {stat.effectif_personnel}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {stat.total_heures ? Number(stat.total_heures).toFixed(2) : '0.00'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        Number(stat.trir) > 3.0 ? 'bg-red-100 text-red-800' :
                                                        Number(stat.trir) > 1.0 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                        {stat.trir ? Number(stat.trir).toFixed(4) : '0.0000'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        Number(stat.ltir) > 1.0 ? 'bg-red-100 text-red-800' :
                                                        Number(stat.ltir) > 0.5 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                        {stat.ltir ? Number(stat.ltir).toFixed(4) : '0.0000'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        Number(stat.dart) > 1.0 ? 'bg-red-100 text-red-800' :
                                                        Number(stat.dart) > 0.5 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                        {stat.dart ? Number(stat.dart).toFixed(4) : '0.0000'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {stat.permis_total || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {stat.inspections_total_hse || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(stat.created_at).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {stat.updated_at && stat.updated_at !== stat.created_at ? (
                                                        <span className="text-blue-600 font-medium">
                                                            {new Date(stat.updated_at).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={route('admin.hse-statistics.show', stat.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Voir détails
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {statistics.links && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Affichage de {statistics.from} à {statistics.to} sur {statistics.total} résultats
                                    </div>
                                    <div className="flex space-x-2">
                                        {statistics.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 text-sm rounded-md ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {statistics.data.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 text-lg">Aucune statistique HSE trouvée</div>
                                    <p className="text-gray-400 mt-2">Les contractants n'ont pas encore soumis de statistiques</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
