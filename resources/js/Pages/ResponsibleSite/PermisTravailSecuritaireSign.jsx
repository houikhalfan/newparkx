import React, { useEffect, useMemo, useState, useRef } from "react";
import { useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";

/* --------------------------- UI building blocks --------------------------- */
const BRAND = "#0E8A5D"; // ParkX green

// Fixed Text component with forwardRef
const Text = React.forwardRef(({ disabled, ...rest }, ref) => (
  <input
    ref={ref}
    {...rest}
    disabled={disabled}
    className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-all duration-200 shadow-sm ${
      disabled 
        ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
        : "bg-white border-gray-300 focus:ring-2 focus:border-[#0E8A5D] focus:ring-[#0E8A5D]"
    }`}
  />
));

const Area = ({ rows = 3, disabled, ...rest }) => (
  <textarea
    rows={rows}
    disabled={disabled}
    {...rest}
    className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-all duration-200 shadow-sm ${
      disabled 
        ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
        : "bg-white border-gray-300 focus:ring-2 focus:border-[#0E8A5D] focus:ring-[#0E8A5D]"
    }`}
  />
);

const FieldError = ({ children }) =>
  children ? <p className="mt-1 text-xs text-rose-600">{children}</p> : null;

const CheckLine = ({ children, checked, onChange, disabled }) => (
  <label
    className={`flex items-start gap-2 py-1 ${
      disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
    }`}
  >
    <input
      type="checkbox"
      className="mt-0.5 h-4 w-4 rounded border-gray-300 focus:ring-2"
      style={{ accentColor: BRAND, "--tw-ring-color": BRAND }}
      checked={!!checked}
      onChange={(e) => onChange?.(e.target.checked)}
      disabled={disabled}
    />
    <span className="text-sm text-gray-800 leading-5">{children}</span>
  </label>
);

/** Signature picker that also previews stored string paths in readonly mode */
function SignaturePicker({ id, label, value, onChange, disabled, error }) {
  const [preview, setPreview] = useState(null);
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const isFile = value instanceof File;
  const isStoredPath = typeof value === "string" && value.trim().length > 0;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-800 mb-1"
      >
        {label}
      </label>

      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg"
        disabled={disabled}
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          onChange?.(f);
          setPreview(f ? URL.createObjectURL(f) : null);
        }}
        className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-2 file:text-white transition-all duration-200"
        style={{ "--brand": BRAND, accentColor: BRAND }}
      />

      <style>{`
        #${id}::file-selector-button{
          background: ${BRAND};
        }
        #${id}:hover::file-selector-button{
          filter: brightness(0.95);
        }
        #${id}:disabled::file-selector-button{
          opacity:.6; cursor:not-allowed;
        }
      `}</style>

      {/* Live File preview */}
      {isFile && (
        <img
          src={preview || URL.createObjectURL(value)}
          alt="Signature"
          className="mt-2 h-20 w-auto rounded border border-gray-200 bg-white shadow-sm"
        />
      )}

      {/* Stored path preview in readonly */}
      {!isFile && isStoredPath && (
        <img
          src={`/storage/${value}`}
          alt="Signature"
          className="mt-2 h-20 w-auto rounded border border-gray-200 bg-white shadow-sm"
        />
      )}

      <FieldError>{error}</FieldError>
    </div>
  );
}

const FormCard = ({ title, children }) => (
  <div className="rounded-xl border border-gray-300 bg-white shadow-md overflow-hidden">
    <div className="px-4 py-2" style={{ backgroundColor: BRAND }}>
      <h2 className="text-[13px] font-semibold tracking-wide text-white uppercase">
        {title}
      </h2>
    </div>
    <div className="p-4 lg:p-6">{children}</div>
  </div>
);

const Row = ({ label, children, className = "" }) => (
  <div
    className={[
      "flex flex-col gap-2 py-3 border-b last:border-b-0 lg:flex-row lg:items-start",
      className,
    ].join(" ")}
  >
    <div className="lg:w-72 shrink-0 pt-1.5">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
    </div>
    <div className="lg:flex-1 min-w-0">{children}</div>
  </div>
);

