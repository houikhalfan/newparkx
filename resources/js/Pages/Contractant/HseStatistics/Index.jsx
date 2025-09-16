import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm, Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Download, FileText, Calendar, ArrowLeft, History, BarChart3, Users, Clock, AlertTriangle, Shield, Award, Truck, Trash2 } from 'lucide-react';
import ContractantSidebar from '@/Components/ContractantSidebar';
import ContractantTopHeader from '@/Components/ContractantTopHeader';

export default function HseStatisticsIndex({ sites, todaySubmission, canSubmit, contractor }) {
    const { flash } = usePage().props;
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const profileDropdownRef = useRef(null);

    const handleFileUpload = (fieldName, file) => {
        setData(fieldName, file);
        setUploadedFiles(prev => ({
            ...prev,
            [fieldName]: {
                name: file.name,
                size: file.size,
                type: file.type
            }
        }));
    };

    const handleFileDelete = (fieldName) => {
        setData(fieldName, null);
        setUploadedFiles(prev => {
            const newFiles = { ...prev };
            delete newFiles[fieldName];
            return newFiles;
        });
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const { data, setData, post, processing, errors } = useForm({
        // 1) Période & Heures
        site_id: '',
        date: new Date().toISOString().split('T')[0],
        effectif_personnel: 0,
        heures_normales: 0,
        heures_supplementaires: 0,
        effectif_passant_horaire_normal: 0,
        
        // 3) Accidents / Incidents
        acc_mortel: 0,
        acc_arret: 0,
        acc_soins_medicaux: 0,
        acc_restriction_temporaire: 0,
        premier_soin: 0,
        presque_accident: 0,
        dommage_materiel: 0,
        incident_environnemental: 0,
        accident_report: null,
        
        // 4) Personnel & Sensibilisation
        nb_sensibilisations: 0,
        personnes_sensibilisees: 0,
        
        // 5) Formations & Inductions (totaux)
        inductions_total_personnes: 0,
        formes_total_personnes: 0,
        inductions_volume_heures: 0,
        
        // 6) Formations par thème
        excavation_sessions: 0,
        excavation_participants: 0,
        excavation_duree_h: 0,
        points_chauds_sessions: 0,
        points_chauds_participants: 0,
        points_chauds_duree_h: 0,
        espace_confine_sessions: 0,
        espace_confine_participants: 0,
        espace_confine_duree_h: 0,
        levage_sessions: 0,
        levage_participants: 0,
        levage_duree_h: 0,
        travail_hauteur_sessions: 0,
        travail_hauteur_participants: 0,
        travail_hauteur_duree_h: 0,
        sst_sessions: 0,
        sst_participants: 0,
        sst_duree_h: 0,
        epi_sessions: 0,
        epi_participants: 0,
        epi_duree_h: 0,
        modes_operatoires_sessions: 0,
        modes_operatoires_participants: 0,
        modes_operatoires_duree_h: 0,
        permis_spa_sessions: 0,
        permis_spa_participants: 0,
        permis_spa_duree_h: 0,
        outils_electroportatifs_sessions: 0,
        outils_electroportatifs_participants: 0,
        outils_electroportatifs_duree_h: 0,
        
        // 7) Permis & PTSR
        permis_general: 0,
        permis_excavation: 0,
        permis_point_chaud: 0,
        permis_espace_confine: 0,
        permis_travail_hauteur: 0,
        permis_levage: 0,
        permis_consignation: 0,
        permis_electrique_tension: 0,
        ptsr_total: 0,
        ptsr_controles: 0,
        
        // 8) Engins & Matériels
        grue: 0,
        niveleuse: 0,
        pelle_hydraulique: 0,
        tractopelle: 0,
        chargeuse: 0,
        camion_citerne: 0,
        camion_8x4: 0,
        camion_remorque: 0,
        grue_mobile: 0,
        grue_tour: 0,
        compacteur: 0,
        finisseur_enrobes: 0,
        chariot_elevateur: 0,
        foreuse_sondeuse: 0,
        brise_roche_hydraulique: 0,
        pompe_beton: 0,
        nacelle_ciseaux: 0,
        compresseur_air: 0,
        groupe_electrogene_mobile: 0,
        
        // 9) Inspections & Observations
        inspections_generales: 0,
        inspections_engins: 0,
        hygiene_base_vie: 0,
        outils_electroportatifs_inspections: 0,
        inspections_electriques: 0,
        extincteurs: 0,
        protections_collectives: 0,
        epi_inspections: 0,
        observations_hse: 0,
        actions_correctives_cloturees: 0,
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
        edit_mode: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contractant.hse-statistics.store'));
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
        <>
            <Head title="Statistiques HSE" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden flex">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
                                            </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59,130,246,0.3) 1px, transparent 0)`,
                        backgroundSize: '50px 50px'
                    }} />
                                    </div>

                {/* Sidebar */}
                <ContractantSidebar />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                    {/* Top Header */}
                    <ContractantTopHeader 
                        contractor={contractor}
                        showBackButton={true}
                        backRoute={route('contractant.home')}
                        backLabel="Retour au tableau de bord"
                    />

                    {/* Success Message */}
                    <AnimatePresence>
                        {flash?.success && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="relative z-10 px-6 mb-6"
                            >
                                <div className="max-w-7xl mx-auto">
                                    <div className="bg-green-50 backdrop-blur-sm border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                                        <BarChart3 className="w-5 h-5 text-green-600" />
                                        <p className="text-green-700 font-medium">{flash.success}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Content */}
                    <div className="relative z-10 px-6 pb-12 flex-1 pt-8">
                        <div className="max-w-7xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-center mb-12"
                            >
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Statistiques HSE</span>
                                </h1>
                                        {canSubmit ? (
                                    <p className="text-gray-600 text-lg">Soumettez vos statistiques de santé, sécurité et environnement</p>
                                ) : (
                                    <div className="mt-4">
                                        <p className="text-red-600 font-medium text-lg">Vous avez déjà soumis vos statistiques pour aujourd'hui</p>
                                        <p className="text-gray-600 text-sm mt-2">Vous pouvez consulter et modifier vos statistiques dans l'historique</p>
                                            </div>
                                        )}
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="flex justify-center gap-4 mb-8"
                            >
                                        <Link
                                            href={route('contractant.hse-statistics.history')}
                                    className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl text-blue-700 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/50 hover:text-blue-600 transition-all duration-300 backdrop-blur-sm"
                                        >
                                    <History className="w-5 h-5" />
                                    <span className="font-medium">Historique</span>
                                        </Link>
                            </motion.div>

                            {canSubmit ? (
                                <motion.form 
                                    onSubmit={handleSubmit} 
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="space-y-8"
                                >
                                {/* 1) Période & Heures */}
                                <div className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                                     style={{
                                         background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                         backdropFilter: 'blur(20px)',
                                         boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                                     }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                                            <Clock className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">1) Période & Heures</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Site</label>
                                            <select
                                                value={data.site_id}
                                                onChange={(e) => setData('site_id', e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                style={{ colorScheme: 'dark' }}
                                                required
                                            >
                                                <option value="" className="bg-gray-800 text-white">Sélectionner un site</option>
                                                {sites.map(site => (
                                                    <option key={site.id} value={site.id} className="bg-gray-800 text-white">{site.name}</option>
                                                ))}
                                            </select>
                                            {errors.site_id && <p className="text-red-500 text-sm mt-1">{errors.site_id}</p>}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                            <input
                                                type="date"
                                                value={data.date}
                                                onChange={(e) => setData('date', e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                required
                                            />
                                            {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Effectif du personnel</label>
                                            <input
                                                type="number"
                                                value={data.effectif_personnel}
                                                onChange={(e) => setData('effectif_personnel', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
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
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
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
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Effectif passant l'horaire normal</label>
                                            <input
                                                type="number"
                                                value={data.effectif_passant_horaire_normal}
                                                onChange={(e) => setData('effectif_passant_horaire_normal', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-4 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-xl">
                                        <div className="text-lg font-semibold text-gray-800">
                                            Total heures: {totalHeures.toFixed(2)} heures
                                        </div>
                                    </div>
                                </div>

                                {/* 2) Indicateurs (aperçu) */}
                                <div className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                                     style={{
                                         background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                         backdropFilter: 'blur(20px)',
                                         boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                                     }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                                            <BarChart3 className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">2) Indicateurs (aperçu)</h2>
                                        </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-6 rounded-xl border border-blue-500/20 text-center">
                                            <div className="text-3xl font-bold text-blue-600 mb-2">{trir.toFixed(2)}</div>
                                            <div className="text-sm font-medium text-blue-700">TRIR</div>
                                            <div className="text-xs text-blue-600/70 mt-1">Total Recordable Incident Rate</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-6 rounded-xl border border-green-500/20 text-center">
                                            <div className="text-3xl font-bold text-green-600 mb-2">{ltir.toFixed(2)}</div>
                                            <div className="text-sm font-medium text-green-700">LTIR</div>
                                            <div className="text-xs text-green-600/70 mt-1">Lost Time Incident Rate</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-6 rounded-xl border border-purple-500/20 text-center">
                                            <div className="text-3xl font-bold text-purple-600 mb-2">{dart.toFixed(2)}</div>
                                            <div className="text-sm font-medium text-purple-700">DART</div>
                                            <div className="text-xs text-purple-600/70 mt-1">Days Away, Restricted, or Transferred</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3) Accidents / Incidents */}
                                <div className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                                     style={{
                                         background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                         backdropFilter: 'blur(20px)',
                                         boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                                     }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg">
                                            <AlertTriangle className="w-6 h-6 text-red-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">3) Accidents / Incidents</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Accident mortel</label>
                                            <input
                                                type="number"
                                                value={data.acc_mortel}
                                                onChange={(e) => setData('acc_mortel', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Accident avec arrêt</label>
                                            <input
                                                type="number"
                                                value={data.acc_arret}
                                                onChange={(e) => setData('acc_arret', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Accident avec soins médicaux</label>
                                            <input
                                                type="number"
                                                value={data.acc_soins_medicaux}
                                                onChange={(e) => setData('acc_soins_medicaux', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Accident avec restriction temporaire</label>
                                            <input
                                                type="number"
                                                value={data.acc_restriction_temporaire}
                                                onChange={(e) => setData('acc_restriction_temporaire', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Premier soin</label>
                                            <input
                                                type="number"
                                                value={data.premier_soin}
                                                onChange={(e) => setData('premier_soin', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Presque accident</label>
                                            <input
                                                type="number"
                                                value={data.presque_accident}
                                                onChange={(e) => setData('presque_accident', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Dommage matériel</label>
                                            <input
                                                type="number"
                                                value={data.dommage_materiel}
                                                onChange={(e) => setData('dommage_materiel', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Incident environnemental</label>
                                            <input
                                                type="number"
                                                value={data.incident_environnemental}
                                                onChange={(e) => setData('incident_environnemental', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Accident Report Upload */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Rapport d'accident (PDF)</label>
                                        
                                        {uploadedFiles.accident_report ? (
                                            <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                                <div className="flex items-center space-x-3">
                                                    <FileText className="w-5 h-5 text-emerald-600" />
                                                    <div>
                                                        <p className="text-emerald-700 text-sm font-medium">{uploadedFiles.accident_report.name}</p>
                                                        <p className="text-emerald-600 text-xs">{(uploadedFiles.accident_report.size / 1024).toFixed(1)} KB</p>
                                                    </div>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleFileDelete('accident_report')}
                                                    className="p-2 text-red-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </motion.button>
                                            </div>
                                        ) : (
                                            <motion.input
                                            type="file"
                                            accept=".pdf"
                                                onChange={(e) => handleFileUpload('accident_report', e.target.files[0])}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 hover:bg-gray-50 hover:border-blue-400 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3 file:hover:bg-blue-500/30 file:transition-all file:duration-300"
                                            />
                                        )}
                                        
                                        {errors.accident_report && <p className="text-red-600 text-sm mt-1">{errors.accident_report}</p>}
                                    </div>
                                </div>

                                {/* 4) Personnel & Sensibilisation */}
                                <div className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                                     style={{
                                         background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                         backdropFilter: 'blur(20px)',
                                         boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                                     }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                                            <Users className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">4) Personnel & Sensibilisation</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sensibilisations</label>
                                            <input
                                                type="number"
                                                value={data.nb_sensibilisations}
                                                onChange={(e) => setData('nb_sensibilisations', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Total des personnes sensibilisées</label>
                                            <input
                                                type="number"
                                                value={data.personnes_sensibilisees}
                                                onChange={(e) => setData('personnes_sensibilisees', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl">
                                        <div className="text-lg font-semibold text-gray-800">
                                            Moyenne des personnes sensibilisées: {moyenneSensibilisation.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>

                                {/* 5) Formations & Inductions (totaux) */}
                                <div className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                                     style={{
                                         background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                         backdropFilter: 'blur(20px)',
                                         boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                                     }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                                            <Award className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">5) Formations & Inductions (totaux)</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Total des inductions (personnes)</label>
                                            <input
                                                type="number"
                                                value={data.inductions_total_personnes}
                                                onChange={(e) => setData('inductions_total_personnes', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Total des personnes formées</label>
                                            <input
                                                type="number"
                                                value={data.formes_total_personnes}
                                                onChange={(e) => setData('formes_total_personnes', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
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
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 6) Formations par thème */}
                                <div className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                                     style={{
                                         background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                         backdropFilter: 'blur(20px)',
                                         boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                                     }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-lg">
                                            <Shield className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">6) Formations par thème</h2>
                                    </div>
                                    
                                    {/* Excavation */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Excavation</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.excavation_sessions}
                                                    onChange={(e) => handleFileUpload('excavation_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.excavation_participants}
                                                    onChange={(e) => handleFileUpload('excavation_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.excavation_duree_h}
                                                    onChange={(e) => handleFileUpload('excavation_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Points chauds */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Points chauds</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.points_chauds_sessions}
                                                    onChange={(e) => handleFileUpload('points_chauds_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.points_chauds_participants}
                                                    onChange={(e) => handleFileUpload('points_chauds_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.points_chauds_duree_h}
                                                    onChange={(e) => handleFileUpload('points_chauds_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Espace confiné */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Espace confiné</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.espace_confine_sessions}
                                                    onChange={(e) => handleFileUpload('espace_confine_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.espace_confine_participants}
                                                    onChange={(e) => handleFileUpload('espace_confine_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.espace_confine_duree_h}
                                                    onChange={(e) => handleFileUpload('espace_confine_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Levage */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Levage</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.levage_sessions}
                                                    onChange={(e) => handleFileUpload('levage_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.levage_participants}
                                                    onChange={(e) => handleFileUpload('levage_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.levage_duree_h}
                                                    onChange={(e) => handleFileUpload('levage_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Travail en hauteur */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Travail en hauteur</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.travail_hauteur_sessions}
                                                    onChange={(e) => handleFileUpload('travail_hauteur_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.travail_hauteur_participants}
                                                    onChange={(e) => handleFileUpload('travail_hauteur_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.travail_hauteur_duree_h}
                                                    onChange={(e) => handleFileUpload('travail_hauteur_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* SST */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">SST</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.sst_sessions}
                                                    onChange={(e) => handleFileUpload('sst_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.sst_participants}
                                                    onChange={(e) => handleFileUpload('sst_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.sst_duree_h}
                                                    onChange={(e) => handleFileUpload('sst_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
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
                                                    onChange={(e) => handleFileUpload('epi_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.epi_participants}
                                                    onChange={(e) => handleFileUpload('epi_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.epi_duree_h}
                                                    onChange={(e) => handleFileUpload('epi_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modes opératoires */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-300 mb-3">Modes opératoires</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre des sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.modes_operatoires_sessions}
                                                    onChange={(e) => handleFileUpload('modes_operatoires_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.modes_operatoires_participants}
                                                    onChange={(e) => handleFileUpload('modes_operatoires_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.modes_operatoires_duree_h}
                                                    onChange={(e) => handleFileUpload('modes_operatoires_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
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
                                                    onChange={(e) => handleFileUpload('permis_spa_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_spa_participants}
                                                    onChange={(e) => handleFileUpload('permis_spa_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.permis_spa_duree_h}
                                                    onChange={(e) => handleFileUpload('permis_spa_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
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
                                                    onChange={(e) => handleFileUpload('outils_electroportatifs_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.outils_electroportatifs_participants}
                                                    onChange={(e) => handleFileUpload('outils_electroportatifs_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.outils_electroportatifs_duree_h}
                                                    onChange={(e) => handleFileUpload('outils_electroportatifs_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Formation Totals */}
                                    <div className="mt-6 p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Totaux des formations</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="text-center bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 p-6 rounded-xl border border-cyan-500/20">
                                                <div className="text-2xl font-bold text-blue-600">{totalSessions}</div>
                                                <div className="text-sm text-blue-700">Total des séances de formations</div>
                                            </div>
                                            <div className="text-center bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 p-6 rounded-xl border border-emerald-500/20">
                                                <div className="text-2xl font-bold text-green-600">{totalParticipants}</div>
                                                <div className="text-sm text-green-700">Total des participants</div>
                                            </div>
                                            <div className="text-center bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-6 rounded-xl border border-purple-500/20">
                                                <div className="text-2xl font-bold text-purple-600">{totalHeuresFormations.toFixed(2)}</div>
                                                <div className="text-sm text-purple-700">Total heures de formations</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 7) Permis & PTSR */}
                                <div className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                                     style={{
                                         background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                         backdropFilter: 'blur(20px)',
                                         boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                                     }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                                            <Shield className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">7) Permis & PTSR</h2>
                                    </div>
                                    
                                    {/* Permis */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Permis</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Permis général</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_general}
                                                    onChange={(e) => handleFileUpload('permis_general', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Excavation</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_excavation}
                                                    onChange={(e) => handleFileUpload('permis_excavation', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Point chaud</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_point_chaud}
                                                    onChange={(e) => handleFileUpload('permis_point_chaud', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Espace confiné</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_espace_confine}
                                                    onChange={(e) => handleFileUpload('permis_espace_confine', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Travail en hauteur</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_travail_hauteur}
                                                    onChange={(e) => handleFileUpload('permis_travail_hauteur', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Levage</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_levage}
                                                    onChange={(e) => handleFileUpload('permis_levage', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Consignation (LOTO)</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_consignation}
                                                    onChange={(e) => handleFileUpload('permis_consignation', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Électrique sous tension</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_electrique_tension}
                                                    onChange={(e) => handleFileUpload('permis_electrique_tension', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Permis Totals */}
                                        <div className="mt-6 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="text-center bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4 rounded-xl border border-blue-500/20">
                                                    <div className="text-lg font-semibold text-blue-700">
                                                        Permis spécifiques total: {permisSpecifiques}
                                                    </div>
                                                </div>
                                                <div className="text-center bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-4 rounded-xl border border-purple-500/20">
                                                    <div className="text-lg font-semibold text-purple-700">
                                                        Total des permis: {totalPermis}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PTSR */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">PTSR</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">PTSR total</label>
                                                <input
                                                    type="number"
                                                    value={data.ptsr_total}
                                                    onChange={(e) => handleFileUpload('ptsr_total', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">PTSR contrôlés</label>
                                                <input
                                                    type="number"
                                                    value={data.ptsr_controles}
                                                    onChange={(e) => handleFileUpload('ptsr_controles', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6 p-6 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl">
                                            <div className="text-lg font-semibold text-emerald-700">
                                                % PTSR contrôlé: {ptsrControlesPourcent.toFixed(2)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 8) Engins & Matériels */}
                                <div className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                                     style={{
                                         background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                         backdropFilter: 'blur(20px)',
                                         boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                                     }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg">
                                            <Truck className="w-6 h-6 text-yellow-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">8) Engins & Matériels et équipements spécifiques</h2>
                                    </div>
                                    
                                    {/* Engins sur site */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Engins sur site</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Grue</label>
                                                <input
                                                    type="number"
                                                    value={data.grue}
                                                    onChange={(e) => handleFileUpload('grue', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Niveleuse</label>
                                                <input
                                                    type="number"
                                                    value={data.niveleuse}
                                                    onChange={(e) => handleFileUpload('niveleuse', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Pelle hydraulique</label>
                                                <input
                                                    type="number"
                                                    value={data.pelle_hydraulique}
                                                    onChange={(e) => handleFileUpload('pelle_hydraulique', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Tractopelle</label>
                                                <input
                                                    type="number"
                                                    value={data.tractopelle}
                                                    onChange={(e) => handleFileUpload('tractopelle', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Chargeuse</label>
                                                <input
                                                    type="number"
                                                    value={data.chargeuse}
                                                    onChange={(e) => handleFileUpload('chargeuse', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Camion citerne</label>
                                                <input
                                                    type="number"
                                                    value={data.camion_citerne}
                                                    onChange={(e) => handleFileUpload('camion_citerne', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Camion 8×4</label>
                                                <input
                                                    type="number"
                                                    value={data.camion_8x4}
                                                    onChange={(e) => handleFileUpload('camion_8x4', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Camion remorque</label>
                                                <input
                                                    type="number"
                                                    value={data.camion_remorque}
                                                    onChange={(e) => handleFileUpload('camion_remorque', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Grue mobile</label>
                                                <input
                                                    type="number"
                                                    value={data.grue_mobile}
                                                    onChange={(e) => handleFileUpload('grue_mobile', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Grue tour</label>
                                                <input
                                                    type="number"
                                                    value={data.grue_tour}
                                                    onChange={(e) => handleFileUpload('grue_tour', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Compacteur</label>
                                                <input
                                                    type="number"
                                                    value={data.compacteur}
                                                    onChange={(e) => handleFileUpload('compacteur', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Finisseur d'enrobés</label>
                                                <input
                                                    type="number"
                                                    value={data.finisseur_enrobes}
                                                    onChange={(e) => handleFileUpload('finisseur_enrobes', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Chariot élévateur</label>
                                                <input
                                                    type="number"
                                                    value={data.chariot_elevateur}
                                                    onChange={(e) => handleFileUpload('chariot_elevateur', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Foreuse / sondeuse</label>
                                                <input
                                                    type="number"
                                                    value={data.foreuse_sondeuse}
                                                    onChange={(e) => handleFileUpload('foreuse_sondeuse', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Brise-roche hydraulique</label>
                                                <input
                                                    type="number"
                                                    value={data.brise_roche_hydraulique}
                                                    onChange={(e) => handleFileUpload('brise_roche_hydraulique', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Pompe à béton</label>
                                                <input
                                                    type="number"
                                                    value={data.pompe_beton}
                                                    onChange={(e) => handleFileUpload('pompe_beton', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nacelle à ciseaux</label>
                                                <input
                                                    type="number"
                                                    value={data.nacelle_ciseaux}
                                                    onChange={(e) => handleFileUpload('nacelle_ciseaux', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Matériels spécifiques */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Matériels spécifiques</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Compresseur d'air</label>
                                                <input
                                                    type="number"
                                                    value={data.compresseur_air}
                                                    onChange={(e) => handleFileUpload('compresseur_air', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Groupe électrogène mobile</label>
                                                <input
                                                    type="number"
                                                    value={data.groupe_electrogene_mobile}
                                                    onChange={(e) => handleFileUpload('groupe_electrogene_mobile', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 9) Inspections & Observations */}
                                <div className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                                     style={{
                                         background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                         backdropFilter: 'blur(20px)',
                                         boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                                     }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-lg">
                                            <Shield className="w-6 h-6 text-teal-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">9) Inspections & Observations</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Inspections générales</label>
                                            <input
                                                type="number"
                                                value={data.inspections_generales}
                                                onChange={(e) => setData('inspections_generales', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Inspections engins</label>
                                            <input
                                                type="number"
                                                value={data.inspections_engins}
                                                onChange={(e) => setData('inspections_engins', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Hygiène & base vie</label>
                                            <input
                                                type="number"
                                                value={data.hygiene_base_vie}
                                                onChange={(e) => setData('hygiene_base_vie', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Outils électroportatifs</label>
                                            <input
                                                type="number"
                                                value={data.outils_electroportatifs_inspections}
                                                onChange={(e) => setData('outils_electroportatifs_inspections', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Inspections électriques</label>
                                            <input
                                                type="number"
                                                value={data.inspections_electriques}
                                                onChange={(e) => setData('inspections_electriques', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Extincteurs</label>
                                            <input
                                                type="number"
                                                value={data.extincteurs}
                                                onChange={(e) => setData('extincteurs', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Protections collectives</label>
                                            <input
                                                type="number"
                                                value={data.protections_collectives}
                                                onChange={(e) => setData('protections_collectives', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">EPI</label>
                                            <input
                                                type="number"
                                                value={data.epi_inspections}
                                                onChange={(e) => setData('epi_inspections', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Observations HSE</label>
                                            <input
                                                type="number"
                                                value={data.observations_hse}
                                                onChange={(e) => setData('observations_hse', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Actions correctives clôturées</label>
                                            <input
                                                type="number"
                                                value={data.actions_correctives_cloturees}
                                                onChange={(e) => setData('actions_correctives_cloturees', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Inspection Reports Upload */}
                                    <div className="mt-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Rapports d'inspection (PDF)</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport inspections générales</label>
                                                
                                                {uploadedFiles.inspection_generales_report ? (
                                                    <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                                        <div className="flex items-center space-x-3">
                                                            <FileText className="w-5 h-5 text-emerald-600" />
                                                            <div>
                                                                <p className="text-emerald-700 text-sm font-medium">{uploadedFiles.inspection_generales_report.name}</p>
                                                                <p className="text-emerald-600 text-xs">{(uploadedFiles.inspection_generales_report.size / 1024).toFixed(1)} KB</p>
                                                            </div>
                                                        </div>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleFileDelete('inspection_generales_report')}
                                                            className="p-2 text-red-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </motion.button>
                                                    </div>
                                                ) : (
                                                    <motion.input
                                                    type="file"
                                                    accept=".pdf"
                                                        onChange={(e) => handleFileUpload('inspection_generales_report', e.target.files[0])}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 hover:bg-gray-50 hover:border-blue-400 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3 file:hover:bg-blue-500/30 file:transition-all file:duration-300"
                                                    />
                                                )}
                                                
                                                {errors.inspection_generales_report && <p className="text-red-600 text-sm mt-1">{errors.inspection_generales_report}</p>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport inspections engins</label>
                                                <motion.input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => handleFileUpload('inspection_engins_report', e.target.files[0])}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 hover:bg-gray-50 hover:border-blue-400 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3 file:hover:bg-blue-500/30 file:transition-all file:duration-300"
                                                />
                                                {errors.inspection_engins_report && <p className="text-red-500 text-sm mt-1">{errors.inspection_engins_report}</p>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport hygiène & base vie</label>
                                                <motion.input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => handleFileUpload('hygiene_base_vie_report', e.target.files[0])}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 hover:bg-gray-50 hover:border-blue-400 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3 file:hover:bg-blue-500/30 file:transition-all file:duration-300"
                                                />
                                                {errors.hygiene_base_vie_report && <p className="text-red-500 text-sm mt-1">{errors.hygiene_base_vie_report}</p>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport outils électroportatifs</label>
                                                <motion.input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => handleFileUpload('outils_electroportatifs_report', e.target.files[0])}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 hover:bg-gray-50 hover:border-blue-400 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3 file:hover:bg-blue-500/30 file:transition-all file:duration-300"
                                                />
                                                {errors.outils_electroportatifs_report && <p className="text-red-500 text-sm mt-1">{errors.outils_electroportatifs_report}</p>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport inspections électriques</label>
                                                <motion.input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => handleFileUpload('inspection_electriques_report', e.target.files[0])}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 hover:bg-gray-50 hover:border-blue-400 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3 file:hover:bg-blue-500/30 file:transition-all file:duration-300"
                                                />
                                                {errors.inspection_electriques_report && <p className="text-red-500 text-sm mt-1">{errors.inspection_electriques_report}</p>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport extincteurs</label>
                                                <motion.input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => handleFileUpload('extincteurs_report', e.target.files[0])}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 hover:bg-gray-50 hover:border-blue-400 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3 file:hover:bg-blue-500/30 file:transition-all file:duration-300"
                                                />
                                                {errors.extincteurs_report && <p className="text-red-500 text-sm mt-1">{errors.extincteurs_report}</p>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport protections collectives</label>
                                                <motion.input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => handleFileUpload('protections_collectives_report', e.target.files[0])}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 hover:bg-gray-50 hover:border-blue-400 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3 file:hover:bg-blue-500/30 file:transition-all file:duration-300"
                                                />
                                                {errors.protections_collectives_report && <p className="text-red-500 text-sm mt-1">{errors.protections_collectives_report}</p>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport EPI inspections</label>
                                                <motion.input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => handleFileUpload('epi_inspections_report', e.target.files[0])}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 hover:bg-gray-50 hover:border-blue-400 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3 file:hover:bg-blue-500/30 file:transition-all file:duration-300"
                                                />
                                                {errors.epi_inspections_report && <p className="text-red-500 text-sm mt-1">{errors.epi_inspections_report}</p>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport observations HSE</label>
                                                <motion.input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => handleFileUpload('observations_hse_report', e.target.files[0])}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 hover:bg-gray-50 hover:border-blue-400 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3 file:hover:bg-blue-500/30 file:transition-all file:duration-300"
                                                />
                                                {errors.observations_hse_report && <p className="text-red-500 text-sm mt-1">{errors.observations_hse_report}</p>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rapport actions correctives clôturées</label>
                                                <motion.input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => handleFileUpload('actions_correctives_cloturees_report', e.target.files[0])}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 hover:bg-gray-50 hover:border-blue-400 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3 file:hover:bg-blue-500/30 file:transition-all file:duration-300"
                                                />
                                                {errors.actions_correctives_cloturees_report && <p className="text-red-500 text-sm mt-1">{errors.actions_correctives_cloturees_report}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Inspection Totals */}
                                    <div className="mt-6 p-6 bg-gradient-to-r from-teal-500/10 to-purple-500/10 border border-teal-500/20 rounded-xl">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="text-center bg-gradient-to-br from-teal-500/10 to-teal-600/10 p-4 rounded-xl border border-teal-500/20">
                                                <div className="text-lg font-semibold text-teal-700">
                                                    Total inspections HSE: {totalInspectionsHse}
                                                </div>
                                            </div>
                                            <div className="text-center bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-4 rounded-xl border border-purple-500/20">
                                                <div className="text-lg font-semibold text-purple-700">
                                                    Taux de fermeture des actions: {tauxFermetureActions.toFixed(2)}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center mt-8">
                                    <motion.button
                                        type="submit"
                                        disabled={processing}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <BarChart3 className="w-6 h-6" />
                                            <span>
                                        {processing 
                                            ? (data.edit_mode ? 'Modification...' : 'Soumission...') 
                                            : (data.edit_mode ? 'Modifier les statistiques' : 'Soumettre les statistiques')
                                        }
                                            </span>
                                </div>
                                        
                                        {/* Button Glow Effect */}
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                                    </motion.button>
                                </div>
                            </motion.form>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="text-center py-12"
                                >
                                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl max-w-md mx-auto"
                                         style={{
                                             background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                             backdropFilter: 'blur(20px)',
                                             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                                         }}
                                    >
                                        <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                                            <BarChart3 className="w-10 h-10 text-blue-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Statistiques déjà soumises</h3>
                                        <p className="text-gray-600 mb-8">
                                            Vous avez déjà soumis vos statistiques HSE pour aujourd'hui. 
                                            Vous pouvez consulter et modifier vos statistiques dans l'historique.
                                        </p>
                                            <Link
                                                href={route('contractant.hse-statistics.history')}
                                            className="group inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl text-blue-700 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/50 hover:text-blue-600 transition-all duration-300 backdrop-blur-sm"
                                            >
                                            <History className="w-5 h-5" />
                                            <span className="font-medium">Voir l'historique</span>
                                            </Link>
                                        </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
