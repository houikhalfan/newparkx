import React, { useMemo, useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import ContractantSidebar from '@/Components/ContractantSidebar';
import ContractantTopHeader from '@/Components/ContractantTopHeader';
import { router } from "@inertiajs/react";
import Swal from 'sweetalert2';

/* --------------------------------- UI bits -------------------------------- */
const Section = ({ title, children }) => (
  <div className="rounded-lg md:rounded-3xl border border-blue-200/50 bg-white/90 backdrop-blur-xl shadow-lg md:shadow-2xl mb-6 md:mb-8">
    <div className="border-b border-blue-200/50 px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
      <h2 className="text-xs md:text-sm font-bold tracking-wide text-gray-800 uppercase">
        {title}
      </h2>
    </div>
    <div className="p-4 md:p-8 bg-white/95">{children}</div>
  </div>
);

const Label = ({ children, className = "", ...rest }) => (
  <label
    {...rest}
    className={`block text-xs md:text-sm font-medium text-gray-800 mb-1 ${className}`}
  >
    {children}
  </label>
);

const Text = ({ disabled, readOnly, ...rest }) => (
  <input
    {...rest}
    className={[
      "w-full rounded-lg md:rounded-xl border px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm outline-none transition-all duration-300",
      "focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500",
      disabled || readOnly ? "bg-gray-50 text-gray-500" : "bg-white border-gray-300",
    ].join(" ")}
    disabled={disabled || readOnly}
  />
);

const Area = ({ disabled, rows = 4, maxChars, currentLength, ...rest }) => (
  <textarea
    rows={rows}
    {...rest}
    className={[
      "w-full rounded-lg md:rounded-xl border px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm outline-none transition-all duration-300",
      "focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500",
      disabled ? "bg-gray-50 text-gray-500" : "bg-white border-gray-300",
      currentLength > maxChars * 0.9 ? "border-amber-300 bg-amber-50" : "",
    ].join(" ")}
  />
);

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
      <span className="text-xs md:text-sm text-gray-800">{label}</span>
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
  showOtherField = false,
  otherValue = "",
  onOtherChange = () => {},
  otherError = "",
}) {
  const toggle = (key) => {
    const s = new Set(values);
    if (s.has(key)) s.delete(key);
    else s.add(key);
    setValues([...s]);
  };

  return (
    <fieldset className="space-y-3">
      <legend className="text-xs md:text-sm font-semibold text-gray-800 mb-2">{legend}</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
        {options.map((o) => (
          <label key={o.key} className="inline-flex items-start gap-2 p-2 rounded-lg hover:bg-blue-50/50 transition-colors duration-200">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={values.includes(o.key)}
              onChange={() => toggle(o.key)}
            />
            <span className="text-xs md:text-sm text-gray-800">{o.label}</span>
          </label>
        ))}
      </div>
      
      {showOtherField && values.includes("autre") && (
        <div className="mt-3">
          <Label>Précisez l'autre option:</Label>
          <div className="space-y-2">
            <Text
              value={otherValue}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 100) {
                  onOtherChange(value);
                }
              }}
              placeholder="Précisez (maximum 100 caractères)..."
            />
            <div className="flex justify-between items-center text-xs">
              <span className={`${otherValue.length > 90 ? 'text-amber-600' : 'text-gray-500'}`}>
                {otherValue.length} / 100 caractères
              </span>
            </div>
          </div>
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
          "block w-full text-xs md:text-sm file:mr-2 md:file:mr-3 file:rounded-lg file:border-0 file:bg-blue-500/20 file:px-2 md:file:px-3 file:py-1 md:file:py-2",
          "file:text-blue-700 hover:file:bg-blue-500/30",
          disabled ? "opacity-60 cursor-not-allowed" : "",
        ].join(" ")}
      />
      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="Signature preview"
            className="h-20 md:h-24 w-auto rounded-md border border-gray-200 bg-white"
          />
        </div>
      )}
      <FieldError>{error}</FieldError>
      <p className="mt-1 text-xs text-gray-500">Formats acceptés : JPG/PNG</p>
    </div>
  );
}

