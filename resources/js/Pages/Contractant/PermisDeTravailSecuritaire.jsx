import React, { useMemo, useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import ContractantSidebar from '@/Components/ContractantSidebar';
import ContractantTopHeader from '@/Components/ContractantTopHeader';
import { router } from "@inertiajs/react";

/* --------------------------------- UI bits -------------------------------- */
const Section = ({ title, children }) => (
  <div className="rounded-3xl border border-blue-200/50 bg-white/90 backdrop-blur-xl shadow-2xl mb-8">
    <div className="border-b border-blue-200/50 px-6 py-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
      <h2 className="text-sm font-bold tracking-wide text-gray-800 uppercase">
        {title}
      </h2>
    </div>
    <div className="p-8 bg-white/95">{children}</div>
  </div>
);

const Label = ({ children, className = "", ...rest }) => (
  <label
    {...rest}
    className={`block text-sm font-medium text-gray-800 mb-1 ${className}`}
  >
    {children}
  </label>
);

const Text = ({ disabled, readOnly, ...rest }) => (
  <input
    {...rest}
    className={[
      "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-300",
      "focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500",
      disabled || readOnly ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300",
    ].join(" ")}
    disabled={disabled || readOnly}
  />
);

const Area = ({ disabled, readOnly, rows = 4, maxLength, value, ...rest }) => {
  const charCount = value?.length || 0;
  const isNearLimit = maxLength && charCount > maxLength * 0.8;
  const isOverLimit = maxLength && charCount > maxLength;
  
  return (
    <div className="relative">
      <textarea
        rows={rows}
        disabled={disabled || readOnly}
        value={value}
        maxLength={maxLength}
        {...rest}
        className={[
          "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-300",
          "focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500",
          disabled || readOnly ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300",
          isOverLimit ? "border-red-500 focus:border-red-500 focus:ring-red-500/50" : ""
        ].join(" ")}
      />
      {maxLength && (
        <div className={[
          "absolute bottom-2 right-2 text-xs px-2 py-1 rounded",
          isOverLimit ? "bg-red-100 text-red-700" : 
          isNearLimit ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"
        ].join(" ")}>
          {charCount}/{maxLength}
        </div>
      )}
    </div>
  );
};

const FieldError = ({ children }) =>
  children ? <p className="mt-1 text-xs text-rose-600">{children}</p> : null;

function CheckRow({ checked, onChange, label, disabled }) {
  return (
    <label className={`inline-flex items-start gap-2 ${disabled ? "opacity-60" : ""}`}>
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="text-sm text-gray-800">{label}</span>
    </label>
  );
}

function CheckboxGroup({
  legend,
  options,
  values,
  setValues,
  requiredLabel = "Sélectionnez au moins une option.",
  error,
  mutuallyExclusiveKey, // e.g., "aucun" – disables others if present
  showOtherField = false,
  otherValue = "",
  onOtherChange = () => {},
  otherError = "",
}) {
  const toggle = (key) => {
    const s = new Set(values);
    if (s.has(key)) s.delete(key);
    else {
      // If toggling "aucun", clear others
      if (mutuallyExclusiveKey && key === mutuallyExclusiveKey) {
        s.clear();
        s.add(key);
      } else {
        // If selecting something and "aucun" is present, remove it
        if (mutuallyExclusiveKey && s.has(mutuallyExclusiveKey)) {
          s.delete(mutuallyExclusiveKey);
        }
        s.add(key);
      }
    }
    setValues([...s]);
  };

  const isNoneSelected = mutuallyExclusiveKey && values.includes(mutuallyExclusiveKey);

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-gray-800 mb-2">{legend}</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((o) => (
          <label key={o.key} className="inline-flex items-start gap-3 p-2 rounded-lg hover:bg-blue-50/50 transition-colors duration-200">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={values.includes(o.key)}
              onChange={() => toggle(o.key)}
              disabled={isNoneSelected && o.key !== mutuallyExclusiveKey}
            />
            <span className="text-sm text-gray-800">{o.label}</span>
          </label>
        ))}
      </div>
      
      {showOtherField && values.includes("autre") && (
        <div className="mt-3">
          <Label>Précisez l'autre option:</Label>
          <Text
            value={otherValue}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="Précisez..."
          />
          <FieldError>{otherError}</FieldError>
        </div>
      )}
      
      <FieldError>{error || (values.length === 0 ? requiredLabel : "")}</FieldError>
    </fieldset>
  );
}

