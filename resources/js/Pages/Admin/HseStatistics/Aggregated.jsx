import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function HseStatisticsAggregated({ aggregatedData, filters: initialFilters = {} }) {
    const [filters, setFilters] = useState({
        start_date: initialFilters.start_date || '',
        end_date: initialFilters.end_date || '',
        site: initialFilters.site || '',
        entreprise: initialFilters.entreprise || ''
    });

    // Real-time filtering with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(route('admin.hse-statistics.aggregated'), filters, {
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
            start_date: '',
            end_date: '',
            site: '',
            entreprise: ''
        });
    };

    const exportExcel = () => {
        const params = new URLSearchParams(filters);
        window.open(route('admin.hse-statistics.export-excel') + '?' + params.toString(), '_blank');
    };

    const formatNumber = (value) => {
        return value ? Number(value).toFixed(2) : '0.00';
    };

    const formatInteger = (value) => {
        return value ? Number(value).toLocaleString() : '0';
    };

    return (
        <AdminLayout>
            <Head title="Statistiques HSE Agrégées - Administration" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">Statistiques HSE Agrégées</h1>
                                        <p className="text-gray-600 mt-2">
                                            Période: {aggregatedData.period_start && aggregatedData.period_end 
                                                ? `${aggregatedData.period_start} au ${aggregatedData.period_end}`
                                                : 'Toutes les périodes'
                                            }
                                        </p>
                                    </div>
                                    <Link
                                        href={route('admin.hse-statistics.index')}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                    >
                                        Retour à la liste
                                    </Link>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{formatInteger(aggregatedData.total_submissions)}</div>
                                    <div className="text-sm text-gray-600">Total Soumissions</div>
                                </div>
                                <div className="bg-green-50 p-6 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{formatInteger(aggregatedData.effectif_total)}</div>
                                    <div className="text-sm text-gray-600">Effectif Total</div>
                                </div>
                                <div className="bg-yellow-50 p-6 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">{formatInteger(aggregatedData.volume_horaire_total)}</div>
                                    <div className="text-sm text-gray-600">Volume Horaire Total</div>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date de début
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.start_date}
                                            onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date de fin
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.end_date}
                                            onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
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
                                <div className="flex items-end gap-3 mt-4">
                                    <button
                                        onClick={exportExcel}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Exporter Excel
                                    </button>
                                    <button
                                        onClick={clearFilters}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                    >
                                        Effacer
                                    </button>
                                </div>
                            </div>

                            {/* Horizontal Statistics Table */}
                            {aggregatedData.statistics && aggregatedData.statistics.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contractant</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effectif</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume Horaire</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TRIR</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LTIR</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DART</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acc. Mortel</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acc. Arrêt</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acc. Soins</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acc. Restriction</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premier Soin</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presque Accident</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dommage Matériel</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident Env.</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sensibilisations</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personnes Sens.</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inductions</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">H. Formation</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">H. Induction</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">H. Formation Spéc.</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PTSR Total</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PTSR Contrôlés</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permis Général</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permis Excavation</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permis Point Chaud</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permis Espace Confiné</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permis Travail Hauteur</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permis Levage</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permis Consignation</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permis Électrique</th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observations HSE</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {aggregatedData.statistics.map((stat) => (
                                                <tr key={stat.id} className="hover:bg-gray-50">
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {stat.contractor_name}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {stat.entreprise}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {stat.site}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {stat.date}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatInteger(stat.effectif_personnel)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatInteger(stat.total_heures)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatNumber(stat.trir)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatNumber(stat.ltir)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatNumber(stat.dart)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-red-600 font-bold">
                                                        {formatInteger(stat.acc_mortel)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-orange-600">
                                                        {formatInteger(stat.acc_arret)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-orange-600">
                                                        {formatInteger(stat.acc_soins_medicaux)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-orange-600">
                                                        {formatInteger(stat.acc_restriction_temporaire)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-yellow-600">
                                                        {formatInteger(stat.premier_soin)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-yellow-600">
                                                        {formatInteger(stat.presque_accident)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-yellow-600">
                                                        {formatInteger(stat.dommage_materiel)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-yellow-600">
                                                        {formatInteger(stat.incident_environnemental)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-green-600">
                                                        {formatInteger(stat.nb_sensibilisations)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-green-600">
                                                        {formatInteger(stat.personnes_sensibilisees)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-purple-600">
                                                        {formatInteger(stat.inductions_total_personnes)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-purple-600">
                                                        {formatInteger(stat.total_heures_formation)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-purple-600">
                                                        {formatInteger(stat.total_heures_induction)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-purple-600">
                                                        {formatInteger(stat.total_heures_formation_specifique)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-indigo-600">
                                                        {formatInteger(stat.ptsr_total)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-indigo-600">
                                                        {formatInteger(stat.ptsr_controles)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-teal-600">
                                                        {formatInteger(stat.permis_general)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-teal-600">
                                                        {formatInteger(stat.permis_excavation)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-teal-600">
                                                        {formatInteger(stat.permis_point_chaud)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-teal-600">
                                                        {formatInteger(stat.permis_espace_confine)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-teal-600">
                                                        {formatInteger(stat.permis_travail_hauteur)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-teal-600">
                                                        {formatInteger(stat.permis_levage)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-teal-600">
                                                        {formatInteger(stat.permis_consignation)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-teal-600">
                                                        {formatInteger(stat.permis_electrique_tension)}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-pink-600">
                                                        {formatInteger(stat.observations_hse)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 text-lg">Aucune statistique trouvée</div>
                                    <p className="text-gray-400 mt-2">
                                        {filters.start_date || filters.end_date || filters.site || filters.entreprise
                                            ? 'Aucune donnée pour les filtres sélectionnés'
                                            : 'Aucune statistique HSE soumise'
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