// Function to generate permit number
const generatePermitNumber = () => {
  const timestamp = new Date().getTime().toString().slice(-6);
  return `CHAUD-${timestamp}`;
};

// Initial form data
const getInitialFormData = (contractorName = "", companyName = "") => ({
  numero_permis: generatePermitNumber(),
  site_id: "",
  date_debut: "",
  date_fin: "",
  description_tache: "",
  plan_securitaire_par: "",
  date_plan_securitaire: "",
  contractant_demandeur: `${contractorName} - ${companyName}`, // Format: "Contractant YYY - INNOVX"
  contractant_travail: `${contractorName} - ${companyName}`, // Also auto-filled by default
  meme_que_demandeur: true,
  activites: [],
  activite_autre: "",
  dangers: [],
  danger_autre: "",
  protection_physique: [],
  protection_physique_autre: "",
  protection_respiratoire: [],
  protection_incendie: [],
  protection_incendie_autre: "",
  equipement_inspection: [],
  permis_requis: [],
  surveillance_requise: [],
  commentaires: "",
  aucun_commentaire: false,
  resp_construction_nom: "",
  resp_construction_date: "",
  resp_construction_file: null,
  resp_hse_nom: "",
  resp_hse_date: "",
  resp_hse_file: null,
});

// Temporary debug component
const DebugInfo = ({ contractor, formattedContractant, data }) => (
  <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-300 p-4 rounded-lg text-xs max-w-md z-50 shadow-lg">
    <h3 className="font-bold mb-2 text-yellow-800">Debug Contractor Info:</h3>
    <p><strong>Contractor Prop:</strong> {JSON.stringify(contractor)}</p>
    <p><strong>Formatted Name:</strong> "{formattedContractant}"</p>
    <p><strong>Form Demandeur:</strong> "{data.contractant_demandeur}"</p>
  </div>
);

