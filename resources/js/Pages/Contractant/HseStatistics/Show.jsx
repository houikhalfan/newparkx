import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ContractantLayout from '@/Pages/ContractantLayout';

export default function HseStatisticsShow({ statistic }) {
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
        <ContractantLayout>
            <Head title={`Statistiques HSE #${statistic.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            Statistiques HSE #{statistic.id}
                                        </h1>
                                        <p className="text-gray-600 mt-2">
                                            Site: {statistic.site} | Date: {new Date(statistic.date).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                    <Link
                                        href={route('contractant.hse-statistics.history')}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                    >
                                        Retour à l'historique
                                    </Link>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de Base</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Site:</span>
                                            <span className="font-medium">{statistic.site}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date:</span>
                                            <span className="font-medium">{new Date(statistic.date).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Soumis le:</span>
                                            <span className="font-medium">{new Date(statistic.created_at).toLocaleString('fr-FR')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personnel & Heures</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Effectif Personnel:</span>
                                            <span className="font-medium">{statistic.effectif_personnel}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Heures Normales:</span>
                                            <span className="font-medium">{statistic.heures_normales ? Number(statistic.heures_normales).toFixed(2) : '0.00'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Heures Supplémentaires:</span>
                                            <span className="font-medium">{statistic.heures_supplementaires ? Number(statistic.heures_supplementaires).toFixed(2) : '0.00'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Heures:</span>
                                            <span className="font-medium">{statistic.total_heures ? Number(statistic.total_heures).toFixed(2) : '0.00'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Safety Indicators */}
                            <div className="bg-gray-50 p-6 rounded-lg mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicateurs de Sécurité</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className={`text-3xl font-bold ${getSafetyIndicatorColor(statistic.trir, 'trir')}`}>
                                            {statistic.trir ? Number(statistic.trir).toFixed(4) : '0.0000'}
                                        </div>
                                        <div className="text-sm text-gray-600">TRIR</div>
                                        <div className="text-xs text-gray-500">Total Recordable Incident Rate</div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-3xl font-bold ${getSafetyIndicatorColor(statistic.ltir, 'ltir')}`}>
                                            {statistic.ltir ? Number(statistic.ltir).toFixed(4) : '0.0000'}
                                        </div>
                                        <div className="text-sm text-gray-600">LTIR</div>
                                        <div className="text-xs text-gray-500">Lost Time Incident Rate</div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-3xl font-bold ${getSafetyIndicatorColor(statistic.dart, 'dart')}`}>
                                            {statistic.dart ? Number(statistic.dart).toFixed(4) : '0.0000'}
                                        </div>
                                        <div className="text-sm text-gray-600">DART</div>
                                        <div className="text-xs text-gray-500">Days Away, Restricted, or Transferred</div>
                                    </div>
                                </div>
                            </div>

                            {/* Accidents & Incidents */}
                            <div className="bg-gray-50 p-6 rounded-lg mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Accidents & Incidents</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-600">{statistic.acc_mortel || 0}</div>
                                        <div className="text-sm text-gray-600">Accidents Mortels</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">{statistic.acc_arret || 0}</div>
                                        <div className="text-sm text-gray-600">Accidents avec Arrêt</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-yellow-600">{statistic.acc_soins_medicaux || 0}</div>
                                        <div className="text-sm text-gray-600">Soins Médicaux</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{statistic.acc_restriction_temporaire || 0}</div>
                                        <div className="text-sm text-gray-600">Restriction Temporaire</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">{statistic.premier_soin || 0}</div>
                                        <div className="text-sm text-gray-600">Premier Soin</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">{statistic.presque_accident || 0}</div>
                                        <div className="text-sm text-gray-600">Presque Accidents</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-indigo-600">{statistic.dommage_materiel || 0}</div>
                                        <div className="text-sm text-gray-600">Dommages Matériels</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-pink-600">{statistic.incident_environnemental || 0}</div>
                                        <div className="text-sm text-gray-600">Incidents Environnementaux</div>
                                    </div>
                                </div>
                            </div>

                            {/* Training & Permits Summary */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Formations</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Séances:</span>
                                            <span className="font-medium">{statistic.formations_total_seances || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Participants:</span>
                                            <span className="font-medium">{statistic.formations_total_participants || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Heures:</span>
                                            <span className="font-medium">{statistic.formations_total_heures ? Number(statistic.formations_total_heures).toFixed(2) : '0.00'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Permis & Inspections</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Permis:</span>
                                            <span className="font-medium">{statistic.permis_total || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Inspections:</span>
                                            <span className="font-medium">{statistic.inspections_total_hse || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">PTSR Contrôlés:</span>
                                            <span className="font-medium">{statistic.ptsr_controles || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ContractantLayout>
    );
}
