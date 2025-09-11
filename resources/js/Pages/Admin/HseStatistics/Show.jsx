import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function HseStatisticsShow({ statistics, source }) {
    const fileFields = [
        { key: 'accident_report', label: 'Rapport d\'Accident' },
        { key: 'inspection_report', label: 'Rapport d\'Inspection Général' },
        { key: 'inspection_generales_report', label: 'Rapport Inspections Générales' },
        { key: 'inspection_engins_report', label: 'Rapport Inspections Engins' },
        { key: 'hygiene_base_vie_report', label: 'Rapport Hygiène Base de Vie' },
        { key: 'outils_electroportatifs_report', label: 'Rapport Outils Électroportatifs' },
        { key: 'inspection_electriques_report', label: 'Rapport Inspections Électriques' },
        { key: 'extincteurs_report', label: 'Rapport Extincteurs' },
        { key: 'protections_collectives_report', label: 'Rapport Protections Collectives' },
        { key: 'epi_inspections_report', label: 'Rapport EPI Inspections' },
        { key: 'observations_hse_report', label: 'Rapport Observations HSE' },
        { key: 'actions_correctives_cloturees_report', label: 'Rapport Actions Correctives' },
    ];

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
        <AdminLayout>
            <Head title={`Statistiques HSE - ${statistics.contractor?.name || 'N/A'}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            Statistiques HSE - {statistics.contractor?.name || 'N/A'}
                                        </h1>
                                        <p className="text-gray-600 mt-2">
                                            Site: {statistics.site} | 
                                            Contractant: {statistics.contractor?.company_name || statistics.contractor?.name || 'N/A'} |
                                            Date: {new Date(statistics.date).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Link
                                            href={source === 'aggregated' ? route('admin.hse-statistics.aggregated') : route('admin.hse-statistics.index')}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                        >
                                            Retour
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de Base</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Site:</span>
                                            <span className="font-medium">{statistics.site}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date:</span>
                                            <span className="font-medium">{new Date(statistics.date).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Contractant:</span>
                                            <span className="font-medium">{statistics.contractor?.company_name || statistics.contractor?.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Soumis le:</span>
                                            <span className="font-medium">{new Date(statistics.created_at).toLocaleString('fr-FR')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personnel & Heures</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Effectif Personnel:</span>
                                            <span className="font-medium">{statistics.effectif_personnel}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Heures Normales:</span>
                                            <span className="font-medium">{statistics.heures_normales ? Number(statistics.heures_normales).toFixed(2) : '0.00'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Heures Supplémentaires:</span>
                                            <span className="font-medium">{statistics.heures_supplementaires ? Number(statistics.heures_supplementaires).toFixed(2) : '0.00'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Heures:</span>
                                            <span className="font-medium">{statistics.total_heures ? Number(statistics.total_heures).toFixed(2) : '0.00'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Safety Indicators */}
                            <div className="bg-gray-50 p-6 rounded-lg mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicateurs de Sécurité</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className={`text-3xl font-bold ${getSafetyIndicatorColor(statistics.trir, 'trir')}`}>
                                            {statistics.trir ? Number(statistics.trir).toFixed(4) : '0.0000'}
                                        </div>
                                        <div className="text-sm text-gray-600">TRIR</div>
                                        <div className="text-xs text-gray-500">Total Recordable Incident Rate</div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-3xl font-bold ${getSafetyIndicatorColor(statistics.ltir, 'ltir')}`}>
                                            {statistics.ltir ? Number(statistics.ltir).toFixed(4) : '0.0000'}
                                        </div>
                                        <div className="text-sm text-gray-600">LTIR</div>
                                        <div className="text-xs text-gray-500">Lost Time Incident Rate</div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-3xl font-bold ${getSafetyIndicatorColor(statistics.dart, 'dart')}`}>
                                            {statistics.dart ? Number(statistics.dart).toFixed(4) : '0.0000'}
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
                                        <div className="text-2xl font-bold text-red-600">{statistics.acc_mortel || 0}</div>
                                        <div className="text-sm text-gray-600">Accidents Mortels</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">{statistics.acc_arret || 0}</div>
                                        <div className="text-sm text-gray-600">Accidents avec Arrêt</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-yellow-600">{statistics.acc_soins_medicaux || 0}</div>
                                        <div className="text-sm text-gray-600">Soins Médicaux</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{statistics.acc_restriction_temporaire || 0}</div>
                                        <div className="text-sm text-gray-600">Restriction Temporaire</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">{statistics.premier_soin || 0}</div>
                                        <div className="text-sm text-gray-600">Premier Soin</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">{statistics.presque_accident || 0}</div>
                                        <div className="text-sm text-gray-600">Presque Accidents</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-indigo-600">{statistics.dommage_materiel || 0}</div>
                                        <div className="text-sm text-gray-600">Dommages Matériels</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-pink-600">{statistics.incident_environnemental || 0}</div>
                                        <div className="text-sm text-gray-600">Incidents Environnementaux</div>
                                    </div>
                                </div>
                            </div>

                            {/* Training & Awareness */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensibilisation</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Nombre de Sensibilisations:</span>
                                            <span className="font-medium">{statistics.nb_sensibilisations || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Personnes Sensibilisées:</span>
                                            <span className="font-medium">{statistics.personnes_sensibilisees || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Moyenne Sensibilisation:</span>
                                            <span className="font-medium">{statistics.moyenne_sensibilisation_pourcent ? Number(statistics.moyenne_sensibilisation_pourcent).toFixed(2) : '0.00'}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Formations</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Séances:</span>
                                            <span className="font-medium">{statistics.formations_total_seances || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Participants:</span>
                                            <span className="font-medium">{statistics.formations_total_participants || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Heures:</span>
                                            <span className="font-medium">{statistics.formations_total_heures ? Number(statistics.formations_total_heures).toFixed(2) : '0.00'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Permits & PTSR */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Permis</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Permis Général:</span>
                                            <span className="font-medium">{statistics.permis_general || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Permis Spécifiques:</span>
                                            <span className="font-medium">{statistics.permis_specifiques_total || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Permis:</span>
                                            <span className="font-medium">{statistics.permis_total || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">PTSR</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">PTSR Total:</span>
                                            <span className="font-medium">{statistics.ptsr_total || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">PTSR Contrôlés:</span>
                                            <span className="font-medium">{statistics.ptsr_controles || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Pourcentage Contrôlés:</span>
                                            <span className="font-medium">{statistics.ptsr_controles_pourcent ? Number(statistics.ptsr_controles_pourcent).toFixed(2) : '0.00'}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Inspections */}
                            <div className="bg-gray-50 p-6 rounded-lg mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Inspections</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-blue-600">{statistics.inspections_generales || 0}</div>
                                        <div className="text-xs text-gray-600">Générales</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-green-600">{statistics.inspections_engins || 0}</div>
                                        <div className="text-xs text-gray-600">Engins</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-yellow-600">{statistics.hygiene_base_vie || 0}</div>
                                        <div className="text-xs text-gray-600">Hygiène</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-purple-600">{statistics.observations_hse || 0}</div>
                                        <div className="text-xs text-gray-600">Observations</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-red-600">{statistics.actions_correctives_cloturees || 0}</div>
                                        <div className="text-xs text-gray-600">Actions Clôturées</div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Inspections HSE:</span>
                                        <span className="font-medium">{statistics.inspections_total_hse || 0}</span>
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-gray-600">Taux de Fermeture Actions:</span>
                                        <span className="font-medium">{statistics.taux_fermeture_actions_pourcent ? Number(statistics.taux_fermeture_actions_pourcent).toFixed(2) : '0.00'}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* File Downloads */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rapports Téléchargés</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {fileFields.map(({ key, label }) => (
                                        <div key={key} className="flex items-center justify-between p-3 bg-white rounded border">
                                            <span className="text-sm text-gray-700">{label}</span>
                                            {statistics[key] ? (
                                                <a
                                                    href={route('admin.hse-statistics.download', [statistics.id, key])}
                                                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                                >
                                                    Télécharger
                                                </a>
                                            ) : (
                                                <span className="text-xs text-gray-400">Non fourni</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
