import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, BarChart3, Clock, Building, Users, AlertTriangle, Shield, Award, Upload, X, Truck, Wrench, Download } from 'lucide-react';
import ContractantSidebar from '@/Components/ContractantSidebar';
import ContractantTopHeader from '@/Components/ContractantTopHeader';

export default function HseStatisticsEdit({ sites, hseStat, contractor }) {
    const [uploadedFiles, setUploadedFiles] = useState({});
    

    const { data, setData, put, post, processing, errors } = useForm({
        // 1) Période & Heures
        site_id: hseStat?.site_id || '',
        date: hseStat?.date ? hseStat.date.split('T')[0] : new Date().toISOString().split('T')[0],
        effectif_personnel: hseStat?.effectif_personnel || 0,
        heures_normales: hseStat?.heures_normales || 0,
        heures_supplementaires: hseStat?.heures_supplementaires || 0,
        effectif_passant_horaire_normal: hseStat?.effectif_passant_horaire_normal || 0,
        
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
        
        // File uploads
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
    });

    // Ensure form data is properly set when component mounts
    useEffect(() => {
        if (hseStat) {
            // Force set the data to ensure it's properly initialized
        setData(prevData => ({
            ...prevData,
            site_id: hseStat.site_id || '',
            date: hseStat.date ? hseStat.date.split('T')[0] : new Date().toISOString().split('T')[0]
        }));

            // Pre-load existing uploaded files
            const existingFiles = {};
            const fileFields = [
                'accident_report', 'inspection_generales_report',
                'inspection_engins_report', 'hygiene_base_vie_report', 'outils_electroportatifs_report',
                'inspection_electriques_report', 'extincteurs_report', 'protections_collectives_report',
                'epi_inspections_report', 'observations_hse_report', 'actions_correctives_cloturees_report'
            ];

            fileFields.forEach(field => {
                if (hseStat[field]) {
                    // Create a mock file object for display
                    let fileName = hseStat[field];
                    
                    // Handle different path formats
                    if (fileName.includes('/')) {
                        fileName = fileName.split('/').pop();
                    } else if (fileName.includes('\\')) {
                        fileName = fileName.split('\\').pop();
                    }
                    
                    // If fileName is still empty or looks like a path, use a default name
                    if (!fileName || fileName === hseStat[field]) {
                        fileName = `Report_${field}_${Date.now()}.pdf`;
                    }
                    
                    existingFiles[field] = {
                        name: fileName,
                        size: 0, // We don't have the actual size
                        type: 'application/pdf' // Default type
                    };
                }
            });

            setUploadedFiles(existingFiles);
        }
    }, [hseStat]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('Form submission started');
        console.log('Form data:', data);
        console.log('Uploaded files:', uploadedFiles);
        
        // Check if there are any files in the form data
        const fileFields = [
            'accident_report', 'inspection_report', 'inspection_generales_report',
            'inspection_engins_report', 'hygiene_base_vie_report', 'outils_electroportatifs_report',
            'inspection_electriques_report', 'extincteurs_report', 'protections_collectives_report',
            'epi_inspections_report', 'observations_hse_report', 'actions_correctives_cloturees_report'
        ];
        
        const filesInForm = fileFields.filter(field => data[field] instanceof File);
        console.log('Files in form data:', filesInForm);
        
        // Prepare data for submission - exclude null file fields to preserve existing files
        const submitData = { ...data };
        
        // Handle file fields - track which files are being deleted
        const fileFieldsForSubmission = [
            'accident_report', 'inspection_generales_report',
            'inspection_engins_report', 'hygiene_base_vie_report', 'outils_electroportatifs_report',
            'inspection_electriques_report', 'extincteurs_report', 'protections_collectives_report',
            'epi_inspections_report', 'observations_hse_report', 'actions_correctives_cloturees_report'
        ];
        
        // Track deleted files separately
        const deletedFiles = [];
        
        fileFieldsForSubmission.forEach(field => {
            if (submitData[field] === null) {
                // Track this file for deletion
                deletedFiles.push(field);
                // Remove from submitData to avoid confusion
                delete submitData[field];
            } else if (submitData[field] === undefined) {
                // Remove undefined values to preserve existing files
                delete submitData[field];
            }
        });
        
        // Add deleted files as individual fields with prefix
        if (deletedFiles.length > 0) {
            deletedFiles.forEach((field, index) => {
                submitData[`_delete_${field}`] = true;
            });
            console.log('Files to be deleted:', deletedFiles);
        }
        
        console.log('Final submission data:', submitData);
        console.log('Files to be deleted:', deletedFiles);
        
        // Use POST method for file uploads with method override
        post(route('contractant.hse-statistics.update.post', hseStat.id), {
            ...submitData,
            _method: 'PUT'
        });
    };

    const handleFileUpload = (fieldName, file) => {
        console.log('Uploading file:', fieldName, file);
        
        // Set the file in form data
        setData(fieldName, file);
        
        // Update the uploaded files display
        setUploadedFiles(prev => ({
            ...prev,
            [fieldName]: {
                name: file.name,
                size: file.size,
                type: file.type
            }
        }));
        
        console.log('File uploaded successfully:', fieldName);
        console.log('Current form data:', data);
    };

    const handleFileDelete = (fieldName) => {
        console.log('=== FILE DELETION DEBUG ===');
        console.log('Deleting file:', fieldName);
        console.log('Current data before deletion:', data[fieldName]);
        console.log('Current uploaded files before deletion:', uploadedFiles[fieldName]);
        
        setData(fieldName, null);
        setUploadedFiles(prev => {
            const newFiles = { ...prev };
            delete newFiles[fieldName];
            console.log('Updated uploaded files after deletion:', newFiles);
            console.log('Data field set to null:', fieldName);
            return newFiles;
        });
        
        console.log('=== END FILE DELETION DEBUG ===');
    };

    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) {
            return '🖼️';
        } else if (fileType === 'application/pdf') {
            return '📄';
        } else if (fileType.startsWith('text/')) {
            return '📝';
        } else if (fileType.includes('word') || fileType.includes('document')) {
            return '📄';
        } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
            return '📊';
        } else {
            return '📎';
        }
    };

    // Calculate totals
    const totalHeures = Number(data.heures_normales) + Number(data.heures_supplementaires);
    const totalAccidents = Number(data.acc_mortel) + Number(data.acc_arret) + Number(data.acc_soins_medicaux) + 
                          Number(data.acc_restriction_temporaire) + Number(data.premier_soin);
    const totalFormations = Number(data.excavation_sessions) + Number(data.points_chauds_sessions) + 
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
    
    const permisSpecifiques = Number(data.permis_excavation) + Number(data.permis_point_chaud) + 
                             Number(data.permis_espace_confine) + Number(data.permis_travail_hauteur) + 
                             Number(data.permis_levage) + Number(data.permis_consignation) + 
                             Number(data.permis_electrique_tension);
    const totalPermis = Number(data.permis_general) + permisSpecifiques;
    
    const totalInspectionsHse = Number(data.inspections_generales) + Number(data.inspections_engins) + 
                               Number(data.hygiene_base_vie) + Number(data.outils_electroportatifs_inspections) + 
                               Number(data.inspections_electriques) + Number(data.extincteurs) + 
                               Number(data.protections_collectives) + Number(data.epi_inspections);

    return (
        <>
            <Head title="Modifier Statistiques HSE" />

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
                        backRoute={route('contractant.hse-statistics.history')}
                        backLabel="Retour à l'historique"
                    />

                    {/* Main Content */}
                    <div className="relative z-10 px-6 pb-12 flex-1 pt-8">
                        <div className="max-w-7xl mx-auto">
                            {/* Page Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-center mb-12"
                            >
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Modifier Statistiques HSE
                                    </span>
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    Modifiez vos statistiques de santé, sécurité et environnement
                                </p>
                            </motion.div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                                {/* Total Hours */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="bg-white/80 backdrop-blur-xl border border-blue-200/50 rounded-2xl p-6 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                    <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">Total Heures</p>
                                            <p className="text-3xl font-bold text-gray-800">{totalHeures.toFixed(2)}</p>
                                    </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                                            <Clock className="w-6 h-6 text-gray-800" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Total Accidents */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    className="bg-white/80 backdrop-blur-xl border border-blue-200/50 rounded-2xl p-6 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">Total Accidents</p>
                                            <p className="text-3xl font-bold text-red-600">{totalAccidents}</p>
                                    </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                                            <AlertTriangle className="w-6 h-6 text-gray-800" />
                                </div>
                            </div>
                                </motion.div>

                                {/* Total Formations */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="bg-white/80 backdrop-blur-xl border border-blue-200/50 rounded-2xl p-6 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">Formations</p>
                                            <p className="text-3xl font-bold text-green-600">{totalFormations}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                            <Users className="w-6 h-6 text-gray-800" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Total Inspections */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                    className="bg-white/80 backdrop-blur-xl border border-blue-200/50 rounded-2xl p-6 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">Inspections</p>
                                            <p className="text-3xl font-bold text-purple-600">{totalInspectionsHse}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-gray-800" />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-8" key={`form-${hseStat?.id}-${hseStat?.site}-${hseStat?.date}`} encType="multipart/form-data">
                                {/* 1) Période & Heures */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                                            <Clock className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">1) Période & Heures</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Site</label>
                                            <select
                                                value={data.site_id}
                                                onChange={(e) => setData('site_id', e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                style={{ colorScheme: 'light' }}
                                                required
                                            >
                                                <option value="" className="bg-white text-gray-800">Sélectionner un site</option>
                                                {sites.map(site => (
                                                    <option key={site.id} value={site.id} className="bg-white text-gray-800">{site.name}</option>
                                                ))}
                                            </select>
                                            {errors.site_id && <p className="text-red-600 text-sm mt-1">{errors.site_id}</p>}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Date</label>
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
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Effectif du personnel</label>
                                            <input
                                                type="number"
                                                value={data.effectif_personnel}
                                                onChange={(e) => setData('effectif_personnel', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Heures normales</label>
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
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Heures supplémentaires</label>
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
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Effectif passant l'horaire normal</label>
                                            <input
                                                type="number"
                                                value={data.effectif_passant_horaire_normal}
                                                onChange={(e) => setData('effectif_passant_horaire_normal', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
                                        <div className="text-lg font-semibold text-gray-800">
                                            Total heures: {totalHeures.toFixed(2)} heures
                                        </div>
                                    </div>
                                </motion.div>

                                {/* 3) Accidents / Incidents */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.7 }}
                                    className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
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
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Accidents mortels</label>
                                            <input
                                                type="number"
                                                value={data.acc_mortel}
                                                onChange={(e) => setData('acc_mortel', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Accidents avec arrêt</label>
                                            <input
                                                type="number"
                                                value={data.acc_arret}
                                                onChange={(e) => setData('acc_arret', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Soins médicaux</label>
                                            <input
                                                type="number"
                                                value={data.acc_soins_medicaux}
                                                onChange={(e) => setData('acc_soins_medicaux', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Restriction temporaire</label>
                                            <input
                                                type="number"
                                                value={data.acc_restriction_temporaire}
                                                onChange={(e) => setData('acc_restriction_temporaire', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Premier soin</label>
                                            <input
                                                type="number"
                                                value={data.premier_soin}
                                                onChange={(e) => setData('premier_soin', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Presque accidents</label>
                                            <input
                                                type="number"
                                                value={data.presque_accident}
                                                onChange={(e) => setData('presque_accident', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Dommages matériels</label>
                                            <input
                                                type="number"
                                                value={data.dommage_materiel}
                                                onChange={(e) => setData('dommage_materiel', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Incidents environnementaux</label>
                                            <input
                                                type="number"
                                                value={data.incident_environnemental}
                                                onChange={(e) => setData('incident_environnemental', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl">
                                        <div className="text-lg font-semibold text-red-600">
                                            Total accidents: {totalAccidents}
                                        </div>
                                    </div>

                                    {/* File Upload for Accident Report */}
                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Rapport d'accident</label>
                                        <div className="relative">
                                        <input
                                            type="file"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) handleFileUpload('accident_report', file);
                                                }}
                                                className="hidden"
                                                id="accident_report"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            />
                                            <label
                                                htmlFor="accident_report"
                                                className="group relative inline-flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl text-red-600 hover:from-red-500/20 hover:to-orange-500/20 hover:border-red-400/50 hover:text-red-400 transition-all duration-300 text-sm font-medium backdrop-blur-sm shadow-lg hover:shadow-red-500/25 cursor-pointer"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(249,115,22,0.1) 100%)',
                                                    backdropFilter: 'blur(10px)',
                                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(239, 68, 68, 0.2)'
                                                }}
                                            >
                                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400 to-orange-400 opacity-0 group-hover:opacity-10 blur-sm transition-opacity duration-300" />
                                                <div className="relative z-10 flex items-center justify-center w-4 h-4">
                                                    <Upload className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                                <span className="relative z-10">Parcourir...</span>
                                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </label>
                                </div>
                                        
                                        {/* Display uploaded file */}
                                        {uploadedFiles.accident_report && (
                                            <div className="mt-3 p-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-2xl">{getFileIcon(uploadedFiles.accident_report.type)}</span>
                                                    <div>
                                                        <p className="text-red-600 font-medium text-sm">{uploadedFiles.accident_report.name}</p>
                                                        <p className="text-red-600 text-xs">
                                                            {uploadedFiles.accident_report.size > 0 
                                                                ? `${(uploadedFiles.accident_report.size / 1024).toFixed(1)} KB`
                                                                : 'Fichier existant'
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {hseStat.accident_report && (
                                                        <a
                                                            href={`/storage/${hseStat.accident_report}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1 text-red-600 hover:text-red-400 transition-colors duration-200"
                                                            title="Télécharger le fichier"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleFileDelete('accident_report')}
                                                        className="p-1 text-red-600 hover:text-red-600 transition-colors duration-200"
                                                        title="Supprimer le fichier"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>


                                {/* 4) Personnel & Sensibilisation */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                    className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg">
                                            <Users className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">4) Personnel & Sensibilisation</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Nombre de sensibilisations</label>
                                            <input
                                                type="number"
                                                value={data.nb_sensibilisations}
                                                onChange={(e) => setData('nb_sensibilisations', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Personnes sensibilisées</label>
                                            <input
                                                type="number"
                                                value={data.personnes_sensibilisees}
                                                onChange={(e) => setData('personnes_sensibilisees', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* 5) Formations & Inductions */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.9 }}
                                    className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg">
                                            <Award className="w-6 h-6 text-green-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">5) Formations & Inductions (Totaux)</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Inductions - Total personnes</label>
                                            <input
                                                type="number"
                                                value={data.inductions_total_personnes}
                                                onChange={(e) => setData('inductions_total_personnes', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Formations - Total personnes</label>
                                            <input
                                                type="number"
                                                value={data.formes_total_personnes}
                                                onChange={(e) => setData('formes_total_personnes', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Inductions - Volume heures</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.inductions_volume_heures}
                                                onChange={(e) => setData('inductions_volume_heures', parseFloat(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* 6) Formations par thème */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 1.0 }}
                                    className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                                            <BarChart3 className="w-6 h-6 text-purple-600" />
                                            </div>
                                        <h2 className="text-2xl font-bold text-gray-800">6) Formations par thème</h2>
                                    </div>

                                    {/* Travail en hauteur */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Travail en hauteur</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.travail_hauteur_sessions}
                                                    onChange={(e) => setData('travail_hauteur_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.travail_hauteur_participants}
                                                    onChange={(e) => setData('travail_hauteur_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.travail_hauteur_duree_h}
                                                    onChange={(e) => setData('travail_hauteur_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* SST */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">SST</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.sst_sessions}
                                                    onChange={(e) => setData('sst_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.sst_participants}
                                                    onChange={(e) => setData('sst_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.sst_duree_h}
                                                    onChange={(e) => setData('sst_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* EPI */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">EPI</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.epi_sessions}
                                                    onChange={(e) => setData('epi_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.epi_participants}
                                                    onChange={(e) => setData('epi_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.epi_duree_h}
                                                    onChange={(e) => setData('epi_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Points chauds */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Points chauds</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Sessions</label>
                                            <input
                                                type="number"
                                                value={data.points_chauds_sessions}
                                                onChange={(e) => setData('points_chauds_sessions', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Participants</label>
                                            <input
                                                type="number"
                                                value={data.points_chauds_participants}
                                                onChange={(e) => setData('points_chauds_participants', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Durée (h)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.points_chauds_duree_h}
                                                onChange={(e) => setData('points_chauds_duree_h', parseFloat(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    </div>

                                    {/* Espace confiné */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Espace confiné</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Sessions</label>
                                            <input
                                                type="number"
                                                value={data.espace_confine_sessions}
                                                onChange={(e) => setData('espace_confine_sessions', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Participants</label>
                                            <input
                                                type="number"
                                                value={data.espace_confine_participants}
                                                onChange={(e) => setData('espace_confine_participants', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Durée (h)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.espace_confine_duree_h}
                                                onChange={(e) => setData('espace_confine_duree_h', parseFloat(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    </div>

                                    {/* Levage */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Levage</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Sessions</label>
                                            <input
                                                type="number"
                                                value={data.levage_sessions}
                                                onChange={(e) => setData('levage_sessions', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Participants</label>
                                            <input
                                                type="number"
                                                value={data.levage_participants}
                                                onChange={(e) => setData('levage_participants', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Durée (h)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.levage_duree_h}
                                                onChange={(e) => setData('levage_duree_h', parseFloat(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    </div>

                                    {/* Modes opératoires */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Modes opératoires</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Sessions</label>
                                            <input
                                                type="number"
                                                value={data.modes_operatoires_sessions}
                                                onChange={(e) => setData('modes_operatoires_sessions', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Participants</label>
                                            <input
                                                type="number"
                                                value={data.modes_operatoires_participants}
                                                onChange={(e) => setData('modes_operatoires_participants', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Durée (h)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.modes_operatoires_duree_h}
                                                onChange={(e) => setData('modes_operatoires_duree_h', parseFloat(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    </div>

                                    {/* Permis SPA */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Permis SPA</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Sessions</label>
                                            <input
                                                type="number"
                                                value={data.permis_spa_sessions}
                                                onChange={(e) => setData('permis_spa_sessions', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Participants</label>
                                            <input
                                                type="number"
                                                value={data.permis_spa_participants}
                                                onChange={(e) => setData('permis_spa_participants', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Durée (h)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.permis_spa_duree_h}
                                                onChange={(e) => setData('permis_spa_duree_h', parseFloat(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    </div>

                                    {/* Outils électroportatifs */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Outils électroportatifs</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Sessions</label>
                                            <input
                                                type="number"
                                                value={data.outils_electroportatifs_sessions}
                                                onChange={(e) => setData('outils_electroportatifs_sessions', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Participants</label>
                                            <input
                                                type="number"
                                                value={data.outils_electroportatifs_participants}
                                                onChange={(e) => setData('outils_electroportatifs_participants', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Durée (h)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.outils_electroportatifs_duree_h}
                                                onChange={(e) => setData('outils_electroportatifs_duree_h', parseFloat(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    </div>

                                    {/* Excavation */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Excavation</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Sessions</label>
                                                <input
                                                    type="number"
                                                    value={data.excavation_sessions}
                                                    onChange={(e) => setData('excavation_sessions', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Participants</label>
                                                <input
                                                    type="number"
                                                    value={data.excavation_participants}
                                                    onChange={(e) => setData('excavation_participants', parseInt(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Durée (h)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.excavation_duree_h}
                                                    onChange={(e) => setData('excavation_duree_h', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary Totals */}
                                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                            <div>
                                                <div className="text-lg font-semibold text-purple-600">Total Sessions: {totalFormations}</div>
                                            </div>
                                            <div>
                                                <div className="text-lg font-semibold text-purple-600">Total Participants: {totalParticipants}</div>
                                            </div>
                                            <div>
                                                <div className="text-lg font-semibold text-purple-600">Total Heures: {totalHeuresFormations.toFixed(2)}h</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* 7) Permis & PTSR */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 1.1 }}
                                    className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg">
                                            <Shield className="w-6 h-6 text-orange-600" />
                                            </div>
                                        <h2 className="text-2xl font-bold text-gray-800">7) Permis & PTSR</h2>
                                            </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Permis général</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_general}
                                                    onChange={(e) => setData('permis_general', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Excavation</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_excavation}
                                                    onChange={(e) => setData('permis_excavation', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Point chaud</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_point_chaud}
                                                    onChange={(e) => setData('permis_point_chaud', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Espace confiné</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_espace_confine}
                                                    onChange={(e) => setData('permis_espace_confine', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Travail en hauteur</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_travail_hauteur}
                                                    onChange={(e) => setData('permis_travail_hauteur', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Levage</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_levage}
                                                    onChange={(e) => setData('permis_levage', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Consignation</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_consignation}
                                                    onChange={(e) => setData('permis_consignation', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Électrique tension</label>
                                                <input
                                                    type="number"
                                                    value={data.permis_electrique_tension}
                                                    onChange={(e) => setData('permis_electrique_tension', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                        </div>
                                        
                                    <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">PTSR Total</label>
                                                <input
                                                    type="number"
                                                    value={data.ptsr_total}
                                                    onChange={(e) => setData('ptsr_total', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">PTSR Contrôlés</label>
                                                <input
                                                    type="number"
                                                    value={data.ptsr_controles}
                                                    onChange={(e) => setData('ptsr_controles', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        
                                    <div className="mt-4 p-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl">
                                        <div className="text-lg font-semibold text-orange-300">
                                            Total permis: {totalPermis}
                                            </div>
                                        </div>
                                </motion.div>

                                {/* 8) Engins & Matériels */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 1.2 }}
                                    className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-lg">
                                            <Truck className="w-6 h-6 text-gray-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">8) Engins & Matériels</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Grue</label>
                                                <input
                                                    type="number"
                                                    value={data.grue}
                                                    onChange={(e) => setData('grue', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Niveleuse</label>
                                                <input
                                                    type="number"
                                                    value={data.niveleuse}
                                                    onChange={(e) => setData('niveleuse', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Pelle hydraulique</label>
                                                <input
                                                    type="number"
                                                    value={data.pelle_hydraulique}
                                                    onChange={(e) => setData('pelle_hydraulique', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Tractopelle</label>
                                                <input
                                                    type="number"
                                                    value={data.tractopelle}
                                                    onChange={(e) => setData('tractopelle', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Chargeuse</label>
                                                <input
                                                    type="number"
                                                    value={data.chargeuse}
                                                    onChange={(e) => setData('chargeuse', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Camion citerne</label>
                                                <input
                                                    type="number"
                                                    value={data.camion_citerne}
                                                    onChange={(e) => setData('camion_citerne', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Camion 8x4</label>
                                                <input
                                                    type="number"
                                                    value={data.camion_8x4}
                                                    onChange={(e) => setData('camion_8x4', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Camion remorque</label>
                                                <input
                                                    type="number"
                                                    value={data.camion_remorque}
                                                    onChange={(e) => setData('camion_remorque', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Grue mobile</label>
                                                <input
                                                    type="number"
                                                    value={data.grue_mobile}
                                                    onChange={(e) => setData('grue_mobile', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Grue tour</label>
                                                <input
                                                    type="number"
                                                    value={data.grue_tour}
                                                    onChange={(e) => setData('grue_tour', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Compacteur</label>
                                                <input
                                                    type="number"
                                                    value={data.compacteur}
                                                    onChange={(e) => setData('compacteur', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Finisseur enrobés</label>
                                                <input
                                                    type="number"
                                                    value={data.finisseur_enrobes}
                                                    onChange={(e) => setData('finisseur_enrobes', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Chariot élévateur</label>
                                                <input
                                                    type="number"
                                                    value={data.chariot_elevateur}
                                                    onChange={(e) => setData('chariot_elevateur', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Foreuse sondeuse</label>
                                                <input
                                                    type="number"
                                                    value={data.foreuse_sondeuse}
                                                    onChange={(e) => setData('foreuse_sondeuse', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Brise roche hydraulique</label>
                                                <input
                                                    type="number"
                                                    value={data.brise_roche_hydraulique}
                                                    onChange={(e) => setData('brise_roche_hydraulique', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Pompe béton</label>
                                                <input
                                                    type="number"
                                                    value={data.pompe_beton}
                                                    onChange={(e) => setData('pompe_beton', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Nacelle ciseaux</label>
                                                <input
                                                    type="number"
                                                    value={data.nacelle_ciseaux}
                                                    onChange={(e) => setData('nacelle_ciseaux', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                    </div>

                                    <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Compresseur air</label>
                                                <input
                                                    type="number"
                                                    value={data.compresseur_air}
                                                    onChange={(e) => setData('compresseur_air', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        
                                            <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Groupe électrogène mobile</label>
                                                <input
                                                    type="number"
                                                    value={data.groupe_electrogene_mobile}
                                                    onChange={(e) => setData('groupe_electrogene_mobile', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all duration-300"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                </motion.div>

                                {/* 9) Inspections & Observations */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 1.3 }}
                                    className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg">
                                            <Wrench className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">9) Inspections & Observations</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Inspections générales</label>
                                            <input
                                                type="number"
                                                value={data.inspections_generales}
                                                onChange={(e) => setData('inspections_generales', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Inspections engins</label>
                                            <input
                                                type="number"
                                                value={data.inspections_engins}
                                                onChange={(e) => setData('inspections_engins', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Hygiène base de vie</label>
                                            <input
                                                type="number"
                                                value={data.hygiene_base_vie}
                                                onChange={(e) => setData('hygiene_base_vie', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Outils électroportatifs</label>
                                            <input
                                                type="number"
                                                value={data.outils_electroportatifs_inspections}
                                                onChange={(e) => setData('outils_electroportatifs_inspections', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Inspections électriques</label>
                                            <input
                                                type="number"
                                                value={data.inspections_electriques}
                                                onChange={(e) => setData('inspections_electriques', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Extincteurs</label>
                                            <input
                                                type="number"
                                                value={data.extincteurs}
                                                onChange={(e) => setData('extincteurs', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Protections collectives</label>
                                            <input
                                                type="number"
                                                value={data.protections_collectives}
                                                onChange={(e) => setData('protections_collectives', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">EPI inspections</label>
                                            <input
                                                type="number"
                                                value={data.epi_inspections}
                                                onChange={(e) => setData('epi_inspections', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Observations HSE</label>
                                            <input
                                                type="number"
                                                value={data.observations_hse}
                                                onChange={(e) => setData('observations_hse', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Actions correctives clôturées</label>
                                            <input
                                                type="number"
                                                value={data.actions_correctives_cloturees}
                                                onChange={(e) => setData('actions_correctives_cloturees', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl">
                                        <div className="text-lg font-semibold text-indigo-600">
                                            Total inspections HSE: {totalInspectionsHse}
                                        </div>
                                    </div>

                                    {/* File Uploads for Inspection Reports */}
                                    <div className="mt-6 space-y-4">
                                        <h3 className="text-lg font-semibold text-indigo-600">Rapports d'inspection</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Inspection Générales Report */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Rapport inspections générales</label>
                                                <div className="relative">
                                                <input
                                                    type="file"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) handleFileUpload('inspection_generales_report', file);
                                                        }}
                                                        className="hidden"
                                                        id="inspection_generales_report"
                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    />
                                                    <label
                                                        htmlFor="inspection_generales_report"
                                                        className="group relative inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg text-indigo-600 hover:from-indigo-500/20 hover:to-purple-500/20 hover:border-indigo-400/50 hover:text-indigo-400 transition-all duration-300 text-xs font-medium backdrop-blur-sm shadow-lg hover:shadow-indigo-500/25 cursor-pointer"
                                                    >
                                                        <Upload className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                                        <span>Parcourir...</span>
                                                    </label>
                                                </div>
                                                {uploadedFiles.inspection_generales_report && (
                                                    <div className="mt-2 p-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-lg">{getFileIcon(uploadedFiles.inspection_generales_report.type)}</span>
                                                            <div>
                                                                <p className="text-indigo-600 font-medium text-xs">{uploadedFiles.inspection_generales_report.name}</p>
                                                                <p className="text-indigo-400 text-xs">{(uploadedFiles.inspection_generales_report.size / 1024).toFixed(1)} KB</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileDelete('inspection_generales_report')}
                                                            className="p-1 text-indigo-400 hover:text-indigo-600 transition-colors duration-200"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Engins Report */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Rapport inspections engins</label>
                                                <div className="relative">
                                                <input
                                                    type="file"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) handleFileUpload('inspection_engins_report', file);
                                                        }}
                                                        className="hidden"
                                                        id="inspection_engins_report"
                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    />
                                                    <label
                                                        htmlFor="inspection_engins_report"
                                                        className="group relative inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg text-indigo-600 hover:from-indigo-500/20 hover:to-purple-500/20 hover:border-indigo-400/50 hover:text-indigo-400 transition-all duration-300 text-xs font-medium backdrop-blur-sm shadow-lg hover:shadow-indigo-500/25 cursor-pointer"
                                                    >
                                                        <Upload className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                                        <span>Parcourir...</span>
                                                    </label>
                                                </div>
                                                {uploadedFiles.inspection_engins_report && (
                                                    <div className="mt-2 p-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-lg">{getFileIcon(uploadedFiles.inspection_engins_report.type)}</span>
                                                            <div>
                                                                <p className="text-indigo-600 font-medium text-xs">{uploadedFiles.inspection_engins_report.name}</p>
                                                                <p className="text-indigo-400 text-xs">{(uploadedFiles.inspection_engins_report.size / 1024).toFixed(1)} KB</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileDelete('inspection_engins_report')}
                                                            className="p-1 text-indigo-400 hover:text-indigo-600 transition-colors duration-200"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* EPI Report */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Rapport inspections EPI</label>
                                                <div className="relative">
                                                <input
                                                    type="file"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) handleFileUpload('epi_inspections_report', file);
                                                        }}
                                                        className="hidden"
                                                        id="epi_inspections_report"
                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    />
                                                    <label
                                                        htmlFor="epi_inspections_report"
                                                        className="group relative inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg text-indigo-600 hover:from-indigo-500/20 hover:to-purple-500/20 hover:border-indigo-400/50 hover:text-indigo-400 transition-all duration-300 text-xs font-medium backdrop-blur-sm shadow-lg hover:shadow-indigo-500/25 cursor-pointer"
                                                    >
                                                        <Upload className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                                        <span>Parcourir...</span>
                                                    </label>
                                                </div>
                                                {uploadedFiles.epi_inspections_report && (
                                                    <div className="mt-2 p-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-lg">{getFileIcon(uploadedFiles.epi_inspections_report.type)}</span>
                                                            <div>
                                                                <p className="text-indigo-600 font-medium text-xs">{uploadedFiles.epi_inspections_report.name}</p>
                                                                <p className="text-indigo-400 text-xs">{(uploadedFiles.epi_inspections_report.size / 1024).toFixed(1)} KB</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileDelete('epi_inspections_report')}
                                                            className="p-1 text-indigo-400 hover:text-indigo-600 transition-colors duration-200"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Observations HSE Report */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Rapport observations HSE</label>
                                                <div className="relative">
                                                <input
                                                    type="file"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) handleFileUpload('observations_hse_report', file);
                                                        }}
                                                        className="hidden"
                                                        id="observations_hse_report"
                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    />
                                                    <label
                                                        htmlFor="observations_hse_report"
                                                        className="group relative inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg text-indigo-600 hover:from-indigo-500/20 hover:to-purple-500/20 hover:border-indigo-400/50 hover:text-indigo-400 transition-all duration-300 text-xs font-medium backdrop-blur-sm shadow-lg hover:shadow-indigo-500/25 cursor-pointer"
                                                    >
                                                        <Upload className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                                        <span>Parcourir...</span>
                                                    </label>
                                                </div>
                                                {uploadedFiles.observations_hse_report && (
                                                    <div className="mt-2 p-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-lg">{getFileIcon(uploadedFiles.observations_hse_report.type)}</span>
                                                            <div>
                                                                <p className="text-indigo-600 font-medium text-xs">{uploadedFiles.observations_hse_report.name}</p>
                                                                <p className="text-indigo-400 text-xs">{(uploadedFiles.observations_hse_report.size / 1024).toFixed(1)} KB</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileDelete('observations_hse_report')}
                                                            className="p-1 text-indigo-400 hover:text-indigo-600 transition-colors duration-200"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Hygiene Base Vie Report */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Rapport hygiène base de vie</label>
                                                <div className="relative">
                                                <input
                                                    type="file"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) handleFileUpload('hygiene_base_vie_report', file);
                                                        }}
                                                        className="hidden"
                                                        id="hygiene_base_vie_report"
                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    />
                                                    <label
                                                        htmlFor="hygiene_base_vie_report"
                                                        className="group relative inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg text-indigo-600 hover:from-indigo-500/20 hover:to-purple-500/20 hover:border-indigo-400/50 hover:text-indigo-400 transition-all duration-300 text-xs font-medium backdrop-blur-sm shadow-lg hover:shadow-indigo-500/25 cursor-pointer"
                                                    >
                                                        <Upload className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                                        <span>Parcourir...</span>
                                                    </label>
                                                </div>
                                                {uploadedFiles.hygiene_base_vie_report && (
                                                    <div className="mt-2 p-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-lg">{getFileIcon(uploadedFiles.hygiene_base_vie_report.type)}</span>
                                                            <div>
                                                                <p className="text-indigo-600 font-medium text-xs">{uploadedFiles.hygiene_base_vie_report.name}</p>
                                                                <p className="text-indigo-400 text-xs">{(uploadedFiles.hygiene_base_vie_report.size / 1024).toFixed(1)} KB</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileDelete('hygiene_base_vie_report')}
                                                            className="p-1 text-indigo-400 hover:text-indigo-600 transition-colors duration-200"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Outils Electroportatifs Report */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Rapport outils électroportatifs</label>
                                                <div className="relative">
                                                <input
                                                    type="file"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) handleFileUpload('outils_electroportatifs_report', file);
                                                        }}
                                                        className="hidden"
                                                        id="outils_electroportatifs_report"
                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    />
                                                    <label
                                                        htmlFor="outils_electroportatifs_report"
                                                        className="group relative inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg text-indigo-600 hover:from-indigo-500/20 hover:to-purple-500/20 hover:border-indigo-400/50 hover:text-indigo-400 transition-all duration-300 text-xs font-medium backdrop-blur-sm shadow-lg hover:shadow-indigo-500/25 cursor-pointer"
                                                    >
                                                        <Upload className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                                        <span>Parcourir...</span>
                                                    </label>
                                                </div>
                                                {uploadedFiles.outils_electroportatifs_report && (
                                                    <div className="mt-2 p-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-lg">{getFileIcon(uploadedFiles.outils_electroportatifs_report.type)}</span>
                                                            <div>
                                                                <p className="text-indigo-600 font-medium text-xs">{uploadedFiles.outils_electroportatifs_report.name}</p>
                                                                <p className="text-indigo-400 text-xs">{(uploadedFiles.outils_electroportatifs_report.size / 1024).toFixed(1)} KB</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileDelete('outils_electroportatifs_report')}
                                                            className="p-1 text-indigo-400 hover:text-indigo-600 transition-colors duration-200"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Inspections Electriques Report */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Rapport inspections électriques</label>
                                                <div className="relative">
                                                <input
                                                    type="file"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) handleFileUpload('inspection_electriques_report', file);
                                                        }}
                                                        className="hidden"
                                                        id="inspection_electriques_report"
                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    />
                                                    <label
                                                        htmlFor="inspection_electriques_report"
                                                        className="group relative inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg text-indigo-600 hover:from-indigo-500/20 hover:to-purple-500/20 hover:border-indigo-400/50 hover:text-indigo-400 transition-all duration-300 text-xs font-medium backdrop-blur-sm shadow-lg hover:shadow-indigo-500/25 cursor-pointer"
                                                    >
                                                        <Upload className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                                        <span>Parcourir...</span>
                                                    </label>
                                                </div>
                                                {uploadedFiles.inspection_electriques_report && (
                                                    <div className="mt-2 p-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-lg">{getFileIcon(uploadedFiles.inspection_electriques_report.type)}</span>
                                                            <div>
                                                                <p className="text-indigo-600 font-medium text-xs">{uploadedFiles.inspection_electriques_report.name}</p>
                                                                <p className="text-indigo-400 text-xs">{(uploadedFiles.inspection_electriques_report.size / 1024).toFixed(1)} KB</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileDelete('inspection_electriques_report')}
                                                            className="p-1 text-indigo-400 hover:text-indigo-600 transition-colors duration-200"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Extincteurs Report */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Rapport extincteurs</label>
                                                <div className="relative">
                                                <input
                                                    type="file"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) handleFileUpload('extincteurs_report', file);
                                                        }}
                                                        className="hidden"
                                                        id="extincteurs_report"
                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    />
                                                    <label
                                                        htmlFor="extincteurs_report"
                                                        className="group relative inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg text-indigo-600 hover:from-indigo-500/20 hover:to-purple-500/20 hover:border-indigo-400/50 hover:text-indigo-400 transition-all duration-300 text-xs font-medium backdrop-blur-sm shadow-lg hover:shadow-indigo-500/25 cursor-pointer"
                                                    >
                                                        <Upload className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                                        <span>Parcourir...</span>
                                                    </label>
                                                </div>
                                                {uploadedFiles.extincteurs_report && (
                                                    <div className="mt-2 p-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-lg">{getFileIcon(uploadedFiles.extincteurs_report.type)}</span>
                                                            <div>
                                                                <p className="text-indigo-600 font-medium text-xs">{uploadedFiles.extincteurs_report.name}</p>
                                                                <p className="text-indigo-400 text-xs">{(uploadedFiles.extincteurs_report.size / 1024).toFixed(1)} KB</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileDelete('extincteurs_report')}
                                                            className="p-1 text-indigo-400 hover:text-indigo-600 transition-colors duration-200"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Protections Collectives Report */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Rapport protections collectives</label>
                                                <div className="relative">
                                                <input
                                                    type="file"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) handleFileUpload('protections_collectives_report', file);
                                                        }}
                                                        className="hidden"
                                                        id="protections_collectives_report"
                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    />
                                                    <label
                                                        htmlFor="protections_collectives_report"
                                                        className="group relative inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg text-indigo-600 hover:from-indigo-500/20 hover:to-purple-500/20 hover:border-indigo-400/50 hover:text-indigo-400 transition-all duration-300 text-xs font-medium backdrop-blur-sm shadow-lg hover:shadow-indigo-500/25 cursor-pointer"
                                                    >
                                                        <Upload className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                                        <span>Parcourir...</span>
                                                    </label>
                                            </div>
                                                {uploadedFiles.protections_collectives_report && (
                                                    <div className="mt-2 p-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-lg">{getFileIcon(uploadedFiles.protections_collectives_report.type)}</span>
                                                            <div>
                                                                <p className="text-indigo-600 font-medium text-xs">{uploadedFiles.protections_collectives_report.name}</p>
                                                                <p className="text-indigo-400 text-xs">{(uploadedFiles.protections_collectives_report.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileDelete('protections_collectives_report')}
                                                            className="p-1 text-indigo-400 hover:text-indigo-600 transition-colors duration-200"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                    </div>
                                    
                                            {/* Actions Correctives Clôturées Report */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">Rapport actions correctives clôturées</label>
                                                <div className="relative">
                                                <input
                                                    type="file"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) handleFileUpload('actions_correctives_cloturees_report', file);
                                                        }}
                                                        className="hidden"
                                                        id="actions_correctives_cloturees_report"
                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    />
                                                    <label
                                                        htmlFor="actions_correctives_cloturees_report"
                                                        className="group relative inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg text-indigo-600 hover:from-indigo-500/20 hover:to-purple-500/20 hover:border-indigo-400/50 hover:text-indigo-400 transition-all duration-300 text-xs font-medium backdrop-blur-sm shadow-lg hover:shadow-indigo-500/25 cursor-pointer"
                                                    >
                                                        <Upload className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                                        <span>Parcourir...</span>
                                                    </label>
                                                </div>
                                                {uploadedFiles.actions_correctives_cloturees_report && (
                                                    <div className="mt-2 p-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-lg">{getFileIcon(uploadedFiles.actions_correctives_cloturees_report.type)}</span>
                                                            <div>
                                                                <p className="text-indigo-600 font-medium text-xs">{uploadedFiles.actions_correctives_cloturees_report.name}</p>
                                                                <p className="text-indigo-400 text-xs">{(uploadedFiles.actions_correctives_cloturees_report.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                                </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileDelete('actions_correctives_cloturees_report')}
                                                            className="p-1 text-indigo-400 hover:text-indigo-600 transition-colors duration-200"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                            </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                                </motion.div>

                                {/* Submit Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 1.2 }}
                                    className="flex justify-center"
                                >
                                    <motion.button
                                        type="submit"
                                        disabled={processing}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Save className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                                            <span>{processing ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
                                </div>
                                        
                                        {/* Button Glow Effect */}
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                                    </motion.button>
                                </motion.div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}