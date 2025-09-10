import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import ContractantLayout from '@/Pages/ContractantLayout';

export default function HseStatisticsEdit({ sites, hseStat }) {
    const { data, setData, put, processing, errors } = useForm({
        // 1) Période & Heures
        site: hseStat.site || '',
        date: hseStat.date ? (typeof hseStat.date === 'string' ? hseStat.date.split('T')[0] : hseStat.date) : new Date().toISOString().split('T')[0],
        effectif_personnel: hseStat.effectif_personnel || 0,
        heures_normales: hseStat.heures_normales || 0,
        heures_supplementaires: hseStat.heures_supplementaires || 0,
        effectif_passant_horaire_normal: hseStat.effectif_passant_horaire_normal || 0,
        
        // 3) Accidents / Incidents
        acc_mortel: hseStat.acc_mortel || 0,
        acc_arret: hseStat.acc_arret || 0,
        acc_soins_medicaux: hseStat.acc_soins_medicaux || 0,
        acc_restriction_temporaire: hseStat.acc_restriction_temporaire || 0,
        premier_soin: hseStat.premier_soin || 0,
        presque_accident: hseStat.presque_accident || 0,
        dommage_materiel: hseStat.dommage_materiel || 0,
        incident_environnemental: hseStat.incident_environnemental || 0,
        accident_report: null,
        
        // 4) Personnel & Sensibilisation
        nb_sensibilisations: hseStat.nb_sensibilisations || 0,
        personnes_sensibilisees: hseStat.personnes_sensibilisees || 0,
        
        // 5) Formations & Inductions (totaux)
        inductions_total_personnes: hseStat.inductions_total_personnes || 0,
        formes_total_personnes: hseStat.formes_total_personnes || 0,
        inductions_volume_heures: hseStat.inductions_volume_heures || 0,
        
        // 6) Formations par thème
        excavation_sessions: hseStat.excavation_sessions || 0,
        excavation_participants: hseStat.excavation_participants || 0,
        excavation_duree_h: hseStat.excavation_duree_h || 0,
        points_chauds_sessions: hseStat.points_chauds_sessions || 0,
        points_chauds_participants: hseStat.points_chauds_participants || 0,
        points_chauds_duree_h: hseStat.points_chauds_duree_h || 0,
        espace_confine_sessions: hseStat.espace_confine_sessions || 0,
        espace_confine_participants: hseStat.espace_confine_participants || 0,
        espace_confine_duree_h: hseStat.espace_confine_duree_h || 0,
        levage_sessions: hseStat.levage_sessions || 0,
        levage_participants: hseStat.levage_participants || 0,
        levage_duree_h: hseStat.levage_duree_h || 0,
        travail_hauteur_sessions: hseStat.travail_hauteur_sessions || 0,
        travail_hauteur_participants: hseStat.travail_hauteur_participants || 0,
        travail_hauteur_duree_h: hseStat.travail_hauteur_duree_h || 0,
        sst_sessions: hseStat.sst_sessions || 0,
        sst_participants: hseStat.sst_participants || 0,
        sst_duree_h: hseStat.sst_duree_h || 0,
        epi_sessions: hseStat.epi_sessions || 0,
        epi_participants: hseStat.epi_participants || 0,
        epi_duree_h: hseStat.epi_duree_h || 0,
        modes_operatoires_sessions: hseStat.modes_operatoires_sessions || 0,
        modes_operatoires_participants: hseStat.modes_operatoires_participants || 0,
        modes_operatoires_duree_h: hseStat.modes_operatoires_duree_h || 0,
        permis_spa_sessions: hseStat.permis_spa_sessions || 0,
        permis_spa_participants: hseStat.permis_spa_participants || 0,
        permis_spa_duree_h: hseStat.permis_spa_duree_h || 0,
        outils_electroportatifs_sessions: hseStat.outils_electroportatifs_sessions || 0,
        outils_electroportatifs_participants: hseStat.outils_electroportatifs_participants || 0,
        outils_electroportatifs_duree_h: hseStat.outils_electroportatifs_duree_h || 0,
        
        // 7) Permis & PTSR
        permis_general: hseStat.permis_general || 0,
        permis_excavation: hseStat.permis_excavation || 0,
        permis_point_chaud: hseStat.permis_point_chaud || 0,
        permis_espace_confine: hseStat.permis_espace_confine || 0,
        permis_travail_hauteur: hseStat.permis_travail_hauteur || 0,
        permis_levage: hseStat.permis_levage || 0,
        permis_consignation: hseStat.permis_consignation || 0,
        permis_electrique_tension: hseStat.permis_electrique_tension || 0,
        ptsr_total: hseStat.ptsr_total || 0,
        ptsr_controles: hseStat.ptsr_controles || 0,
        
        // 8) Engins & Matériels
        grue: hseStat.grue || 0,
        niveleuse: hseStat.niveleuse || 0,
        pelle_hydraulique: hseStat.pelle_hydraulique || 0,
        tractopelle: hseStat.tractopelle || 0,
        chargeuse: hseStat.chargeuse || 0,
        camion_citerne: hseStat.camion_citerne || 0,
        camion_8x4: hseStat.camion_8x4 || 0,
        camion_remorque: hseStat.camion_remorque || 0,
        grue_mobile: hseStat.grue_mobile || 0,
        grue_tour: hseStat.grue_tour || 0,
        compacteur: hseStat.compacteur || 0,
        finisseur_enrobes: hseStat.finisseur_enrobes || 0,
        chariot_elevateur: hseStat.chariot_elevateur || 0,
        foreuse_sondeuse: hseStat.foreuse_sondeuse || 0,
        brise_roche_hydraulique: hseStat.brise_roche_hydraulique || 0,
        pompe_beton: hseStat.pompe_beton || 0,
        nacelle_ciseaux: hseStat.nacelle_ciseaux || 0,
        compresseur_air: hseStat.compresseur_air || 0,
        groupe_electrogene_mobile: hseStat.groupe_electrogene_mobile || 0,
        
        // 9) Inspections & Observations
        inspections_generales: hseStat.inspections_generales || 0,
        inspections_engins: hseStat.inspections_engins || 0,
        hygiene_base_vie: hseStat.hygiene_base_vie || 0,
        outils_electroportatifs_inspections: hseStat.outils_electroportatifs_inspections || 0,
        inspections_electriques: hseStat.inspections_electriques || 0,
        extincteurs: hseStat.extincteurs || 0,
        protections_collectives: hseStat.protections_collectives || 0,
        epi_inspections: hseStat.epi_inspections || 0,
        observations_hse: hseStat.observations_hse || 0,
        actions_correctives_cloturees: hseStat.actions_correctives_cloturees || 0,
        inspection_report: null,
        inspection_generales_report: null,
        inspection_engins_report: null,
        hygiene_base_vie_report: null,
        outils_electroportatifs_report: null,
        inspection_electriques_report: null,
        extincteurs_report: null,
        protections_collectives_report: null,
        epi_inspections_report: null,
        observations_hse_report: null,
        actions_correctives_cloturees_report: null,
        edit_mode: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('contractant.hse-statistics.update', hseStat.id));
    };

    // Calculated fields
    const totalHeures = Number(data.heures_normales) + Number(data.heures_supplementaires);
    const moyenneSensibilisation = data.nb_sensibilisations > 0 ? (data.personnes_sensibilisees / data.nb_sensibilisations) * 100 : 0;
    
    // Safety indicators calculations
    const totalRecordableInjuries = Number(data.acc_mortel) + Number(data.acc_arret) + Number(data.acc_soins_medicaux) + Number(data.acc_restriction_temporaire);
    const lostTimeInjuries = Number(data.acc_mortel) + Number(data.acc_arret);
    const dartInjuries = Number(data.acc_mortel) + Number(data.acc_restriction_temporaire);
    
    const trir = totalHeures > 0 ? (totalRecordableInjuries / totalHeures) * 200000 : 0;
    const ltir = totalHeures > 0 ? (lostTimeInjuries / totalHeures) * 200000 : 0;
    const dart = totalHeures > 0 ? (dartInjuries / totalHeures) * 200000 : 0;
    
    // Formation totals
    const totalSessions = Number(data.excavation_sessions) + Number(data.points_chauds_sessions) + 
                         Number(data.espace_confine_sessions) + Number(data.levage_sessions) + 
                         Number(data.travail_hauteur_sessions) + Number(data.sst_sessions) + 
                         Number(data.epi_sessions) + Number(data.modes_operatoires_sessions) + 
                         Number(data.permis_spa_sessions) + Number(data.outils_electroportatifs_sessions);
    
    const totalParticipants = Number(data.excavation_participants) + Number(data.points_chauds_participants) + 
                             Number(data.espace_confine_participants) + Number(data.levage_participants) + 
                             Number(data.travail_hauteur_participants) + Number(data.sst_participants) + 
                             Number(data.epi_participants) + Number(data.modes_operatoires_participants) + 
                             Number(data.permis_spa_participants) + Number(data.outils_electroportatifs_participants);
    
    const totalHeuresFormations = Number(data.excavation_duree_h) + Number(data.points_chauds_duree_h) + 
                                 Number(data.espace_confine_duree_h) + Number(data.levage_duree_h) + 
                                 Number(data.travail_hauteur_duree_h) + Number(data.sst_duree_h) + 
                                 Number(data.epi_duree_h) + Number(data.modes_operatoires_duree_h) + 
                                 Number(data.permis_spa_duree_h) + Number(data.outils_electroportatifs_duree_h);
    
    // Permis totals
    const permisSpecifiques = Number(data.permis_excavation) + Number(data.permis_point_chaud) + 
                             Number(data.permis_espace_confine) + Number(data.permis_travail_hauteur) + 
                             Number(data.permis_levage) + Number(data.permis_consignation) + 
                             Number(data.permis_electrique_tension);
    const totalPermis = Number(data.permis_general) + permisSpecifiques;
    const ptsrControlesPourcent = data.ptsr_total > 0 ? (data.ptsr_controles / data.ptsr_total) * 100 : 0;
    
    // Inspections totals
    const totalInspectionsHse = Number(data.inspections_generales) + Number(data.inspections_engins) + 
                               Number(data.hygiene_base_vie) + Number(data.outils_electroportatifs_inspections) + 
                               Number(data.inspections_electriques) + Number(data.extincteurs) + 
                               Number(data.protections_collectives) + Number(data.epi_inspections);
    const tauxFermetureActions = data.observations_hse > 0 ? (data.actions_correctives_cloturees / data.observations_hse) * 100 : 0;

    return (
        <ContractantLayout>
            <Head title="Modifier Statistiques HSE" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-8">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">Modifier Statistiques HSE</h1>
                                        <p className="text-gray-600 mt-2">Modifiez vos statistiques de santé, sécurité et environnement</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Link
                                            href={route('contractant.hse-statistics.history')}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                        >
                                            Historique
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* 1) Période & Heures */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">1) Période & Heures</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Site</label>
                                            <select
                                                value={data.site}
                                                onChange={(e) => setData('site', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">Sélectionner un site</option>
                                                <option value="Benguerir">Benguerir</option>
                                                <option value="Alyoussofia">Alyoussofia</option>
                                                <option value="Kheribga">Kheribga</option>
                                                <option value="Jerf Sfer">Jerf Sfer</option>
                                                <option value="Asfi">Asfi</option>
                                            </select>
                                            {errors.site && <p className="text-red-500 text-sm mt-1">{errors.site}</p>}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                            <input
                                                type="date"
                                                value={data.date}
                                                onChange={(e) => setData('date', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Effectif du personnel</label>
                                            <input
                                                type="number"
                                                value={data.effectif_personnel}
                                                onChange={(e) => setData('effectif_personnel', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Heures normales</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.heures_normales}
                                                onChange={(e) => setData('heures_normales', parseFloat(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Heures supplémentaires</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.heures_supplementaires}
                                                onChange={(e) => setData('heures_supplementaires', parseFloat(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Effectif passant l'horaire normal</label>
                                            <input
                                                type="number"
                                                value={data.effectif_passant_horaire_normal}
                                                onChange={(e) => setData('effectif_passant_horaire_normal', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                        <div className="text-lg font-semibold text-blue-800">
                                            Total heures: {totalHeures.toFixed(2)} heures
                                        </div>
                                    </div>
                                </div>

                                {/* 2) Indicateurs (aperçu) */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">2) Indicateurs (aperçu)</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-white rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600">TRIR</div>
                                            <div className="text-lg font-semibold text-blue-800">{trir.toFixed(2)}</div>
                                            <div className="text-sm text-gray-600">Total Recordable Incident Rate</div>
                                        </div>
                                        <div className="text-center p-4 bg-white rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">LTIR</div>
                                            <div className="text-lg font-semibold text-green-800">{ltir.toFixed(2)}</div>
                                            <div className="text-sm text-gray-600">Lost Time Incident Rate</div>
                                        </div>
                                        <div className="text-center p-4 bg-white rounded-lg">
                                            <div className="text-2xl font-bold text-purple-600">DART</div>
                                            <div className="text-lg font-semibold text-purple-800">{dart.toFixed(2)}</div>
                                            <div className="text-sm text-gray-600">Days Away, Restricted, or Transferred</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3) Accidents / Incidents */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">3) Accidents / Incidents</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Accident mortel</label>
                                            <input
                                                type="number"
                                                value={data.acc_mortel}
                                                onChange={(e) => setData('acc_mortel', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Accident avec arrêt</label>
                                            <input
                                                type="number"
                                                value={data.acc_arret}
                                                onChange={(e) => setData('acc_arret', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Accident avec soins médicaux</label>
                                            <input
                                                type="number"
                                                value={data.acc_soins_medicaux}
                                                onChange={(e) => setData('acc_soins_medicaux', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Accident avec restriction temporaire</label>
                                            <input
                                                type="number"
                                                value={data.acc_restriction_temporaire}
                                                onChange={(e) => setData('acc_restriction_temporaire', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Premier soin</label>
                                            <input
                                                type="number"
                                                value={data.premier_soin}
                                                onChange={(e) => setData('premier_soin', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Presque accident</label>
                                            <input
                                                type="number"
                                                value={data.presque_accident}
                                                onChange={(e) => setData('presque_accident', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Dommage matériel</label>
                                            <input
                                                type="number"
                                                value={data.dommage_materiel}
                                                onChange={(e) => setData('dommage_materiel', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Incident environnemental</label>
                                            <input
                                                type="number"
                                                value={data.incident_environnemental}
                                                onChange={(e) => setData('incident_environnemental', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Accident Report Upload */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Rapport d'accident (PDF)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => setData('accident_report', e.target.files[0])}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.accident_report && <p className="text-red-500 text-sm mt-1">{errors.accident_report}</p>}
                                    </div>
                                </div>

                                {/* 4) Personnel & Sensibilisation */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">4) Personnel & Sensibilisation</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sensibilisations</label>
                                            <input
                                                type="number"
                                                value={data.nb_sensibilisations}
                                                onChange={(e) => setData('nb_sensibilisations', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Total des personnes sensibilisées</label>
                                            <input
                                                type="number"
                                                value={data.personnes_sensibilisees}
                                                onChange={(e) => setData('personnes_sensibilisees', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                                        <div className="text-lg font-semibold text-green-800">
                                            Moyenne des personnes sensibilisées: {moyenneSensibilisation.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>

                                {/* 5) Formations & Inductions (totaux) */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">5) Formations & Inductions (totaux)</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Total des inductions (personnes)</label>
                                            <input
                                                type="number"
                                                value={data.inductions_total_personnes}
                                                onChange={(e) => setData('inductions_total_personnes', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Total des personnes formées</label>
                                            <input
                                                type="number"
                                                value={data.formes_total_personnes}
                                                onChange={(e) => setData('formes_total_personnes', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Volume horaire des inductions (heures)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.inductions_volume_heures}
                                                onChange={(e) => setData('inductions_volume_heures', parseFloat(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 6) Formations par thème */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">6) Formations par thème</h2>
                                    
                                    {/* Excavation */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">Excavation</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.excavation_sessions}
                                                    onChange={(e) => setData('excavation_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.excavation_participants}
                                                    onChange={(e) => setData('excavation_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.excavation_duree_h}
                                                    onChange={(e) => setData('excavation_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Points chauds */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">Points chauds</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.points_chauds_sessions}
                                                    onChange={(e) => setData('points_chauds_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.points_chauds_participants}
                                                    onChange={(e) => setData('points_chauds_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.points_chauds_duree_h}
                                                    onChange={(e) => setData('points_chauds_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Espace confiné */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">Espace confiné</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.espace_confine_sessions}
                                                    onChange={(e) => setData('espace_confine_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.espace_confine_participants}
                                                    onChange={(e) => setData('espace_confine_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.espace_confine_duree_h}
                                                    onChange={(e) => setData('espace_confine_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Levage */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">Levage</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.levage_sessions}
                                                    onChange={(e) => setData('levage_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.levage_participants}
                                                    onChange={(e) => setData('levage_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.levage_duree_h}
                                                    onChange={(e) => setData('levage_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Travail en hauteur */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">Travail en hauteur</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.travail_hauteur_sessions}
                                                    onChange={(e) => setData('travail_hauteur_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.travail_hauteur_participants}
                                                    onChange={(e) => setData('travail_hauteur_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.travail_hauteur_duree_h}
                                                    onChange={(e) => setData('travail_hauteur_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* SST */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">SST</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.sst_sessions}
                                                    onChange={(e) => setData('sst_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.sst_participants}
                                                    onChange={(e) => setData('sst_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.sst_duree_h}
                                                    onChange={(e) => setData('sst_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* EPI */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">EPI</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.epi_sessions}
                                                    onChange={(e) => setData('epi_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.epi_participants}
                                                    onChange={(e) => setData('epi_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.epi_duree_h}
                                                    onChange={(e) => setData('epi_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modes opératoires */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">Modes opératoires</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.modes_operatoires_sessions}
                                                    onChange={(e) => setData('modes_operatoires_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.modes_operatoires_participants}
                                                    onChange={(e) => setData('modes_operatoires_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.modes_operatoires_duree_h}
                                                    onChange={(e) => setData('modes_operatoires_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Permis & SPA */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">Permis & SPA</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_spa_sessions}
                                                    onChange={(e) => setData('permis_spa_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_spa_participants}
                                                    onChange={(e) => setData('permis_spa_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.permis_spa_duree_h}
                                                    onChange={(e) => setData('permis_spa_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Outils électroportatifs */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">Outils électroportatifs</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.outils_electroportatifs_sessions}
                                                    onChange={(e) => setData('outils_electroportatifs_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.outils_electroportatifs_participants}
                                                    onChange={(e) => setData('outils_electroportatifs_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.outils_electroportatifs_duree_h}
                                                    onChange={(e) => setData('outils_electroportatifs_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Formation Totals */}
                                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Totaux des formations</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-blue-600">{totalSessions}</div>
                                                <div className="text-sm text-gray-600">Total des séances de formations</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-600">{totalParticipants}</div>
                                                <div className="text-sm text-gray-600">Total des participants</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-purple-600">{totalHeuresFormations.toFixed(2)}</div>
                                                <div className="text-sm text-gray-600">Total heures de formations</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 7) Permis & PTSR */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">7) Permis & PTSR</h2>
                                    
                                    {/* Permis */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">Permis</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Permis général</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_general}
                                                    onChange={(e) => setData('permis_general', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Excavation</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_excavation}
                                                    onChange={(e) => setData('permis_excavation', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Point chaud</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_point_chaud}
                                                    onChange={(e) => setData('permis_point_chaud', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Espace confiné</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_espace_confine}
                                                    onChange={(e) => setData('permis_espace_confine', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Travail en hauteur</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_travail_hauteur}
                                                    onChange={(e) => setData('permis_travail_hauteur', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Levage</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_levage}
                                                    onChange={(e) => setData('permis_levage', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Consignation (LOTO)</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_consignation}
                                                    onChange={(e) => setData('permis_consignation', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Électrique sous tension</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_electrique_tension}
                                                    onChange={(e) => setData('permis_electrique_tension', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Permis Totals */}
                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="text-center">
                                                    <div className="text-lg font-semibold text-blue-800">
                                                        Permis spécifiques total: {permisSpecifiques}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-semibold text-blue-800">
                                                        Total des permis: {totalPermis}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PTSR */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">PTSR</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">PTSR total</label>
                                                <input
                                                    type="number"
                                                    value={data.ptsr_total}
                                                    onChange={(e) => setData('ptsr_total', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">PTSR contrôlés</label>
                                                <input
                                                    type="number"
                                                    value={data.ptsr_controles}
                                                    onChange={(e) => setData('ptsr_controles', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                                            <div className="text-lg font-semibold text-green-800">
                                                % PTSR contrôlé: {ptsrControlesPourcent.toFixed(2)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 8) Engins & Matériels */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">8) Engins & Matériels et équipements spécifiques</h2>
                                    
                                    {/* Engins sur site */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">Engins sur site</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Grue</label>
                                                <input
                                                    type="number"
                                                    value={data.grue}
                                                    onChange={(e) => setData('grue', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Niveleuse</label>
                                                <input
                                                    type="number"
                                                    value={data.niveleuse}
                                                    onChange={(e) => setData('niveleuse', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Pelle hydraulique</label>
                                                <input
                                                    type="number"
                                                    value={data.pelle_hydraulique}
                                                    onChange={(e) => setData('pelle_hydraulique', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Tractopelle</label>
                                                <input
                                                    type="number"
                                                    value={data.tractopelle}
                                                    onChange={(e) => setData('tractopelle', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Chargeuse</label>
                                                <input
                                                    type="number"
                                                    value={data.chargeuse}
                                                    onChange={(e) => setData('chargeuse', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Camion citerne</label>
                                                <input
                                                    type="number"
                                                    value={data.camion_citerne}
                                                    onChange={(e) => setData('camion_citerne', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Camion 8×4</label>
                                                <input
                                                    type="number"
                                                    value={data.camion_8x4}
                                                    onChange={(e) => setData('camion_8x4', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Camion remorque</label>
                                                <input
                                                    type="number"
                                                    value={data.camion_remorque}
                                                    onChange={(e) => setData('camion_remorque', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Grue mobile</label>
                                                <input
                                                    type="number"
                                                    value={data.grue_mobile}
                                                    onChange={(e) => setData('grue_mobile', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Grue tour</label>
                                                <input
                                                    type="number"
                                                    value={data.grue_tour}
                                                    onChange={(e) => setData('grue_tour', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Compacteur</label>
                                                <input
                                                    type="number"
                                                    value={data.compacteur}
                                                    onChange={(e) => setData('compacteur', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Finisseur d'enrobés</label>
                                                <input
                                                    type="number"
                                                    value={data.finisseur_enrobes}
                                                    onChange={(e) => setData('finisseur_enrobes', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Chariot élévateur</label>
                                                <input
                                                    type="number"
                                                    value={data.chariot_elevateur}
                                                    onChange={(e) => setData('chariot_elevateur', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Foreuse / sondeuse</label>
                                                <input
                                                    type="number"
                                                    value={data.foreuse_sondeuse}
                                                    onChange={(e) => setData('foreuse_sondeuse', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Brise-roche hydraulique</label>
                                                <input
                                                    type="number"
                                                    value={data.brise_roche_hydraulique}
                                                    onChange={(e) => setData('brise_roche_hydraulique', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Pompe à béton</label>
                                                <input
                                                    type="number"
                                                    value={data.pompe_beton}
                                                    onChange={(e) => setData('pompe_beton', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nacelle à ciseaux</label>
                                                <input
                                                    type="number"
                                                    value={data.nacelle_ciseaux}
                                                    onChange={(e) => setData('nacelle_ciseaux', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Matériels spécifiques */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">Matériels spécifiques</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Compresseur d'air</label>
                                                <input
                                                    type="number"
                                                    value={data.compresseur_air}
                                                    onChange={(e) => setData('compresseur_air', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Groupe électrogène mobile</label>
                                                <input
                                                    type="number"
                                                    value={data.groupe_electrogene_mobile}
                                                    onChange={(e) => setData('groupe_electrogene_mobile', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 9) Inspections & Observations */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">9) Inspections & Observations</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Inspections générales</label>
                                            <input
                                                type="number"
                                                value={data.inspections_generales}
                                                onChange={(e) => setData('inspections_generales', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Inspections engins</label>
                                            <input
                                                type="number"
                                                value={data.inspections_engins}
                                                onChange={(e) => setData('inspections_engins', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Hygiène & base vie</label>
                                            <input
                                                type="number"
                                                value={data.hygiene_base_vie}
                                                onChange={(e) => setData('hygiene_base_vie', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Outils électroportatifs</label>
                                            <input
                                                type="number"
                                                value={data.outils_electroportatifs_inspections}
                                                onChange={(e) => setData('outils_electroportatifs_inspections', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Inspections électriques</label>
                                            <input
                                                type="number"
                                                value={data.inspections_electriques}
                                                onChange={(e) => setData('inspections_electriques', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Extincteurs</label>
                                            <input
                                                type="number"
                                                value={data.extincteurs}
                                                onChange={(e) => setData('extincteurs', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Protections collectives</label>
                                            <input
                                                type="number"
                                                value={data.protections_collectives}
                                                onChange={(e) => setData('protections_collectives', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">EPI</label>
                                            <input
                                                type="number"
                                                value={data.epi_inspections}
                                                onChange={(e) => setData('epi_inspections', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Observations HSE</label>
                                            <input
                                                type="number"
                                                value={data.observations_hse}
                                                onChange={(e) => setData('observations_hse', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Actions correctives clôturées</label>
                                            <input
                                                type="number"
                                                value={data.actions_correctives_cloturees}
                                                onChange={(e) => setData('actions_correctives_cloturees', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Inspection Reports Upload */}
                                    <div className="mt-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">Rapports d'inspection (PDF)</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport inspections générales</label>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => setData('inspection_generales_report', e.target.files[0])}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.inspection_generales_report && <p className="text-red-500 text-sm mt-1">{errors.inspection_generales_report}</p>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport inspections engins</label>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => setData('inspection_engins_report', e.target.files[0])}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.inspection_engins_report && <p className="text-red-500 text-sm mt-1">{errors.inspection_engins_report}</p>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport hygiène & base vie</label>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => setData('hygiene_base_vie_report', e.target.files[0])}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.hygiene_base_vie_report && <p className="text-red-500 text-sm mt-1">{errors.hygiene_base_vie_report}</p>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport outils électroportatifs</label>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => setData('outils_electroportatifs_report', e.target.files[0])}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.outils_electroportatifs_report && <p className="text-red-500 text-sm mt-1">{errors.outils_electroportatifs_report}</p>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport inspections électriques</label>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => setData('inspection_electriques_report', e.target.files[0])}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.inspection_electriques_report && <p className="text-red-500 text-sm mt-1">{errors.inspection_electriques_report}</p>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport extincteurs</label>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => setData('extincteurs_report', e.target.files[0])}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.extincteurs_report && <p className="text-red-500 text-sm mt-1">{errors.extincteurs_report}</p>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport protections collectives</label>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => setData('protections_collectives_report', e.target.files[0])}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.protections_collectives_report && <p className="text-red-500 text-sm mt-1">{errors.protections_collectives_report}</p>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport EPI inspections</label>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => setData('epi_inspections_report', e.target.files[0])}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.epi_inspections_report && <p className="text-red-500 text-sm mt-1">{errors.epi_inspections_report}</p>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport observations HSE</label>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => setData('observations_hse_report', e.target.files[0])}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.observations_hse_report && <p className="text-red-500 text-sm mt-1">{errors.observations_hse_report}</p>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport actions correctives clôturées</label>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => setData('actions_correctives_cloturees_report', e.target.files[0])}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.actions_correctives_cloturees_report && <p className="text-red-500 text-sm mt-1">{errors.actions_correctives_cloturees_report}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Inspection Totals */}
                                    <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="text-center">
                                                <div className="text-lg font-semibold text-purple-800">
                                                    Total inspections HSE: {totalInspectionsHse}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-semibold text-purple-800">
                                                    Taux de fermeture des actions: {tauxFermetureActions.toFixed(2)}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Modification...' : 'Modifier les statistiques'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </ContractantLayout>
    );
}