/* ================================= PAGE ================================== */
export default function PermisTravailSecuritaireSign({
  permis,
  sites = [],
  flash = {},
  readonly = false,
  showSignatureResponsableSite = true,
}) {
  const cmParkxNomRef = useRef(null);
  const cmParkxDateRef = useRef(null);

  // Fix cursor focus issue
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cmParkxNomRef.current) {
        cmParkxNomRef.current.focus();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  /* ------------------------------ Date Formatter ------------------------------ */
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return '';
    
    // Si c'est déjà une string au bon format
    if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateValue;
    }
    
    // Si c'est un objet Date JavaScript
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split('T')[0];
    }
    
    // Si c'est une string de date (venant de Laravel)
    try {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (error) {
      console.warn('Error parsing date:', dateValue, error);
    }
    
    return '';
  };

  /* ------------------------------ Options ------------------------------ */
  const optActivite = useMemo(
    () => [
      { key: "travail_chaud", label: "Travail à chaud" },
      { key: "espace_confine", label: "Espace confiné" },
      { key: "consignation", label: "Consignation/Déconsignation" },
      { key: "demolition", label: "Demolition" },
      { key: "echafaudage", label: "Échafaudage" },
      { key: "lignes_elec", label: "Travail a proximité de lignes électriques" },
      { key: "structures_temp", label: "Structures temporaires pour les activités à haut risque" },
      { key: "moins_3m_eau", label: "Travailler moins de 3m de la ligne d'eau ou littoral" },
      { key: "plateforme_aerienne", label: "Travail avec une plate forme aérienne motorisée" },
      { key: "excavation", label: "Excavation" },
      { key: "dynamitage", label: "Dynamitage" },
      { key: "fermeture_route", label: "Fermeture de la route" },
      { key: "levage_personnel", label: "Levage du personnel" },
      { key: "radiographie", label: "Radiographie" },
      { key: "hydrotest", label: "HydroTest" },
      { key: "lavage_critique", label: "Lavage critique" },
      { key: "mise_service", label: "Mise en servie" },
      { key: "autre", label: "Autre" },
    ],
    []
  );

  const optPermisSupp = useMemo(
    () => [
      { key: "travail_chaud", label: "Travail à chaud" },
      { key: "espace_confine", label: "Espace confiné" },
      { key: "excavation", label: "Excavation" },
      { key: "consignation", label: "Consignation/déconsignation" },
      { key: "chute", label: "Protection contre le chute" },
      { key: "scan", label: "SCAN REPORT" },
      { key: "isolement", label: "ISOLATION DRAWING" },
      { key: "levage", label: "Étude de Levage" },
      { key: "deviation", label: "Plan de fermeture de la route" },
      { key: "radio", label: "Plan de radiographie" },
      { key: "hydro", label: "Plan d'hydro-test" },
      { key: "lavage_critique", label: "Lavage critique" },
    ],
    []
  );

  const optDangers = useMemo(
    () => [
      { key: "glisser", label: "Glisser/trébucher/tomber" },
      { key: "acces_difficile", label: "Aire de travail difficilement accessible" },
      { key: "chute_hauteur", label: "Chute en hauteur" },
      { key: "mobile_rotatif", label: "Equipement mobile/rotatif" },
      { key: "coupe_outil", label: "Coupe/perforer (Bords tranchants, outils de coupe, clous)" },
      { key: "frapper", label: "Frapper par/Se frapper contre (projectiles, bris d'équipement, équipement pneumatique, et à air comprimé, levage et gréage, empilage, équipement lourd)" },
      { key: "pression_souffle", label: "Equipement sous pression/sous vide" },
      { key: "brulure", label: "Brûlure de chaleur/de froid" },
      { key: "vapeurs", label: "Vapeurs inflammable/combustibles" },
      { key: "elec", label: "Danger électriques" },
      { key: "bruit", label: "Bruit" },
      { key: "ergonomie", label: "Ergonomie (position de travail, levage manuel, éclairage)" },
      { key: "produits", label: "Produits chimiques (inhalation, contact cutané, ingestion)" },
      { key: "faible_oxygene", label: "Faible concentration en oxygène" },
      { key: "atmosphere", label: "Atmosphère dangereuse" },
      { key: "rayonnements", label: "Radiations ionisantes/non-ionisantes" },
      { key: "stress_thermique", label: "Heat/Cold stress" },
      { key: "poussieres", label: "Poussières et contaminats dans l'air" },
      { key: "meteo", label: "Conditions météorologiques" },
      { key: "contamination_sol", label: "Contamination des sols/de l'eau de surfaillance" },
      { key: "simultane", label: "Opérations simultanées" },
      { key: "autre", label: "Autre" },
      { key: "aucun", label: "Aucun" },
    ],
    []
  );

  const optEpiChimique = useMemo(
    () => [
      { key: "goggles", label: "Goggles" },
      { key: "ecran", label: "Ecran facial" },
      { key: "gants", label: "Gants (soudage, résistant à la chaleur, aux produits chimiques, aux courbes, aux couleurs)" },
      { key: "auditive", label: "Protection auditive" },
      { key: "arc_electrique", label: "Equipement de protection de l'Arc électrique" },
      { key: "chutes", label: "Protection contre les chutes (line de vie, harnais)" },
      { key: "flottaison", label: "Equipement de flottaison (veste, combinaison)" },
    ],
    []
  );

  const optEpiResp = useMemo(
    () => [
      { key: "filtres", label: "Appareils à filtres à particules" },
      { key: "cartouches", label: "Appareils à cartouches chimiques" },
      { key: "epuration", label: "Appareils à épuration d'air pour le soudage" },
      { key: "papr", label: "Appareils à épuration d'air motorisés (PAPR)" },
      { key: "adduction", label: "Appareils à adduction d'air (Type C)" },
    ],
    []
  );

  const optEquiptComms = useMemo(
    () => [
      { key: "radios", label: "Radio(s)" },
      { key: "signaleurs", label: "Signaleurs" },
      { key: "avertissement", label: "Signaux d'avertissement" },
      { key: "perimetre", label: "Perimètre de sécurité" },
    ],
    []
  );

  const optEquiptBarriers = useMemo(
    () => [
      { key: "barricades", label: "Barricades" },
      { key: "debit", label: "Indicateur de débit" },
      { key: "manometre", label: "Manomètre" },
      { key: "surete", label: "Soupape de sûreté" },
      { key: "extincteur", label: "Extincteur" },
    ],
    []
  );

  const optQualiteAir = useMemo(
    () => [
      { key: "detecteur", label: "Détecteur de gaz/oxygène" },
      { key: "echant", label: "Équipement d'échantillonnage" },
      { key: "ventilation", label: "Ventilation mécanique" },
      { key: "anemometre", label: "Anémomètre(vitesse du vent)" },
    ],
    []
  );

  const optEtincelles = useMemo(
    () => [
      { key: "anti_deflag", label: "Outils anti-déflagrants" },
      { key: "mise_terre", label: "Courroies de mise à la terre" },
      { key: "anti_explosion", label: "Éclairage anti-explosion" },
      { key: "autres", label: "Autres" },
    ],
    []
  );

  /* ------------------------------ Form State ------------------------------ */
  const initialState = {
    // ParkX Signatures (editable by responsible)
    cm_parkx_nom: permis?.cm_parkx_nom || "",
    cm_parkx_date: formatDateForInput(permis?.cm_parkx_date) || "",
    cm_parkx_file: permis?.cm_parkx_file || null,

    hse_parkx_nom: permis?.hse_parkx_nom || "",
    hse_parkx_date: formatDateForInput(permis?.hse_parkx_date) || "",
    hse_parkx_file: permis?.hse_parkx_file || null,

    // All other fields (readonly)
    numero_permis: permis?.numero_permis || "",
    site_id: permis?.site_id || "",
    duree_de: formatDateForInput(permis?.duree_de) || "",
    duree_a: formatDateForInput(permis?.duree_a) || "",
    description: permis?.description || "",
    plan_securitaire_par: permis?.plan_securitaire_par || "",
    date_analyse: formatDateForInput(permis?.date_analyse) || "",
    demandeur: permis?.demandeur || "",
    contractant: permis?.contractant || "",
    meme_que_demandeur: !!permis?.meme_que_demandeur,

    // Groupes
    activites: Array.isArray(permis?.activites) ? permis.activites : permis?.activites ? [permis.activites] : [],
    permis_supp: Array.isArray(permis?.permis_supp) ? permis.permis_supp : permis?.permis_supp ? [permis.permis_supp] : [],
    dangers: Array.isArray(permis?.dangers) ? permis.dangers : permis?.dangers ? [permis.dangers] : [],
    danger_autre: permis?.danger_autre || "",
    activite_autre: permis?.activite_autre || "",

    // EPI
    epi_sans_additionnel: !!permis?.epi_sans_additionnel,
    epi_chimique: Array.isArray(permis?.epi_chimique) ? permis.epi_chimique : permis?.epi_chimique ? [permis.epi_chimique] : [],
    epi_respiratoire: Array.isArray(permis?.epi_respiratoire) ? permis.epi_respiratoire : permis?.epi_respiratoire ? [permis.epi_respiratoire] : [],

    // Équipement
    equip_comms: Array.isArray(permis?.equip_comms) ? permis.equip_comms : permis?.equip_comms ? [permis.equip_comms] : [],
    equip_barrieres: Array.isArray(permis?.equip_barrieres) ? permis.equip_barrieres : permis?.equip_barrieres ? [permis.equip_barrieres] : [],
    equip_qualite_air: Array.isArray(permis?.equip_qualite_air) ? permis.equip_qualite_air : permis?.equip_qualite_air ? [permis.equip_qualite_air] : [],
    equip_etincelles: Array.isArray(permis?.equip_etincelles) ? permis.equip_etincelles : permis?.equip_etincelles ? [permis.equip_etincelles] : [],

    // Commentaires
    commentaires: permis?.commentaires || "",

    // Confirmations
    confirmation_travail: !!permis?.confirmation_travail,
    confirmation_conditions: !!permis?.confirmation_conditions,
    confirmation_equipement: !!permis?.confirmation_equipement,
    confirmation_epi: !!permis?.confirmation_epi,

    // Signatures contractant
    sig_resp_construction_nom: permis?.sig_resp_construction_nom || "",
    sig_resp_construction_date: formatDateForInput(permis?.sig_resp_construction_date) || "",
    sig_resp_construction_file: permis?.sig_resp_construction_file || null,

    sig_resp_hse_nom: permis?.sig_resp_hse_nom || "",
    sig_resp_hse_date: formatDateForInput(permis?.sig_resp_hse_date) || "",
    sig_resp_hse_file: permis?.sig_resp_hse_file || null,
  };

  const { data, setData, post, processing, errors } = useForm(initialState);

  // Debug: Afficher les dates pour vérification
  useEffect(() => {
    console.log('Dates from permis:', {
      duree_de: permis?.duree_de,
      duree_a: permis?.duree_a,
      date_analyse: permis?.date_analyse,
      formatted_duree_de: formatDateForInput(permis?.duree_de),
      formatted_duree_a: formatDateForInput(permis?.duree_a),
      formatted_date_analyse: formatDateForInput(permis?.date_analyse),
    });
  }, [permis]);

  const validateForm = () => {
    const requiredFields = [
      "cm_parkx_nom", "cm_parkx_date", "cm_parkx_file"
    ];

    for (let f of requiredFields) {
      if (!data[f] || (typeof data[f] === "string" && data[f].trim() === "")) {
        alert(`Veuillez remplir le champ requis: ${f}`);
        return false;
      }
    }

    return true;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    post(route("responsibleSite.permis-travail-securitaire.sign", permis.id), {
      data,
      forceFormData: true,
      onSuccess: () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    });
  };

  /* ----------------------------------- UI ---------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-emerald-400/10 rounded-full blur-2xl animate-pulse" />
      </div>

      {/* Modern Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Logo & Brand */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-8 sm:h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse" />
                </motion.div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    PERMIS DE TRAVAIL SÉCURITAIRE
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">Gestion et signatures du permis</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                {/* Back Button */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="w-full sm:w-auto"
                >
                  <a
                    href="/dashboard"
                    className="group relative inline-flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg w-full text-center"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m12 19-7-7 7-7" />
                      <path d="M19 12H5" />
                    </svg>
                    <span className="text-sm sm:text-base">Retour au Tableau de Bord</span>
                  </a>
                </motion.div>

                {/* User Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 shadow-lg w-full sm:w-auto justify-center sm:justify-start"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="text-slate-800">
                    <p className="text-xs sm:text-sm font-medium">Responsable de site</p>
                    <p className="text-xs text-slate-600">ParkX</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 py-4 sm:py-8 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-6 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-slate-800 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              PERMIS DE TRAVAIL SÉCURITAIRE
            </h2>
            <p className="text-sm sm:text-xl text-slate-600 max-w-3xl mx-auto px-2">
              Validation Construction Manager ParkX
            </p>
          </motion.div>

          {/* Flash */}
          <AnimatePresence>
            {flash?.success && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow"
              >
                {flash.success}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
            {/* Header with Numbers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20 mb-6 sm:mb-8"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800">Informations du permis</h3>
                  <p className="text-xs sm:text-sm text-slate-600">Numéros d'identification</p>
                </div>
                
                <div className="w-full lg:w-auto">
                  <div className="text-xs sm:text-sm text-slate-600 mb-1">NUMÉRO DE PERMIS</div>
                  <Text
                    disabled
                    value={data.numero_permis}
                    className="text-xs sm:text-sm"
                  />
                </div>
              </div>
            </motion.div>

            {/* ParkX Signatures - Only this section is editable */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <FormCard title="Validation ParkX">
                <Row label="Construction manager ParkX">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="space-y-3">
                      <Text
                        ref={cmParkxNomRef}
                        placeholder="Nom (à compléter par ParkX)"
                        disabled={false}
                        value={data.cm_parkx_nom || ""}
                        onChange={(e) => setData("cm_parkx_nom", e.target.value)}
                        onFocus={(e) => e.target.select()}
                      />
                      <Text
                        type="date"
                        ref={cmParkxDateRef}
                        disabled={false}
                        value={data.cm_parkx_date || ""}
                        onChange={(e) => setData("cm_parkx_date", e.target.value)}
                        onFocus={(e) => e.target.select()}
                      />
                    </div>
                    <SignaturePicker
                      id="sig_cm_parkx"
                      label="Signature (JPG/PNG)"
                      value={data.cm_parkx_file}
                      onChange={(f) => setData("cm_parkx_file", f)}
                      disabled={false}
                      error={errors.cm_parkx_file}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FieldError>{errors.cm_parkx_nom}</FieldError>
                    <FieldError>{errors.cm_parkx_date}</FieldError>
                  </div>
                </Row>

                <Row label="HSE Manager ParkX">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 opacity-60">
                    <div className="space-y-3">
                      <Text disabled placeholder="Nom (à compléter par ParkX)" />
                      <Text disabled placeholder="Date —" />
                    </div>
                    <SignaturePicker
                      id="sig_hse_parkx"
                      label="Signature (désactivée)"
                      value={null}
                      onChange={() => {}}
                      disabled
                    />
                  </div>
                </Row>
              </FormCard>
            </motion.div>

            {/* All other sections are disabled/readonly */}
            <FormCard title="Identification">
              <Row label="Endroit / Plan">
                <select
                  value={data.site_id}
                  disabled={true}
                  className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                >
                  <option value="" disabled>
                    Choisir un site…
                  </option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Row>

              <Row label="Durée">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Text
                    type="date"
                    disabled={true}
                    value={data.duree_de}
                  />
                  <Text
                    type="date"
                    disabled={true}
                    value={data.duree_a}
                  />
                </div>
              </Row>

              <Row label="Description du travail">
                <Area
                  disabled={true}
                  value={data.description}
                  rows={4}
                />
              </Row>

              <Row label="Plan sécuritaire de la tâche réalisé par">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Text
                    disabled={true}
                    value={data.plan_securitaire_par}
                  />
                  <Text
                    type="date"
                    disabled={true}
                    value={data.date_analyse}
                  />
                </div>
              </Row>

              <Row label="Demandeur du permis">
                <Text
                  disabled={true}
                  value={data.demandeur}
                />
              </Row>

              <Row label="Contractant effectuant le travail">
                <div>
                  <Text
                    disabled={true}
                    value={data.contractant}
                  />
                </div>
              </Row>
            </FormCard>

            {/* TYPE D'ACTIVITE */}
            <FormCard title="TYPE D'ACTIVITE">
              <Row label="Activités sélectionnées">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {optActivite.map((o) => (
                    data.activites.includes(o.key) && (
                      <CheckLine
                        key={o.key}
                        checked={true}
                        disabled={true}
                      >
                        <span className="text-xs sm:text-sm">{o.label}</span>
                      </CheckLine>
                    )
                  ))}
                  {data.activites.includes("autre") && data.activite_autre && (
                    <div className="ml-6 text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      Autre: {data.activite_autre}
                    </div>
                  )}
                </div>
              </Row>
            </FormCard>

            {/* PERMIS SUPPLEMENTAIRES */}
            <FormCard title="PERMIS DE TRAVAIL SUPPLEMENTAIRE REQUIS">
              <Row label="Permis supplémentaires">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {optPermisSupp.map((o) => (
                    data.permis_supp.includes(o.key) && (
                      <CheckLine
                        key={o.key}
                        checked={true}
                        disabled={true}
                      >
                        <span className="text-xs sm:text-sm">{o.label}</span>
                      </CheckLine>
                    )
                  ))}
                </div>
              </Row>
            </FormCard>

            {/* DANGERS PARTICULIERS */}
            <FormCard title="DANGERS PARTICULIERS">
              <Row label="Dangers identifiés">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {optDangers.map((o) => (
                    data.dangers.includes(o.key) && (
                      <CheckLine
                        key={o.key}
                        checked={true}
                        disabled={true}
                      >
                        <span className="text-xs sm:text-sm">{o.label}</span>
                      </CheckLine>
                    )
                  ))}
                  {data.dangers.includes("autre") && data.danger_autre && (
                    <div className="ml-6 text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      Autre: {data.danger_autre}
                    </div>
                  )}
                </div>
              </Row>
            </FormCard>

            {/* EPI */}
            <FormCard title="ÉQUIPEMENT DE PROTECTION PERSONNELLE REQUIS">
              <Row label="Sans EPI additionnel">
                <CheckLine
                  checked={!!data.epi_sans_additionnel}
                  disabled={true}
                >
                  <span className="text-xs sm:text-sm">Équipement de protection additionnel non requis</span>
                </CheckLine>
              </Row>

              <Row label="Protection chimique et physique">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {optEpiChimique.map((o) => (
                    data.epi_chimique.includes(o.key) && (
                      <CheckLine
                        key={o.key}
                        checked={true}
                        disabled={true}
                      >
                        <span className="text-xs sm:text-sm">{o.label}</span>
                      </CheckLine>
                    )
                  ))}
                </div>
              </Row>

              <Row label="Protection respiratoire">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {optEpiResp.map((o) => (
                    data.epi_respiratoire.includes(o.key) && (
                      <CheckLine
                        key={o.key}
                        checked={true}
                        disabled={true}
                      >
                        <span className="text-xs sm:text-sm">{o.label}</span>
                      </CheckLine>
                    )
                  ))}
                </div>
              </Row>
            </FormCard>

            {/* ÉQUIPEMENT DE PROTECTION */}
            <FormCard title="EQUIPEMENT DE PROTECTION">
              <Row label="Communications">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {optEquiptComms.map((o) => (
                    data.equip_comms.includes(o.key) && (
                      <CheckLine
                        key={o.key}
                        checked={true}
                        disabled={true}
                      >
                        <span className="text-xs sm:text-sm">{o.label}</span>
                      </CheckLine>
                    )
                  ))}
                </div>
              </Row>

              <Row label="Barricades">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {optEquiptBarriers.map((o) => (
                    data.equip_barrieres.includes(o.key) && (
                      <CheckLine
                        key={o.key}
                        checked={true}
                        disabled={true}
                      >
                        <span className="text-xs sm:text-sm">{o.label}</span>
                      </CheckLine>
                    )
                  ))}
                </div>
              </Row>

              <Row label="Qualité de l'air">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {optQualiteAir.map((o) => (
                    data.equip_qualite_air.includes(o.key) && (
                      <CheckLine
                        key={o.key}
                        checked={true}
                        disabled={true}
                      >
                        <span className="text-xs sm:text-sm">{o.label}</span>
                      </CheckLine>
                    )
                  ))}
                </div>
              </Row>

              <Row label="Étincelles électriques/Prévention des chocs">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {optEtincelles.map((o) => (
                    data.equip_etincelles.includes(o.key) && (
                      <CheckLine
                        key={o.key}
                        checked={true}
                        disabled={true}
                      >
                        <span className="text-xs sm:text-sm">{o.label}</span>
                      </CheckLine>
                    )
                  ))}
                </div>
              </Row>
            </FormCard>

            {/* COMMENTAIRES */}
            <FormCard title="COMMENTAIRES ET RECOMMANDATIONS PARTICULIÈRES">
              <Row label="Commentaires">
                <Area
                  disabled={true}
                  value={data.commentaires}
                  rows={4}
                />
              </Row>
            </FormCard>

            {/* SIGNATURES CONTRACTANT */}
            <FormCard title="SIGNATURE D'AUTORISATION DE PERMIS">
              <Row label="Confirmations">
                <div className="space-y-2">
                  <CheckLine checked={data.confirmation_travail} disabled={true}>
                    <span className="text-xs sm:text-sm">Travail à faire</span>
                  </CheckLine>
                  <CheckLine checked={data.confirmation_conditions} disabled={true}>
                    <span className="text-xs sm:text-sm">Les conditions dangereuses et les mesures de contrôle</span>
                  </CheckLine>
                  <CheckLine checked={data.confirmation_equipement} disabled={true}>
                    <span className="text-xs sm:text-sm">Équipement de protection requis</span>
                  </CheckLine>
                  <CheckLine checked={data.confirmation_epi} disabled={true}>
                    <span className="text-xs sm:text-sm">EPI additionnel</span>
                  </CheckLine>
                </div>
              </Row>

              <Row label="Superviseur Construction Jacobs">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-3">
                    <Text disabled value={data.sig_resp_construction_nom} />
                    <Text type="date" disabled value={data.sig_resp_construction_date} />
                  </div>
                  {data.sig_resp_construction_file && (
                    <img
                      src={`/storage/${data.sig_resp_construction_file}`}
                      alt="Signature responsable construction"
                      className="h-20 w-auto rounded border border-gray-200 bg-white shadow-sm"
                    />
                  )}
                </div>
              </Row>

              <Row label="H&S Manager Jacobs">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-3">
                    <Text disabled value={data.sig_resp_hse_nom} />
                    <Text type="date" disabled value={data.sig_resp_hse_date} />
                  </div>
                  {data.sig_resp_hse_file && (
                    <img
                      src={`/storage/${data.sig_resp_hse_file}`}
                      alt="Signature responsable HSE"
                      className="h-20 w-auto rounded border border-gray-200 bg-white shadow-sm"
                    />
                  )}
                </div>
              </Row>
            </FormCard>

             {/* ACTIONS */}
            {!readonly && (
              <div className="flex items-center justify-end gap-3 pb-2 sticky bottom-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <button
                  type="submit"
                  disabled={processing}
                  className="rounded-md px-5 py-3 text-sm font-semibold text-white shadow transition disabled:opacity-60 hover:scale-105 transform duration-200 min-w-[120px]"
                  style={{ backgroundColor: BRAND }}
                >
                  {processing ? "Envoi…" : "Soumettre"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}