/* ---------------------------------- Page ---------------------------------- */
export default function PermisDeTravailAChaud({ mode, sites, permis, contractor }) {
  const { auth } = usePage().props;
  
  // Get contractor's name and company name from props
  const contractorName = contractor?.name || "";
  const companyName = contractor?.company_name || "";
  const formattedContractant = contractorName && companyName 
    ? `${contractorName} - ${companyName}`
    : companyName || contractorName || "";

  // Debug: log the contractor data to see what's available
  useEffect(() => {
    console.log('=== CONTRACTOR DATA DEBUG ===');
    console.log('Contractor prop:', contractor);
    console.log('Contractor name:', contractorName);
    console.log('Company name:', companyName);
    console.log('Formatted name:', formattedContractant);
    console.log('=============================');
  }, [contractor, contractorName, companyName, formattedContractant]);

  /* ----------------------------- static options ---------------------------- */
  const optActivite = useMemo(
    () => [
      { key: "soudage_arc", label: "Soudage à l'arc" },
      { key: "decoupage_arc", label: "Découpage à l'arc" },
      { key: "soudage_mig", label: "Soudage MIG" },
      { key: "soudage_tig", label: "Soudage TIG" },
      { key: "decoupage_plasma", label: "Découpage au plasma" },
      { key: "brasage_soudure", label: "Brasage/Soudure" },
      { key: "oxysoudage", label: "Oxysoudage" },
      { key: "oxycoupage", label: "Oxycoupage" },
      { key: "decoupage_mecanique", label: "Découpage/meulage mécanique" },
      { key: "autre", label: "Autre" },
    ],
    []
  );

  const optDangers = useMemo(
    () => [
      { key: "inflammable_11m", label: "Matériel ou produit inflammable à moins de 11m" },
      { key: "produits_chimiques", label: "Présence de produits chimiques" },
      { key: "travail_machinerie", label: "Travail à chaud sur machinerie/équipement" },
      { key: "ouverture_plancher", label: "Ouverture dans le plancher" },
      { key: "poussieres_inflammables", label: "Présence de poussières inflammables/combustibles" },
      { key: "espace_confine", label: "Travail en espace confiné" },
      { key: "faible_oxygene", label: "Faible concentration en oxygène" },
      { key: "chaleur_rayonnante", label: "Chaleur rayonnante se propageant à des matières combustibles" },
      { key: "vapeurs_inflammables", label: "Présence de vapeurs inflammables/combustibles" },
      { key: "autre", label: "Autre" },
    ],
    []
  );

  const optProtectionPhysique = useMemo(
    () => [
      { key: "casque_soudage", label: "Casque de Soudage" },
      { key: "goggles_soudage", label: "Goggles de soudage" },
      { key: "ecran_facial", label: "Ecran Facial" },
      { key: "gants_soudage", label: "Gants (soudage, résistants à la chaleur)" },
      { key: "protection_auditive", label: "Protection auditive" },
      { key: "vetements", label: "Vêtements (tablier de soudage, résistants au flammes, etc.)" },
      { key: "autre", label: "Autres" },
    ],
    []
  );

  const optProtectionRespiratoire = useMemo(
    () => [
      { key: "filtres_particules", label: "Appareils à filtres à particules" },
      { key: "cartouches_chimiques", label: "Appareils à cartouches chimiques" },
      { key: "epuration_air", label: "Appareil à épuration d'air soudage" },
      { key: "epuration_air_motorises", label: "Appareil à épuration d'air motorisés" },
    ],
    []
  );

  const optProtectionIncendie = useMemo(
    () => [
      { key: "ecran_soudage", label: "Écran de soudage" },
      { key: "couverture_ignifuge", label: "Couverture ignifuge" },
      { key: "extincteur", label: "Extincteur (à moins de 3 mètres)" },
      { key: "boyau_arrosage", label: "Boyau d'arrosage" },
      { key: "autre", label: "Autre" },
    ],
    []
  );

  const optEquipementInspection = useMemo(
    () => [
      { key: "cables_pinces_terre", label: "Câbles/pinces de mise à la terre" },
      { key: "cable_alimentation", label: "Câble d'alimentation pour poste de soudage" },
      { key: "jauges_boyaux", label: "Jauges/Boyaux/Intercepteurs de rentrée de flamme" },
      { key: "cylindre_attache", label: "Cylindre attaché adéquatement" },
      { key: "ouvertures_obstruées", label: "Ouvertures de plancher obstruées" },
    ],
    []
  );

  const optPermis = useMemo(
    () => [
      { key: "espace_clos", label: "Espace clos" },
      { key: "etiquetage_verrouillage", label: "Étiquetage/Verrouillage" },
      { key: "qualite_air", label: "Qualité de l'air" },
      { key: "ventilation_mecanique", label: "Ventilation mécanique" },
      { key: "ventilation_locale", label: "Ventilation locale" },
    ],
    []
  );

  const optSurveillance = useMemo(
    () => [
      { key: "continue_30min", label: "Continue 30 min après fin de travaux" },
      { key: "2h_apres", label: "2 heures après la fin des travaux" },
    ],
    []
  );

  // Character limits
  const CHAR_LIMITS = {
    commentaires: 250,
    description_tache: 100,
    activite_autre: 100,
    danger_autre: 100,
    protection_physique_autre: 100,
    protection_incendie_autre: 100,
  };

  /* ------------------------------- form state ------------------------------ */
  const [data, setData] = useState(getInitialFormData(contractorName, companyName));
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when contractor data changes
  useEffect(() => {
    if (formattedContractant) {
      setData(prevData => ({
        ...prevData,
        contractant_demandeur: formattedContractant,
        contractant_travail: prevData.meme_que_demandeur ? formattedContractant : prevData.contractant_travail
      }));
    }
  }, [formattedContractant]);

  // Update contractant_travail when meme_que_demandeur changes
  useEffect(() => {
    if (data.meme_que_demandeur) {
      setData((d) => ({
        ...d,
        contractant_travail: d.contractant_demandeur
      }));
    }
  }, [data.meme_que_demandeur, data.contractant_demandeur]);

  const validate = () => {
    const e = {};

    if (!data.site_id) e.site_id = "Sélection obligatoire.";
    if (!data.date_debut) e.date_debut = "Date de début requise.";
    if (!data.date_fin) e.date_fin = "Date de fin requise.";
    if (!data.description_tache.trim()) e.description_tache = "Champ requis.";
    if (!data.plan_securitaire_par.trim()) e.plan_securitaire_par = "Champ requis.";
    if (!data.date_plan_securitaire) e.date_plan_securitaire = "Date requise.";
    if (!data.contractant_demandeur.trim()) e.contractant_demandeur = "Champ requis.";
    if (!data.contractant_travail.trim()) e.contractant_travail = "Champ requis.";

    if (data.activites.length === 0) e.activites = "Sélectionnez au moins une activité.";
    if (data.activites.includes("autre") && !data.activite_autre.trim()) {
      e.activite_autre = "Veuillez préciser l'autre activité.";
    } else if (data.activite_autre.length > CHAR_LIMITS.activite_autre) {
      e.activite_autre = `La précision ne peut pas dépasser ${CHAR_LIMITS.activite_autre} caractères.`;
    }

    if (data.dangers.length === 0) e.dangers = "Sélectionnez au moins un danger.";
    if (data.dangers.includes("autre") && !data.danger_autre.trim()) {
      e.danger_autre = "Veuillez préciser l'autre danger.";
    } else if (data.danger_autre.length > CHAR_LIMITS.danger_autre) {
      e.danger_autre = `La précision ne peut pas dépasser ${CHAR_LIMITS.danger_autre} caractères.`;
    }

    if (data.protection_physique.length === 0) e.protection_physique = "Sélectionnez au moins une protection.";
    if (data.protection_physique.includes("autre") && !data.protection_physique_autre.trim()) {
      e.protection_physique_autre = "Veuillez préciser l'autre protection.";
    } else if (data.protection_physique_autre.length > CHAR_LIMITS.protection_physique_autre) {
      e.protection_physique_autre = `La précision ne peut pas dépasser ${CHAR_LIMITS.protection_physique_autre} caractères.`;
    }

    if (data.protection_incendie.length === 0) e.protection_incendie = "Sélectionnez au moins une protection.";
    if (data.protection_incendie.includes("autre") && !data.protection_incendie_autre.trim()) {
      e.protection_incendie_autre = "Veuillez préciser l'autre protection.";
    } else if (data.protection_incendie_autre.length > CHAR_LIMITS.protection_incendie_autre) {
      e.protection_incendie_autre = `La précision ne peut pas dépasser ${CHAR_LIMITS.protection_incendie_autre} caractères.`;
    }

    if (data.equipement_inspection.length === 0) e.equipement_inspection = "Sélectionnez au moins un équipement.";
    if (data.permis_requis.length === 0) e.permis_requis = "Sélectionnez au moins un permis.";
    if (data.surveillance_requise.length === 0) e.surveillance_requise = "Sélectionnez au moins une surveillance.";

    // Character limit validations
    if (!data.aucun_commentaire) {
      if (!data.commentaires.trim()) {
        e.commentaires = "Champ requis ou cochez 'Aucun commentaire'.";
      } else if (data.commentaires.length > CHAR_LIMITS.commentaires) {
        e.commentaires = `Les commentaires ne peuvent pas dépasser ${CHAR_LIMITS.commentaires} caractères.`;
      }
    }

    if (data.description_tache.length > CHAR_LIMITS.description_tache) {
      e.description_tache = `La description ne peut pas dépasser ${CHAR_LIMITS.description_tache} caractères.`;
    }

    if (!data.resp_construction_nom.trim()) e.resp_construction_nom = "Nom requis.";
    if (!data.resp_construction_date) e.resp_construction_date = "Date requise.";
    if (!data.resp_construction_file) e.resp_construction_file = "Signature requise.";

    if (!data.resp_hse_nom.trim()) e.resp_hse_nom = "Nom requis.";
    if (!data.resp_hse_date) e.resp_hse_date = "Date requise.";
    if (!data.resp_hse_file) e.resp_hse_file = "Signature requise.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildFormData = (data) => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      
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

  const resetForm = () => {
    setData({
      ...getInitialFormData(contractorName, companyName),
      numero_permis: generatePermitNumber(), // Generate new permit number
    });
    setErrors({});
  };

  const showSuccessAlert = () => {
    Swal.fire({
      title: 'Succès!',
      text: 'Permis de travail à chaud créé avec succès',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3085d6',
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Erreur!',
      text: message || 'Erreur lors de la soumission. Veuillez vérifier les champs.',
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33',
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      showErrorAlert("Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    setIsSubmitting(true);

    const formData = buildFormData(data);

    console.log('Submitting form data...');

    router.post(route("contractant.permis-travail-chaud.store"), formData, {
      forceFormData: true,
      onSuccess: () => {
        console.log('Form submitted successfully');
        setIsSubmitting(false);
        showSuccessAlert();
        resetForm(); // Reset the form to empty state
      },
      onError: (errors) => {
        console.log('Form errors:', errors);
        setErrors(errors);
        setIsSubmitting(false);
        showErrorAlert();
      },
      onFinish: () => {
        setIsSubmitting(false);
      }
    });
  };

  // If mode is not 'create', show different views
  if (mode === 'index') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden flex">
        <ContractantSidebar />
        <div className="flex-1 flex flex-col">
          <ContractantTopHeader 
            contractor={auth?.user}
            showBackButton={true}
            backRoute={route('contractant.home')}
            backLabel="Retour au tableau de bord"
          />
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Mes permis de travail à chaud</h1>
            {/* Add your index view content here */}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'show') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden flex">
        <ContractantSidebar />
        <div className="flex-1 flex flex-col">
          <ContractantTopHeader 
            contractor={auth?.user}
            showBackButton={true}
            backRoute={route('contractant.permis-travail-chaud.index')}
            backLabel="Retour à la liste"
          />
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Détails du permis</h1>
            {/* Add your show view content here */}
          </div>
        </div>
      </div>
    );
  }

  // Create view
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
            contractor={auth?.user}
            showBackButton={true}
            backRoute={route('contractant.home')}
            backLabel="Retour au tableau de bord"
          />

          <div className="relative z-10 px-3 sm:px-4 md:px-6 pb-6 md:pb-12 flex-1 pt-4 md:pt-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center mb-6 md:mb-12"
              >
                <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 md:mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Permis de travail à chaud
                  </span>
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm md:text-lg">
                  Remplissez et soumettez votre permis de travail à chaud
                </p>
              </motion.div>

              <motion.form 
                onSubmit={onSubmit} 
                className="space-y-4 md:space-y-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mb-4 md:mb-8 rounded-lg md:rounded-3xl border border-gray-200 bg-white shadow-lg overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between px-3 md:px-6 py-3 md:py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-2 md:gap-3 mb-2 sm:mb-0">
                      <img src="/images/logo.png" alt="ParkX" className="h-6 md:h-8 w-auto" />
                      <h1 className="text-gray-800 font-semibold tracking-wide uppercase text-sm md:text-lg">
                        PERMIS DE TRAVAIL A CHAUD
                      </h1>
                    </div>

                    <div className="mt-2 sm:mt-0">
                      <div className="text-xs md:text-sm text-gray-700">NUMÉRO DE PERMIS</div>
                      <Text
                        readOnly
                        value={data.numero_permis}
                        className="bg-gray-100 text-xs md:text-sm"
                      />
                      <FieldError>{errors.numero_permis}</FieldError>
                    </div>
                  </div>
                </motion.div>

                {/* IDENTIFICATION */}
                <Section title="IDENTIFICATION">
                  <div className="grid grid-cols-1 gap-3 md:gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <Label>Endroit</Label>
                      <select
                        value={data.site_id}
                        onChange={(e) => set("site_id", e.target.value)}
                        className="w-full rounded-lg md:rounded-xl border border-gray-300 bg-white px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                      >
                        <option value="" disabled>Choisir un site…</option>
                        {sites.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      <FieldError>{errors.site_id}</FieldError>
                    </div>

                    <div>
                      <Label>De (Date de début)</Label>
                      <Text
                        type="date"
                        value={data.date_debut}
                        onChange={(e) => set("date_debut", e.target.value)}
                      />
                      <FieldError>{errors.date_debut}</FieldError>
                    </div>

                    <div>
                      <Label>À (Date de fin)</Label>
                      <Text
                        type="date"
                        value={data.date_fin}
                        onChange={(e) => set("date_fin", e.target.value)}
                      />
                      <FieldError>{errors.date_fin}</FieldError>
                    </div>

                    <div className="md:col-span-2">
                      <Label>Description de la tâche</Label>
                      <div className="space-y-2">
                        <Area
                          value={data.description_tache}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= CHAR_LIMITS.description_tache) {
                              set("description_tache", value);
                            }
                          }}
                          rows={3}
                          placeholder={`Décrivez la tâche à effectuer (maximum ${CHAR_LIMITS.description_tache} caractères)...`}
                          maxChars={CHAR_LIMITS.description_tache}
                          currentLength={data.description_tache.length}
                        />
                        <div className="flex justify-between items-center text-xs">
                          <span className={`${data.description_tache.length > CHAR_LIMITS.description_tache * 0.9 ? 'text-amber-600' : 'text-gray-500'}`}>
                            {data.description_tache.length} / {CHAR_LIMITS.description_tache} caractères
                          </span>
                          {data.description_tache.length > CHAR_LIMITS.description_tache * 0.9 && (
                            <span className="text-amber-600 font-medium">
                              Attention: approche de la limite
                            </span>
                          )}
                        </div>
                      </div>
                      <FieldError>{errors.description_tache}</FieldError>
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
                      <Label>Date du plan sécuritaire</Label>
                      <Text
                        type="date"
                        value={data.date_plan_securitaire}
                        onChange={(e) => set("date_plan_securitaire", e.target.value)}
                      />
                      <FieldError>{errors.date_plan_securitaire}</FieldError>
                    </div>

                    <div>
                      <Label>Contractant demandeur du permis</Label>
                      <Text
                        readOnly
                        value={data.contractant_demandeur}
                        placeholder="Nom du contractant demandeur"
                        className="bg-gray-50 text-gray-600"
                      />
                    
                      <FieldError>{errors.contractant_demandeur}</FieldError>
                    </div>

                    <div>
                      <Label>Contractant effectuant le travail</Label>
                      <Text
                        value={data.contractant_travail}
                        onChange={(e) => set("contractant_travail", e.target.value)}
                        placeholder="Nom du contractant effectuant le travail"
                        readOnly={data.meme_que_demandeur}
                        className={data.meme_que_demandeur ? "bg-gray-50 text-gray-600" : ""}
                      />
                      <FieldError>{errors.contractant_travail}</FieldError>
                      <label className="mt-2 flex items-center gap-2 text-xs md:text-sm text-gray-700">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black/20"
                          checked={data.meme_que_demandeur}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setData((d) => ({
                              ...d,
                              meme_que_demandeur: checked,
                              contractant_travail: checked ? d.contractant_demandeur : d.contractant_travail,
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

                {/* DANGERS PARTICULIERS */}
                <Section title="DANGERS PARTICULIERS">
                  <CheckboxGroup
                    legend="Sélectionner les dangers"
                    options={optDangers}
                    values={data.dangers}
                    setValues={(v) => set("dangers", v)}
                    showOtherField={true}
                    otherValue={data.danger_autre}
                    onOtherChange={(v) => set("danger_autre", v)}
                    otherError={errors.danger_autre}
                    error={errors.dangers}
                  />
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs md:text-sm text-yellow-800">
                      En présence de ces risques particuliers, des mesures appropriées doivent être mises en place 
                      afin d'éliminer ou de réduire les risques à un niveau acceptable. Le travail à chaud est 
                      interdit dans un atmosphère dangereux.
                    </p>
                  </div>
                </Section>

                {/* ÉQUIPEMENT DE PROTECTION PERSONNELLE REQUIS */}
                <Section title="ÉQUIPEMENT DE PROTECTION PERSONNELLE REQUIS">
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs md:text-sm text-blue-800 font-semibold">
                      Lunettes de sécurité, chapeau, bottes, gants et manches longues sont toujours requis
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
                    <div>
                      <CheckboxGroup
                        legend="PROTECTION PHYSIQUE"
                        options={optProtectionPhysique}
                        values={data.protection_physique}
                        setValues={(v) => set("protection_physique", v)}
                        showOtherField={true}
                        otherValue={data.protection_physique_autre}
                        onOtherChange={(v) => set("protection_physique_autre", v)}
                        otherError={errors.protection_physique_autre}
                        error={errors.protection_physique}
                      />
                    </div>
                    <div>
                      <CheckboxGroup
                        legend="PROTECTION RESPIRATOIRE"
                        options={optProtectionRespiratoire}
                        values={data.protection_respiratoire}
                        setValues={(v) => set("protection_respiratoire", v)}
                        error={errors.protection_respiratoire}
                      />
                    </div>
                  </div>
                </Section>

                {/* ÉQUIPEMENT DE PROTECTION */}
                <Section title="ÉQUIPEMENT DE PROTECTION">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <CheckboxGroup
                        legend="PROTECTION INCENDIE"
                        options={optProtectionIncendie}
                        values={data.protection_incendie}
                        setValues={(v) => set("protection_incendie", v)}
                        showOtherField={true}
                        otherValue={data.protection_incendie_autre}
                        onOtherChange={(v) => set("protection_incendie_autre", v)}
                        otherError={errors.protection_incendie_autre}
                        error={errors.protection_incendie}
                      />
                    </div>
                    <div>
                      <CheckboxGroup
                        legend="ÉQUIPEMENT D'INSPECTION"
                        options={optEquipementInspection}
                        values={data.equipement_inspection}
                        setValues={(v) => set("equipement_inspection", v)}
                        error={errors.equipement_inspection}
                      />
                    </div>
                    <div>
                      <CheckboxGroup
                        legend="PERMIS"
                        options={optPermis}
                        values={data.permis_requis}
                        setValues={(v) => set("permis_requis", v)}
                        error={errors.permis_requis}
                      />
                    </div>
                    <div>
                      <CheckboxGroup
                        legend="SURVEILLANCE REQUISE"
                        options={optSurveillance}
                        values={data.surveillance_requise}
                        setValues={(v) => set("surveillance_requise", v)}
                        error={errors.surveillance_requise}
                      />
                    </div>
                  </div>
                </Section>

                {/* COMMENTAIRES */}
                <Section title="COMMENTAIRES ET RECOMMANDATIONS PARTICULIÈRES">
                  <div className="mb-4">
                    <CheckRow
                      checked={data.aucun_commentaire}
                      onChange={(v) => set("aucun_commentaire", v)}
                      label="Aucun commentaire additionnel ou recommandation"
                    />
                  </div>
                  {!data.aucun_commentaire && (
                    <div className="space-y-2">
                      <Area
                        value={data.commentaires}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Limit to 250 characters
                          if (value.length <= CHAR_LIMITS.commentaires) {
                            set("commentaires", value);
                          }
                        }}
                        placeholder={`Saisissez vos commentaires et recommandations (maximum ${CHAR_LIMITS.commentaires} caractères)...`}
                        rows={4}
                        maxChars={CHAR_LIMITS.commentaires}
                        currentLength={data.commentaires.length}
                      />
                      <div className="flex justify-between items-center text-xs">
                        <span className={`${data.commentaires.length > CHAR_LIMITS.commentaires * 0.9 ? 'text-amber-600' : 'text-gray-500'}`}>
                          {data.commentaires.length} / {CHAR_LIMITS.commentaires} caractères
                        </span>
                        {data.commentaires.length > CHAR_LIMITS.commentaires * 0.9 && (
                          <span className="text-amber-600 font-medium">
                            Attention: approche de la limite
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <FieldError>{errors.commentaires}</FieldError>
                </Section>

                {/* SIGNATURES */}
                <Section title="SIGNATURES D'AUTORISATION DE PERMIS">
                  <div className="mb-4 md:mb-6">
                    <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4">
                      Le contractant qui exécute les travaux comprend l'étendue des travaux, la nature des dangers, 
                      les mesures préventives et fera en sorte que ces exigences sont suivies. Le personnel assigné 
                      aux travaux devra être informé des dangers et des mesures préventives.
                    </p>
                    
                    <p className="text-xs md:text-sm font-semibold text-gray-800">
                      Superviseur du contractant effectuant les travaux :
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
                    <div>
                      <Label>Responsable construction — Nom en lettres moulées</Label>
                      <Text
                        value={data.resp_construction_nom}
                        onChange={(e) => set("resp_construction_nom", e.target.value)}
                      />
                      <FieldError>{errors.resp_construction_nom}</FieldError>
                      <div className="mt-3 grid grid-cols-1 gap-3">
                        <SignaturePicker
                          id="resp_construction_file"
                          label="Signature (JPG/PNG)"
                          value={data.resp_construction_file}
                          onChange={(file) => set("resp_construction_file", file)}
                          error={errors.resp_construction_file}
                        />
                        <div>
                          <Label>Date</Label>
                          <Text
                            type="date"
                            value={data.resp_construction_date}
                            onChange={(e) => set("resp_construction_date", e.target.value)}
                          />
                          <FieldError>{errors.resp_construction_date}</FieldError>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Responsable HSE — Nom en lettres moulées</Label>
                      <Text
                        value={data.resp_hse_nom}
                        onChange={(e) => set("resp_hse_nom", e.target.value)}
                      />
                      <FieldError>{errors.resp_hse_nom}</FieldError>
                      <div className="mt-3 grid grid-cols-1 gap-3">
                        <SignaturePicker
                          id="resp_hse_file"
                          label="Signature (JPG/PNG)"
                          value={data.resp_hse_file}
                          onChange={(file) => set("resp_hse_file", file)}
                          error={errors.resp_hse_file}
                        />
                        <div>
                          <Label>Date</Label>
                          <Text
                            type="date"
                            value={data.resp_hse_date}
                            onChange={(e) => set("resp_hse_date", e.target.value)}
                          />
                          <FieldError>{errors.resp_hse_date}</FieldError>
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>

                {/* ACTIONS */}
                <motion.div 
                  className="flex items-center justify-end gap-3 md:gap-4 pb-2 pt-4 md:pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className={`rounded-lg md:rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 md:px-8 py-2 md:py-3 text-xs md:text-sm font-semibold text-white shadow-lg transition-all duration-300 ${
                      isSubmitting 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:from-blue-600 hover:to-purple-600'
                    }`}
                  >
                    {isSubmitting ? 'Soumission...' : 'Soumettre'}
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