import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ContractantLayout from '@/Pages/ContractantLayout';

export default function HseStatisticsHistory({ records, contractor }) {
    const getSafetyIndicatorColor = (value, type) => {
        if (type === 'trir') {
            return value > 3.0 ? 'text-red-600' : value > 1.0 ? 'text-yellow-600' : 'text-green-600';
        }
        if (type === 'ltir') {
            return value > 1.0 ? 'text-red-600' : value > 0.5 ? 'text-yellow-600' : 'text-green-600';
        }
        if (type === 'dart') {
            return value > 1.0 ? 'text-red-600' : value > 0.5 ? 'text-yellow-600' : 'text-green-600';
        }
        return 'text-gray-600';
    };

    return (
        <ContractantLayout contractor={contractor}>
            <Head title="Historique des Statistiques HSE" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            Historique des Statistiques HSE
                                        </h1>
                                        <p className="text-gray-600 mt-2">
                                            Consultez l'historique de vos soumissions de statistiques HSE
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Link
                                            href={route('contractant.home')}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                            Tableau de bord
                                        </Link>
                                        <Link
                                            href={route('contractant.hse-statistics.index')}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Nouvelle Soumission
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Statistics Summary */}
                            {records.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                    <div className="bg-blue-50 p-6 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{records.length}</div>
                                        <div className="text-sm text-gray-600">Total Soumissions</div>
                                    </div>
                                    <div className="bg-green-50 p-6 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {records.reduce((sum, record) => sum + (Number(record.total_heures) || 0), 0).toFixed(0)}
                                        </div>
                                        <div className="text-sm text-gray-600">Heures Total</div>
                                    </div>
                                    <div className="bg-yellow-50 p-6 rounded-lg">
                                        <div className="text-2xl font-bold text-yellow-600">
                                            {records.reduce((sum, record) => sum + (record.permis_total || 0), 0)}
                                        </div>
                                        <div className="text-sm text-gray-600">Permis Total</div>
                                    </div>
                                    <div className="bg-purple-50 p-6 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {records.reduce((sum, record) => sum + (record.inspections_total_hse || 0), 0)}
                                        </div>
                                        <div className="text-sm text-gray-600">Inspections Total</div>
                                    </div>
                                </div>
                            )}

                            {/* Records Table */}
                            {records.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Site
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
                                                    Permis
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Inspections
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Soumis le
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {records.map((record) => (
                                                <tr key={record.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {record.site}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(record.date).toLocaleDateString('fr-FR')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {record.effectif_personnel || 0}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {record.total_heures ? Number(record.total_heures).toFixed(2) : '0.00'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`font-medium ${getSafetyIndicatorColor(record.trir, 'trir')}`}>
                                                            {record.trir ? Number(record.trir).toFixed(4) : '0.0000'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`font-medium ${getSafetyIndicatorColor(record.ltir, 'ltir')}`}>
                                                            {record.ltir ? Number(record.ltir).toFixed(4) : '0.0000'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`font-medium ${getSafetyIndicatorColor(record.dart, 'dart')}`}>
                                                            {record.dart ? Number(record.dart).toFixed(4) : '0.0000'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {record.permis_total || 0}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {record.inspections_total_hse || 0}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(record.created_at).toLocaleDateString('fr-FR')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('contractant.hse-statistics.show', record.id)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                Voir détails
                                                            </Link>
                                                            <span className="text-gray-300">|</span>
                                                            <Link
                                                                href={route('contractant.hse-statistics.edit', record.id)}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Modifier
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 text-lg">Aucune statistique HSE soumise</div>
                                    <p className="text-gray-400 mt-2">Commencez par soumettre votre première statistique HSE</p>
                                    <Link
                                        href={route('contractant.hse-statistics.index')}
                                        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Soumettre une Statistique
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ContractantLayout>
    );
}