function SignaturePicker({ id, label, value, onChange, disabled, error }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          onChange(file);
          if (file) setPreview(URL.createObjectURL(file));
          else setPreview(null);
        }}
        className={[
          "block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-500/20 file:px-3 file:py-2",
          "file:text-blue-700 hover:file:bg-blue-500/30",
          disabled ? "opacity-60 cursor-not-allowed" : "",
        ].join(" ")}
      />
      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="Signature preview"
            className="h-24 w-auto rounded-md border border-gray-200 bg-white"
          />
        </div>
      )}
      <FieldError>{error}</FieldError>
      <p className="mt-1 text-xs text-gray-500">Formats acceptés : JPG/PNG</p>
    </div>
  );
}

// Function to generate permit number
const generatePermitNumber = (contractorName) => {
  const timestamp = new Date().getTime().toString().slice(-6);
  // Prendre les initiales du nom seulement (pas de la company)
  const nameOnly = contractorName.split(' - ')[0] || contractorName;
  const initials = nameOnly
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);
  return `EXC-${initials}-${timestamp}`;
};

/* ---------------------------------- Page ---------------------------------- */
export default function Excavation() {
  const { sites = [], auth, contractor_info } = usePage().props;
  
  // Utiliser les informations du contractant connecté
  const contractorDisplay = contractor_info?.full_display || 
                           (auth?.contractor ? `${auth.contractor.name} - ${auth.contractor.company_name}` : '') || 
                           (auth?.user ? `${auth.user.name} - ${auth.user.company_name}` : 'Contractant');

  /* ----------------------------- static options ---------------------------- */
  // TYPE D'ACTIVITÉ
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

  // PERMIS SUPPLÉMENTAIRES
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

  // DANGERS PARTICULIERS (grand tableau)
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

  // EPI – Chimique/Physique
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

  // EPI – Respiratoire
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

  // ÉQUIPEMENT DE PROTECTION (checklist)
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

  /* ------------------------------- form state ------------------------------ */
  const [data, setData] = useState({
    // Header
    numero_permis: generatePermitNumber(contractorDisplay),
    
    // IDENTIFICATION - Pré-remplir avec les infos du contractant connecté
    site_id: "",
    duree_de: "",
    duree_a: "",
    description: "",
    plan_securitaire_par: "",
    date_analyse: "",
    demandeur: contractorDisplay, // ← Pré-rempli automatiquement
    contractant: contractorDisplay, // ← Pré-rempli automatiquement
    meme_que_demandeur: true,

    // GROUPES (au moins 1)
    activites: [],
    permis_supp: [],
    dangers: [],
    danger_autre: "", // Champ pour préciser l'autre danger
    activite_autre: "", // Champ pour préciser l'autre activité

    // EPI
    epi_sans_additionnel: false,
    epi_chimique: [],
    epi_respiratoire: [],

    // EQUIPEMENT DE PROTECTION
    equip_comms: [],
    equip_barrieres: [],
    equip_qualite_air: [],
    equip_etincelles: [],

    // COMMENTAIRES
    commentaires: "",

    // SIGNATURES - CONFIRMATIONS
    confirmation_travail: false,
    confirmation_conditions: false,
    confirmation_equipement: false,
    confirmation_epi: false,

    // SIGNATURES (contractant – requis)
    sig_resp_construction_nom: "",
    sig_resp_construction_date: "",
    sig_resp_construction_file: null,

    sig_resp_hse_nom: "",
    sig_resp_hse_date: "",
    sig_resp_hse_file: null,

    // PARKX – désactivé (remplis plus tard, non requis ici)
    cm_parkx_nom: "",
    cm_parkx_date: "",
    cm_parkx_file: null,

    hse_parkx_nom: "",
    hse_parkx_date: "",
    hse_parkx_file: null,

    // FERMETURE DU PERMIS (affiché mais non requis pour le contractant)
    fermeture_q1: null,
    fermeture_q2: null,
    fermeture_q3: null,
    fermeture_suivi: "",
  });

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  /* -------------------------------- validate ------------------------------- */
  const [errors, setErrors] = useState({});
  const [ok, setOk] = useState(false);

  const validate = () => {
    const e = {};

    // Identification
    if (!data.site_id) e.site_id = "Sélection obligatoire.";
    ["duree_de", "duree_a", "description", "plan_securitaire_par", "date_analyse", "demandeur", "contractant"].forEach(
      (k) => {
        if (!String(data[k] || "").trim()) e[k] = "Champ requis.";
      }
    );

    // Character limit validations
    if (data.description && data.description.length > 100) {
      e.description = "La description ne peut pas dépasser 100 caractères.";
    }
    
    if (data.commentaires && data.commentaires.length > 250) {
      e.commentaires = "Les commentaires ne peuvent pas dépasser 250 caractères.";
    }

    // Groupes (>=1)
    if (data.activites.length === 0) e.activites = "Sélectionnez au moins une activité.";
    if (data.permis_supp.length === 0) e.permis_supp = "Sélectionnez au moins un permis supplémentaire.";
    if (data.dangers.length === 0) e.dangers = "Sélectionnez au moins un danger.";
    
    // Si "autre" est sélectionné dans les dangers, vérifier que le champ est rempli
    if (data.dangers.includes("autre") && !data.danger_autre.trim()) {
      e.danger_autre = "Veuillez préciser l'autre danger.";
    }
    
    // Si "autre" est sélectionné dans les activités, vérifier que le champ est rempli
    if (data.activites.includes("autre") && !data.activite_autre.trim()) {
      e.activite_autre = "Veuillez préciser l'autre activité.";
    }

    // EPI – au moins un globalement, sauf si "sans additionnel"
    if (!data.epi_sans_additionnel) {
      if (data.epi_chimique.length === 0 && data.epi_respiratoire.length === 0) {
        e.epi = "Sélectionnez au moins un EPI (ou cochez Sans EPI additionnel).";
      }
    }

    // Équipement de protection – au moins un par sous-groupe
    if (data.equip_comms.length === 0) e.equip_comms = "Au moins un élément requis.";
    if (data.equip_barrieres.length === 0) e.equip_barrieres = "Au moins un élément requis.";
    if (data.equip_qualite_air.length === 0) e.equip_qualite_air = "Au moins un élément requis.";
    if (data.equip_etincelles.length === 0) e.equip_etincelles = "Au moins un élément requis.";

    // Commentaires
    if (!String(data.commentaires || "").trim()) e.commentaires = "Champ requis.";

    // Confirmations
    if (!data.confirmation_travail) e.confirmation_travail = "Cette confirmation est requise.";
    if (!data.confirmation_conditions) e.confirmation_conditions = "Cette confirmation est requise.";
    if (!data.confirmation_equipement) e.confirmation_equipement = "Cette confirmation est requise.";
    if (!data.confirmation_epi) e.confirmation_epi = "Cette confirmation est requise.";

    // Signatures (contractant)
    if (!data.sig_resp_construction_nom.trim())
      e.sig_resp_construction_nom = "Nom requis.";
    if (!data.sig_resp_construction_date)
      e.sig_resp_construction_date = "Date requise.";
    if (!data.sig_resp_construction_file)
      e.sig_resp_construction_file = "Signature (image) requise.";

    if (!data.sig_resp_hse_nom.trim()) e.sig_resp_hse_nom = "Nom requis.";
    if (!data.sig_resp_hse_date) e.sig_resp_hse_date = "Date requise.";
    if (!data.sig_resp_hse_file) e.sig_resp_hse_file = "Signature (image) requise.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Ajoutez cette fonction avant le onSubmit
  const buildFormData = (data) => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }
      
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((v, i) => {
          if (v !== null && v !== undefined) {
            formData.append(`${key}[${i}]`, v);
          }
        });
      } else if (typeof value === 'boolean') {
        formData.append(key, value ? '1' : '0');
      } else {
        formData.append(key, value.toString());
      }
    });
    
    return formData;
  };

  // Puis modifiez le onSubmit :
  const onSubmit = (e) => {
    e.preventDefault();
    setOk(false);

    if (!validate()) return;

    const formData = buildFormData(data);

    router.post(route("contractant.permis-travail-securitaire.store"), formData, {
      forceFormData: true,
      onSuccess: () => {
        window.location.href = route("contractant.permis-travail-securitaire.index");
      },
      onError: (errors) => {
        setErrors(errors);
      },
    });
  };

  /* ------------------------------- rendering ------------------------------- */
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden flex">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59,130,246,0.2) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Sidebar */}
        <ContractantSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <ContractantTopHeader 
            contractor={auth?.contractor}
            showBackButton={true}
            backRoute={route('contractant.home')}
            backLabel="Retour au tableau de bord"
          />

          <div className="relative z-10 px-6 pb-12 flex-1 pt-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Permis de travail sécuritaire — Construction
                  </span>
                </h1>
                <p className="text-gray-600 text-lg">
                  Remplissez et soumettez votre permis de travail sécuritaire
                </p>
              </motion.div>

              <AnimatePresence>
                {ok && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-8 rounded-xl border border-green-200 bg-green-50 px-6 py-4 text-sm text-green-800 shadow-lg"
                  >
                    Données validées côté client. Prêt à envoyer au responsable de site
                    (puis HSE). Implémentez ensuite l'enregistrement & PDF côté Laravel.
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.form 
                onSubmit={onSubmit} 
                className="space-y-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mb-8 rounded-3xl border border-gray-200 bg-white shadow-lg overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-4 md:mb-0">
                      <img src="/images/logo.png" alt="ParkX" className="h-8 w-auto" />
                      <h1 className="text-gray-800 font-semibold tracking-wide uppercase text-lg">
                        PERMIS De TRAVAIL SÉCURITAIRE
                      </h1>
                    </div>

                    {/* NUMÉRO DE PERMIS (auto-generated) */}
                    <div className="mt-2">
                      <div className="text-sm text-gray-700">NUMÉRO DE PERMIS</div>
                      <Text
                        readOnly
                        value={data.numero_permis || generatePermitNumber(contractorDisplay)}
                        className="bg-gray-100 cursor-not-allowed"
                      />
                      <FieldError>{errors.numero_permis}</FieldError>
                    </div>
                  </div>
                </motion.div>

                {/* IDENTIFICATION */}
                <Section title="Identification">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label>Endroit</Label>
                      <select
                        value={data.site_id}
                        onChange={(e) => set("site_id", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                        style={{ colorScheme: 'light' }}
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
                      <FieldError>{errors.site_id}</FieldError>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Durée: De</Label>
                        <Text
                          type="date"
                          value={data.duree_de}
                          onChange={(e) => set("duree_de", e.target.value)}
                        />
                        <FieldError>{errors.duree_de}</FieldError>
                      </div>
                      <div>
                        <Label>À</Label>
                        <Text
                          type="date"
                          value={data.duree_a}
                          onChange={(e) => set("duree_a", e.target.value)}
                        />
                        <FieldError>{errors.duree_a}</FieldError>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <Label>Description de la tâche</Label>
                      <Area
                        value={data.description}
                        onChange={(e) => set("description", e.target.value)}
                        maxLength={100}
                        rows={3}
                      />
                      <FieldError>{errors.description}</FieldError>
                    </div>

                    <div>
                      <Label>Plan sécuritaire de la tâche réalisé par</Label>
                      <Text
                        value={data.plan_securitaire_par}
                        onChange={(e) => set("plan_securitaire_par", e.target.value)}
                      />
                      <FieldError>{errors.plan_securitaire_par}</FieldError>
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Text
                        type="date"
                        value={data.date_analyse}
                        onChange={(e) => set("date_analyse", e.target.value)}
                      />
                      <FieldError>{errors.date_analyse}</FieldError>
                    </div>

                    <div>
                      <Label>Contractant demandeur du permis</Label>
                      <Text
                        value={data.demandeur}
                        readOnly
                        className="bg-gray-100 cursor-not-allowed"
                        title="Ce champ est automatiquement rempli avec vos informations"
                      />
                    
                    </div>
                    
                    <div>
                      <Label>Contractant effectuant le travail</Label>
                      <Text
                        value={data.contractant}
                        onChange={(e) => set("contractant", e.target.value)}
                      />
                      <FieldError>{errors.contractant}</FieldError>
                      <label className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black/20"
                          checked={data.meme_que_demandeur}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setData((d) => ({
                              ...d,
                              meme_que_demandeur: checked,
                              contractant: checked ? contractorDisplay : d.contractant,
                            }));
                          }}
                        />
                        Même que demandeur
                      </label>
                    </div>
                  </div>
                </Section>

                {/* TYPE D'ACTIVITE */}
                <Section title="TYPE D'ACTIVITE">
                  <CheckboxGroup
                    legend="Sélectionner les activités"
                    options={optActivite}
                    values={data.activites}
                    setValues={(v) => set("activites", v)}
                    showOtherField={true}
                    otherValue={data.activite_autre}
                    onOtherChange={(v) => set("activite_autre", v)}
                    otherError={errors.activite_autre}
                    error={errors.activites}
                  />
                </Section>

                {/* PERMIS DE TRAVAIL SUPPLEMENTAIRE REQUIS */}
                <Section title="PERMIS DE TRAVAIL SUPPLEMENTAIRE REQUIS">
                  <CheckboxGroup
                    legend="Permis"
                    options={optPermisSupp}
                    values={data.permis_supp}
                    setValues={(v) => set("permis_supp", v)}
                    error={errors.permis_supp}
                  />
                </Section>

                {/* DANGERS PARTICULIERS */}
                <Section title="DANGERS PARTICULIERS">
                  <CheckboxGroup
                    legend="Sélectionner les dangers (ou 'Aucun')"
                    options={optDangers}
                    values={data.dangers}
                    setValues={(v) => set("dangers", v)}
                    mutuallyExclusiveKey="aucun"
                    showOtherField={true}
                    otherValue={data.danger_autre}
                    onOtherChange={(v) => set("danger_autre", v)}
                    otherError={errors.danger_autre}
                    error={errors.dangers}
                  />
                </Section>

                {/* ÉQUIPEMENT DE PROTECTION PERSONNELLE REQUIS */}
                <Section title="ÉQUIPEMENT DE PROTECTION PERSONNELLE REQUIS">
                  <div className="mb-3">
                    <CheckRow
                      checked={data.epi_sans_additionnel}
                      onChange={(v) => set("epi_sans_additionnel", v)}
                      label="Équipement de protection additionnel non requis"
                    />
                    <FieldError>{errors.epi}</FieldError>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className={`${data.epi_sans_additionnel ? "opacity-60" : ""}`}>
                      <CheckboxGroup
                        legend="PROTECTION CHIMIQUE ET PHYSIQUE"
                        options={optEpiChimique}
                        values={data.epi_chimique}
                        setValues={(v) => set("epi_chimique", v)}
                      />
                    </div>
                    <div className={`${data.epi_sans_additionnel ? "opacity-60" : ""}`}>
                      <CheckboxGroup
                        legend="PROTECTION RESPIRATOIRE"
                        options={optEpiResp}
                        values={data.epi_respiratoire}
                        setValues={(v) => set("epi_respiratoire", v)}
                      />
                    </div>
                  </div>
                </Section>

                {/* EQUIPEMENT DE PROTECTION */}
                <Section title="EQUIPEMENT DE PROTECTION">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <CheckboxGroup
                        legend="COMMUNICATIONS"
                        options={optEquiptComms}
                        values={data.equip_comms}
                        setValues={(v) => set("equip_comms", v)}
                        error={errors.equip_comms}
                      />
                    </div>
                    <div>
                      <CheckboxGroup
                        legend="Barricades"
                        options={optEquiptBarriers}
                        values={data.equip_barrieres}
                        setValues={(v) => set("equip_barrieres", v)}
                        error={errors.equip_barrieres}
                      />
                    </div>
                    <div>
                      <CheckboxGroup
                        legend="QUALITE DE L'AIR"
                        options={optQualiteAir}
                        values={data.equip_qualite_air}
                        setValues={(v) => set("equip_qualite_air", v)}
                        error={errors.equip_qualite_air}
                      />
                    </div>
                    <div>
                      <CheckboxGroup
                        legend="ETINCELLES ELECTRIQUES/PREVENTION DES CHOCS"
                        options={optEtincelles}
                        values={data.equip_etincelles}
                        setValues={(v) => set("equip_etincelles", v)}
                        error={errors.equip_etincelles}
                      />
                    </div>
                  </div>
                </Section>

                {/* COMMENTAIRES ET RECOMMANDATIONS PARTICULIÈRES */}
                <Section title="COMMENTAIRES ET RECOMMANDATIONS PARTICULIÈRES">
                  <Area
                    value={data.commentaires}
                    onChange={(e) => set("commentaires", e.target.value)}
                    placeholder="Aucun commentaire additionnel ou recommandation"
                    maxLength={250}
                    rows={4}
                  />
                  <FieldError>{errors.commentaires}</FieldError>
                </Section>

                {/* SIGNATURE D'AUTORISATION DE PERMIS */}
                <Section title="SIGNATURE D'AUTORISATION DE PERMIS">
                  <div className="mb-6 space-y-4">
                    <p className="text-sm text-gray-700">
                      Le contractant qui exécute les travaux comprend l'étendue des travaux, 
                      la nature des dangers, les mesures préventives et fera en sorte que ces 
                      exigences sont suivies. Le personnel assigné aux travaux devra être informé de:
                    </p>
                    
                    <div className="space-y-3">
                      <CheckRow
                        checked={data.confirmation_travail}
                        onChange={(v) => set("confirmation_travail", v)}
                        label="Travail à faire"
                      />
                      <CheckRow
                        checked={data.confirmation_conditions}
                        onChange={(v) => set("confirmation_conditions", v)}
                        label="Les conditions dangereuses et les mesures de contrôle (SPA?)"
                      />
                      <CheckRow
                        checked={data.confirmation_equipement}
                        onChange={(v) => set("confirmation_equipement", v)}
                        label="Équipement de protection requis"
                      />
                      <CheckRow
                        checked={data.confirmation_epi}
                        onChange={(v) => set("confirmation_epi", v)}
                        label="EPI additionnel"
                      />
                    </div>
                    
                    <FieldError>{errors.confirmation_travail || errors.confirmation_conditions || errors.confirmation_equipement || errors.confirmation_epi}</FieldError>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Superviseur Construction Jacobs */}
                    <div>
                      <Label>Superviseur Construction Jacobs — Nom en lettres moulées</Label>
                      <Text
                        value={data.sig_resp_construction_nom}
                        onChange={(e) => set("sig_resp_construction_nom", e.target.value)}
                      />
                      <FieldError>{errors.sig_resp_construction_nom}</FieldError>
                      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <SignaturePicker
                          id="sig_resp_construction_file"
                          label="Signature (JPG/PNG)"
                          value={data.sig_resp_construction_file}
                          onChange={(file) => set("sig_resp_construction_file", file)}
                          error={errors.sig_resp_construction_file}
                        />
                        <div>
                          <Label>Date</Label>
                          <Text
                            type="date"
                            value={data.sig_resp_construction_date}
                            onChange={(e) =>
                              set("sig_resp_construction_date", e.target.value)
                            }
                          />
                          <FieldError>{errors.sig_resp_construction_date}</FieldError>
                        </div>
                      </div>
                    </div>

                    {/* H&S Manager (délégué) Jacobs */}
                    <div>
                      <Label>H&S Manager (délégué) Jacobs — Nom en lettres moulées</Label>
                      <Text
                        value={data.sig_resp_hse_nom}
                        onChange={(e) => set("sig_resp_hse_nom", e.target.value)}
                      />
                      <FieldError>{errors.sig_resp_hse_nom}</FieldError>
                      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <SignaturePicker
                          id="sig_resp_hse_file"
                          label="Signature (JPG/PNG)"
                          value={data.sig_resp_hse_file}
                          onChange={(file) => set("sig_resp_hse_file", file)}
                          error={errors.sig_resp_hse_file}
                        />
                        <div>
                          <Label>Date</Label>
                          <Text
                            type="date"
                            value={data.sig_resp_hse_date}
                            onChange={(e) => set("sig_resp_hse_date", e.target.value)}
                          />
                          <FieldError>{errors.sig_resp_hse_date}</FieldError>
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>

                {/* ACTIONS */}
                <motion.div 
                  className="flex items-center justify-end gap-4 pb-2 pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 text-sm font-semibold text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Soumettre
                  </motion.button>
                </motion.div>
              </motion.form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}