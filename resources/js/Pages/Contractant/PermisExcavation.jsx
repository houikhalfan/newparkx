// resources/js/Pages/Contractant/PermisExcavation.jsx
import React, { useEffect, useMemo, useState } from "react";
import { usePage, useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import ContractantLayout from "@/Pages/ContractantLayout";
import ContractantSidebar from '@/Components/ContractantSidebar';
import ContractantTopHeader from '@/Components/ContractantTopHeader';
import { FileText, Calendar, Download, Search, X, Menu } from 'lucide-react';

/* --------------------------- UI building blocks --------------------------- */
const BRAND = "#0E8A5D"; // ParkX green

const FormCard = ({ title, children }) => (
  <div className="rounded-sm border border-gray-300 bg-white overflow-hidden mb-6">
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <h2 className="text-lg font-bold text-gray-800">
        {title}
      </h2>
    </div>
    <div className="p-6 bg-white">{children}</div>
  </div>
);

const Row = ({ label, children, className = "" }) => (
  <div
    className={[
      "flex flex-col gap-3 py-4 border-b border-gray-100 last:border-b-0",
      className,
    ].join(" ")}
  >
    <div className="w-full">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
    </div>
    <div className="flex-1 min-w-0">{children}</div>
  </div>
);

const inputBase =
  "w-full rounded-md px-4 py-3 text-sm outline-none transition-all duration-300 shadow-sm border border-gray-300 text-gray-800 placeholder-gray-500";
const inputActive =
  "bg-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500/20";
const inputDisabled = "bg-gray-100 text-gray-500";

const Text = ({ disabled, ...rest }) => (
  <input
    {...rest}
    disabled={disabled}
    className={[inputBase, disabled ? inputDisabled : inputActive].join(" ")}
  />
);

const Area = ({ rows = 3, disabled, maxLength, value, ...rest }) => {
  const charCount = value?.length || 0;
  const isNearLimit = maxLength && charCount > maxLength * 0.8;
  const isOverLimit = maxLength && charCount > maxLength;
  
  return (
    <div className="relative">
      <textarea
        rows={rows}
        disabled={disabled}
        value={value}
        maxLength={maxLength}
        {...rest}
        className={[
          inputBase, 
          'resize-none',
          disabled ? inputDisabled : inputActive,
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
  children ? <p className="mt-1 text-xs text-red-500">{children}</p> : null;

const CheckLine = ({ children, checked, onChange, disabled }) => (
  <label
    className={[
      "flex items-start gap-3 py-2 text-sm",
      disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
    ].join(" ")}
  >
    <input
      type="checkbox"
      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-700 focus:ring-gray-500 flex-shrink-0"
      checked={!!checked}
      onChange={(e) => onChange?.(e.target.checked)}
      disabled={disabled}
    />
    <span className="text-gray-700 leading-5 flex-1 min-w-0">{children}</span>
  </label>
);

/** Signature picker that also previews stored string paths in readonly mode */
function SignaturePicker({ id, label, value, onChange, disabled, error }) {
  const [preview, setPreview] = useState(null);
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const isFile = value instanceof File;
  const isStoredPath = typeof value === "string" && value.trim().length > 0;

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700 mb-2"
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
        className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-white file:bg-gray-700 transition-all duration-300 file:text-sm"
      />

      {/* Live File preview */}
      {isFile && (
        <img
          src={preview || URL.createObjectURL(value)}
          alt="Signature"
          className="mt-3 h-20 w-auto rounded-md border border-gray-300 bg-gray-50 shadow-sm"
        />
      )}

      {/* Stored path preview in readonly */}
      {!isFile && isStoredPath && (
        <img
          src={`/storage/${value}`}
          alt="Signature"
          className="mt-3 h-20 w-auto rounded-md border border-gray-300 bg-gray-50 shadow-sm"
        />
      )}

      <FieldError>{error}</FieldError>
    </div>
  );
}

/* ================================= PAGE ================================== */
export default function PermisExcavation() {
  const {
    auth,
    sites = [],
    flash,
    permis = null,
    readonly = false,
    showFermeture = false,
    showSignatureResponsableSite = false 
  } = usePage().props || {};
  const contractor = auth?.contractor;

  /* ------------------------------ Options ------------------------------ */
  const optExcavationEst = useMemo(
    () => [
      { key: "prof_12", label: "> 1,2 mètres de prof." },
      { key: "prof_18", label: "> 1,8 mètres de prof." },
      { key: "prof_30", label: "> 3,0 mètres de prof." },
      { key: "moins_3_rive", label: "< 3 mètres de : du bord de la rive" },
      { key: "moins_3_pente", label: "< 3 mètres de : d'une pente" },
      { key: "moins_3_route", label: "< 3 mètres de : d'une route" },
    ],
    []
  );

  const optConduites = useMemo(
    () => [
      { key: "electrique", label: "Électrique" },
      { key: "drainage", label: "Drainage" },
      { key: "incendie", label: "Protection incendie" },
      { key: "oleoduc", label: "Oléoduc" },
      { key: "eau", label: "Conduite d'eau" },
      { key: "procede", label: "Conduit de procédé" },
      { key: "telecom", label: "Câbles téléphoniques" },
      { key: "fibre", label: "Fibre optique" },
      { key: "fondations", label: "Fondations / Infrastructures" },
      { key: "bornes", label: "Bornes géodésiques" },
      { key: "dynamitage", label: "Requiert dynamitage" },
    ],
    []
  );

  const optSituations = useMemo(
    () => [
      { key: "pluie", label: "Pluie abondante récemment" },
      { key: "infiltration", label: "Infiltration d'eau souterraine" },
      { key: "terrain", label: "Terrain instable" },
      { key: "autre", label: "Autre (préciser ci-dessous)" },
    ],
    []
  );

  const optEpiSimples = useMemo(
    () => [{ key: "harnais", label: "Harnaisiens de retenue" }],
    []
  );

  const optEquip = useMemo(
    () => [
      { key: "stabilite", label: "Note de stabilité du terrain et des parois" },
      { key: "revision_dessins", label: "Révision des dessins" },
      { key: "identification_ouvrages", label: "Identification des ouvrages souterrains" },
      { key: "barricades_signaux", label: "Barricades et signaux d'avertissement" },
      {
        key: "barricades_11m",
        label: "Barricades de 1,1 mètres installées à proximité des excavations de plus de 1,8 mètres de profondeur",
      },
      {
        key: "excavation_045",
        label: "Excavation manuelle à moins de 0,45 mètre d'un conduit souterrain",
      },
      {
        key: "degagement_06",
        label: "Dégagement de 0,6 mètre entre la paroi de l'excavation et l'équipement",
      },
      {
        key: "vehicules_2m",
        label: "Véhicules interdits à moins de 2 mètres de l'excavation",
      },
      {
        key: "empilement_12",
        label: "Aucun empilement de matériel à moins de 1,2 mètres de l'excavation",
      },
      { key: "echelle_10m", label: "Échelle ou rampe d'accès à tous les 10 m" },
      { key: "etayage", label: "Étayage" },
    ],
    []
  );

  /* ------------------------------ Helpers ------------------------------ */
  const contractorName = contractor && contractor.name ? contractor.name : "GENERIC";
  
  // Add this helper to format the demandeur name
  const getContractorDisplayName = () => {
    if (!contractor) return "";
    
    const name = contractor.name || "";
    const companyName = contractor.company_name || "";
    
    if (name && companyName) {
      return `${name} - ${companyName}`;
    } else if (name) {
      return name;
    } else if (companyName) {
      return companyName;
    }
    return "";
  };

  function generatePermitNumber(contractorName = "GENERIC") {
    const date = new Date();
    const yyyyMMdd = date.toISOString().slice(0, 10).replace(/-/g, "");
    const rand = Math.floor(1000 + Math.random() * 9000); // 4 digits
    const slug = contractorName.toUpperCase().replace(/\s+/g, "").slice(0, 8);
    return `PX-${slug}-${yyyyMMdd}-${rand}`;
  }

  const normalizeArray = (val) =>
  Array.isArray(val) ? val : val ? [val] : [];

  // Pre-fill from permis (read or edit context)
  const initialState = permis
    ? {
        // HEADER
        numero_permis_general: permis.numero_permis_general || "",
      numero_permis: permis.numero_permis || "",

        // IDENTIFICATION
        site_id: permis.site_id || "",
        duree_de: permis.duree_de || "",
        duree_a: permis.duree_a || "",
        description: permis.description || "",
        analyse_par: permis.analyse_par || "",
        date_analyse: permis.date_analyse || "",
        demandeur: permis.demandeur || getContractorDisplayName(),
        contractant: permis.contractant || "",
        meme_que_demandeur: !!permis.meme_que_demandeur,

        // DANGERS
        danger_aucun: !!permis.danger_aucun,
        excavation_est: normalizeArray(permis.excavation_est),
        conduites: normalizeArray(permis.conduites),
        situations: normalizeArray(permis.situations),
        situation_autre: permis.situation_autre || "",

        // EPI
        epi_sans_additionnel: !!permis.epi_sans_additionnel,
        epi_simples: normalizeArray(permis.epi_simples),
        epi_autre: permis.epi_autre || "",

        // ÉQUIPEMENT
        equip_non_requis: !!permis.equip_non_requis,
        equip_checks: normalizeArray(permis.equip_checks),
        equip_autre: permis.equip_autre || "",

        // COMMENTAIRES & PROPRIÉTAIRE
        aucun_commentaire: !!permis.aucun_commentaire,
        commentaires: permis.commentaires || "",
        proprietaire_nom: permis.proprietaire_nom || "",
        proprietaire_signature: permis.proprietaire_signature || null,
        proprietaire_date: permis.proprietaire_date || "",

        // AUTORISATION
        autor_q1: !!permis.autor_q1,
        autor_q2: !!permis.autor_q2,
        autor_q3: !!permis.autor_q3,

        sig_resp_construction_nom: permis.sig_resp_construction_nom || "",
        sig_resp_construction_date: permis.sig_resp_construction_date || "",
        sig_resp_construction_file: permis.sig_resp_construction_file || null,

        sig_resp_hse_nom: permis.sig_resp_hse_nom || "",
        sig_resp_hse_date: permis.sig_resp_hse_date || "",
        sig_resp_hse_file: permis.sig_resp_hse_file || null,

        // FERMETURE (kept in state but not shown for contractant)
        ferm_q1: !!permis.ferm_q1,
        ferm_q2: !!permis.ferm_q2,
        ferm_q3: !!permis.ferm_q3,
        ferm_q4: !!permis.ferm_q4,
        ferm_q5: !!permis.ferm_q5,
        ferm_q6: !!permis.ferm_q6,
        ferm_suivi_detail: permis.ferm_suivi_detail || "",
        ferm_resp_construction_nom: permis.ferm_resp_construction_nom || "",
        ferm_resp_construction_date: permis.ferm_resp_construction_date || "",
        ferm_resp_construction_file: permis.ferm_resp_construction_file || null,
        ferm_resp_hse_nom: permis.ferm_resp_hse_nom || "",
        ferm_resp_hse_date: permis.ferm_resp_hse_date || "",
        ferm_resp_hse_file: permis.ferm_resp_hse_file || null,
      }
    : {
   // HEADER
  numero_permis_general: "",   // 👈 empty so user can type manually
  numero_permis: generatePermitNumber(contractorName),
        // IDENTIFICATION
        site_id: "",
        duree_de: "",
        duree_a: "",
        description: "",
        analyse_par: "",
        date_analyse: "",
        demandeur: getContractorDisplayName(), // 👈 Auto-filled with contractor info
        contractant: contractorName || "",
        meme_que_demandeur: false,

        // DANGERS
        danger_aucun: false,
        excavation_est: [],
        conduites: [],
        situations: [],
        situation_autre: "",

        // EPI
        epi_sans_additionnel: false,
        epi_simples: [],
        epi_autre: "",

        // ÉQUIPEMENT
        equip_non_requis: false,
        equip_checks: [],
        equip_autre: "",

        // COMMENTAIRES & PROPRIÉTAIRE
        aucun_commentaire: false,
        commentaires: "",
        proprietaire_nom: "",
        proprietaire_signature: null,
        proprietaire_date: "",

        // AUTORISATION
        autor_q1: false,
        autor_q2: false,
        autor_q3: false,

        sig_resp_construction_nom: "",
        sig_resp_construction_date: "",
        sig_resp_construction_file: null,

        sig_resp_hse_nom: "",
        sig_resp_hse_date: "",
        sig_resp_hse_file: null,

        // FERMETURE (hidden now)
        ferm_q1: false,
        ferm_q2: false,
        ferm_q3: false,
        ferm_q4: false,
        ferm_q5: false,
        ferm_q6: false,
        ferm_suivi_detail: "",
        ferm_resp_construction_nom: "",
        ferm_resp_construction_date: "",
        ferm_resp_construction_file: null,
        ferm_resp_hse_nom: "",
        ferm_resp_hse_date: "",
        ferm_resp_hse_file: null,
      };

  const { data, setData, post, processing, errors } = useForm(initialState);

  const toggleArray = (key, val) => {
    const s = new Set(Array.isArray(data[key]) ? data[key] : []);
    s.has(val) ? s.delete(val) : s.add(val);
    setData(key, Array.from(s));
  };

  const validateForm = () => {
    const requiredFields = [
      "site_id", "duree_de", "duree_a", "description",
      "analyse_par", "date_analyse", "demandeur", "contractant",
      "proprietaire_nom", "proprietaire_signature", "proprietaire_date",
      "sig_resp_construction_nom", "sig_resp_construction_date", "sig_resp_construction_file",
      "sig_resp_hse_nom", "sig_resp_hse_date", "sig_resp_hse_file"
    ];

    for (let f of requiredFields) {
      if (!data[f] || (typeof data[f] === "string" && data[f].trim() === "")) {
        alert(`Veuillez remplir le champ requis: ${f}`);
        return false;
      }
    }

    if (!data.danger_aucun && data.excavation_est.length === 0 && data.conduites.length === 0 && data.situations.length === 0) {
      alert("Veuillez sélectionner au moins un danger particulier ou cocher 'Aucun'");
      return false;
    }
    if (!data.epi_sans_additionnel && data.epi_simples.length === 0 && !data.epi_autre) {
      alert("Veuillez sélectionner au moins un EPI ou cocher 'Sans EPI additionnel'");
      return false;
    }
    if (!data.equip_non_requis && data.equip_checks.length === 0 && !data.equip_autre) {
      alert("Veuillez sélectionner au moins une mesure d'équipement ou cocher 'non requis'");
      return false;
    }

    return true;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (readonly) return;
    if (!validateForm()) return;

    const filtered = Object.fromEntries(
      Object.entries(data).filter(([k]) => !k.startsWith("ferm_"))
    );

    post(route("contractant.permisexcavation.store"), {
      data: filtered,
      forceFormData: true,
      onSuccess: () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    });
  };

  const logoSrc = "/images/logo.png";

  /* ----------------------------------- UI ---------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden flex">
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:block">
        <ContractantSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
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
                <div className="bg-green-50 backdrop-blur-sm border border-green-200 rounded-lg p-4 flex items-center space-x-3 shadow-sm">
                  <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-700 font-medium text-sm">{flash.success}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 px-6 pb-8 flex-1 pt-8">
          <div className="max-w-6xl mx-auto">
            {/* Main Form Container with Thin Frame */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="border border-gray-300 rounded-sm bg-white overflow-hidden mb-8"
            >
              {/* Document Header - Centered Logo and Title */}
              <div className="px-8 py-6 bg-white border-b border-gray-300">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  {/* Centered Logo and Title */}
                  <div className="flex items-center justify-center space-x-4">
                    <img src={logoSrc} alt="ParkX" className="h-12 w-auto" />
                    <h1 className="text-2xl font-bold text-gray-800 tracking-wide uppercase">
                      PERMIS D'EXCAVATION
                    </h1>
                  </div>
                </div>

                {/* Permit Numbers */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {/* NUMÉRO DE PERMIS GÉNÉRAL */}
                  <div className="text-center">
                    <div className="text-sm text-gray-700 font-medium mb-2">NUMÉRO DE PERMIS GÉNÉRAL</div>
                    <div>
                      <Text
                        disabled={readonly}
                        value={data.numero_permis_general}
                        onChange={(e) => setData("numero_permis_general", e.target.value)}
                        placeholder=""
                        className="text-center"
                      />
                      <FieldError>{errors.numero_permis_general}</FieldError>
                    </div>
                  </div>

                  {/* NUMÉRO DE PERMIS */}
                  <div className="text-center">
                    <div className="text-sm text-gray-700 font-medium mb-2">NUMÉRO DE PERMIS</div>
                    <div>
                      <Text
                        disabled
                        value={data.numero_permis || generatePermitNumber(contractorName)}
                        className="text-center"
                      />
                      <FieldError>{errors.numero_permis}</FieldError>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8 bg-white">
                <form onSubmit={onSubmit} className="space-y-6">
                  {/* IDENTIFICATION */}
                  <FormCard title="Identification">
                    <Row label="Endroit / Plan">
                      <select
                        value={data.site_id}
                        disabled={readonly}
                        onChange={(e) => setData("site_id", e.target.value)}
                        className="w-full rounded-md px-4 py-3 bg-white border border-gray-300 text-gray-800 placeholder-gray-500 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/20 transition-all duration-300 text-sm"
                      >
                        <option value="" disabled className="bg-gray-100 text-gray-800">
                          Choisir un site…
                        </option>
                        {sites.map((s) => (
                          <option key={s.id} value={s.id} className="bg-white text-gray-800">
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <FieldError>{errors.site_id}</FieldError>
                    </Row>

                    <Row label="Durée">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <Text
                            type="date"
                            disabled={readonly}
                            value={data.duree_de}
                            onChange={(e) => setData("duree_de", e.target.value)}
                          />
                          <FieldError>{errors.duree_de}</FieldError>
                        </div>
                        <div>
                          <Text
                            type="date"
                            disabled={readonly}
                            value={data.duree_a}
                            onChange={(e) => setData("duree_a", e.target.value)}
                          />
                          <FieldError>{errors.duree_a}</FieldError>
                        </div>
                      </div>
                    </Row>

                    <Row label="Description du travail">
                      <Area
                        disabled={readonly}
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        maxLength={100}
                        rows={2}
                      />
                      <FieldError>{errors.description}</FieldError>
                    </Row>

                    <Row label="Analyse des risques réalisée par">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <Text
                            disabled={readonly}
                            value={data.analyse_par}
                            onChange={(e) => setData("analyse_par", e.target.value)}
                          />
                          <FieldError>{errors.analyse_par}</FieldError>
                        </div>
                        <div>
                          <Text
                            type="date"
                            disabled={readonly}
                            value={data.date_analyse}
                            onChange={(e) => setData("date_analyse", e.target.value)}
                          />
                          <FieldError>{errors.date_analyse}</FieldError>
                        </div>
                      </div>
                    </Row>

                    <Row label="Demandeur du permis">
                      <Text
                        disabled={true} // Make it read-only
                        value={data.demandeur}
                        className="bg-gray-100 cursor-not-allowed" // Visual indication it's auto-filled
                      />
                      <FieldError>{errors.demandeur}</FieldError>
                    </Row>

                    <Row label="Contractant effectuant le travail">
                      <div>
                        <Text
                          disabled={readonly}
                          value={data.contractant}
                          onChange={(e) => setData("contractant", e.target.value)}
                        />
                        <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-gray-700 focus:ring-gray-500"
                            disabled={readonly}
                            checked={!!data.meme_que_demandeur}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setData("meme_que_demandeur", checked);
                              if (checked) setData("contractant", getContractorDisplayName());
                            }}
                          />
                          Même que demandeur
                        </label>
                      </div>
                      <FieldError>{errors.contractant}</FieldError>
                    </Row>
                  </FormCard>

                  {/* DANGERS PARTICULIERS */}
                  <FormCard title="Dangers particuliers">
                    <Row label="Aucun">
                      <CheckLine
                        checked={!!data.danger_aucun}
                        onChange={(v) => setData("danger_aucun", v)}
                        disabled={readonly}
                      >
                        Aucun
                      </CheckLine>
                    </Row>

                    <Row label="L'excavation est :">
                      <div className="divide-y divide-gray-100 space-y-0">
                        {optExcavationEst.map((o) => (
                          <div key={o.key} className="py-2 first:pt-0 last:pb-0">
                            <CheckLine
                              checked={Array.isArray(data.excavation_est) && data.excavation_est.includes(o.key)}
                              onChange={() => toggleArray("excavation_est", o.key)}
                              disabled={readonly || data.danger_aucun}
                            >
                              {o.label}
                            </CheckLine>
                          </div>
                        ))}
                      </div>
                    </Row>

                    <Row label="Conduites / Tuyauterie souterraine">
                      <div className="divide-y divide-gray-100 space-y-0">
                        {optConduites.map((o) => (
                          <div key={o.key} className="py-2 first:pt-0 last:pb-0">
                            <CheckLine
                              checked={Array.isArray(data.conduites) && data.conduites.includes(o.key)}
                              onChange={() => toggleArray("conduites", o.key)}
                              disabled={readonly || data.danger_aucun}
                            >
                              {o.label}
                            </CheckLine>
                          </div>
                        ))}
                      </div>
                    </Row>

                    <Row label="Situations dangereuses">
                      <div className="divide-y divide-gray-100 space-y-0">
                        {optSituations.map((o) => (
                          <div key={o.key} className="py-2 first:pt-0 last:pb-0">
                            <CheckLine
                              checked={Array.isArray(data.situations) && data.situations.includes(o.key)}
                              onChange={() => toggleArray("situations", o.key)}
                              disabled={readonly || data.danger_aucun}
                            >
                              {o.label}
                            </CheckLine>
                          </div>
                        ))}
                        {Array.isArray(data.situations) &&
                          data.situations.includes("autre") &&
                          !data.danger_aucun && (
                            <div className="pt-3">
                              <Text
                                placeholder="Autre (préciser)"
                                disabled={readonly}
                                value={data.situation_autre}
                                onChange={(e) => setData("situation_autre", e.target.value)}
                              />
                            </div>
                          )}
                      </div>
                    </Row>
                  </FormCard>

                  {/* ÉPI */}
                  <FormCard title="Équipement de protection personnelle (ÉPI) requis">
                    <Row label="Sans ÉPI additionnel">
                      <CheckLine
                        checked={!!data.epi_sans_additionnel}
                        onChange={(v) => setData("epi_sans_additionnel", v)}
                        disabled={readonly}
                      >
                        Sans ÉPI additionnel
                      </CheckLine>
                    </Row>

                    <Row label="Éléments">
                      <div className="divide-y divide-gray-100 space-y-0">
                        {optEpiSimples.map((o) => (
                          <div key={o.key} className="py-2 first:pt-0 last:pb-0">
                            <CheckLine
                              checked={Array.isArray(data.epi_simples) && data.epi_simples.includes(o.key)}
                              onChange={() => toggleArray("epi_simples", o.key)}
                              disabled={readonly || data.epi_sans_additionnel}
                            >
                              {o.label}
                            </CheckLine>
                          </div>
                        ))}
                        <div className="pt-3">
                          <Text
                            placeholder="Autre"
                            disabled={readonly || data.epi_sans_additionnel}
                            value={data.epi_autre}
                            onChange={(e) => setData("epi_autre", e.target.value)}
                          />
                        </div>
                      </div>
                    </Row>
                  </FormCard>

                  {/* ÉQUIPEMENT DE PROTECTION */}
                  <FormCard title="Équipement de protection">
                    <Row label="Équipement de protection additionnel non requis">
                      <CheckLine
                        checked={!!data.equip_non_requis}
                        onChange={(v) => setData("equip_non_requis", v)}
                        disabled={readonly}
                      >
                        Équipement de protection additionnel non requis
                      </CheckLine>
                    </Row>

                    <Row label="Mesures">
                      <div className={data.equip_non_requis ? "opacity-60" : ""}>
                        <div className="divide-y divide-gray-100 space-y-0">
                          {optEquip.map((o) => (
                            <div key={o.key} className="py-2 first:pt-0 last:pb-0">
                              <CheckLine
                                checked={Array.isArray(data.equip_checks) && data.equip_checks.includes(o.key)}
                                onChange={() => toggleArray("equip_checks", o.key)}
                                disabled={readonly || data.equip_non_requis}
                              >
                                {o.label}
                              </CheckLine>
                            </div>
                          ))}
                        </div>
                        <div className="pt-3">
                          <Text
                            placeholder="Autre"
                            disabled={readonly || data.equip_non_requis}
                            value={data.equip_autre}
                            onChange={(e) => setData("equip_autre", e.target.value)}
                          />
                        </div>
                      </div>
                    </Row>
                  </FormCard>

                  {/* COMMENTAIRES & PROPRIÉTAIRE */}
                  <FormCard title="Commentaires et recommandations particulières">
                    <Row label="Aucun commentaire">
                      <CheckLine
                        checked={!!data.aucun_commentaire}
                        onChange={(v) => setData("aucun_commentaire", v)}
                        disabled={readonly}
                      >
                        Aucun commentaire additionnel ou recommandation
                      </CheckLine>
                    </Row>

                    <Row label="Commentaires">
                      <Area
                        rows={3}
                        disabled={readonly || data.aucun_commentaire}
                        value={data.commentaires}
                        onChange={(e) => setData("commentaires", e.target.value)}
                        maxLength={250}
                      />
                    </Row>

                    <Row label="Propriétaire des lieux (nom en lettres moulées)">
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <div>
                          <Text
                            disabled={readonly}
                            value={data.proprietaire_nom}
                            onChange={(e) => setData("proprietaire_nom", e.target.value)}
                          />
                          <FieldError>{errors.proprietaire_nom}</FieldError>
                        </div>

                        <div className="lg:col-span-2">
                          <SignaturePicker
                            id="prop_sig"
                            label="Signature (JPG/PNG)"
                            value={data.proprietaire_signature}
                            onChange={(f) => setData("proprietaire_signature", f)}
                            disabled={readonly}
                            error={errors.proprietaire_signature}
                          />
                        </div>

                        <div className="lg:col-start-3">
                          <Text
                            type="date"
                            disabled={readonly}
                            value={data.proprietaire_date}
                            onChange={(e) => setData("proprietaire_date", e.target.value)}
                          />
                          <FieldError>{errors.proprietaire_date}</FieldError>
                        </div>
                      </div>
                    </Row>
                  </FormCard>

                  {/* SIGNATURES D'AUTORISATION */}
                  <FormCard title="Signatures d'autorisation de permis">
                    <Row label="Vérifications">
                      <div className="divide-y divide-gray-100 space-y-0">
                        <div className="py-2 first:pt-0 last:pb-0">
                          <CheckLine
                            checked={!!data.autor_q1}
                            onChange={(v) => setData("autor_q1", v)}
                            disabled={readonly}
                          >
                            Les infrastructures souterraines sont identifiées et marquées sur le terrain.
                          </CheckLine>
                        </div>
                        <div className="py-2 first:pt-0 last:pb-0">
                          <CheckLine
                            checked={!!data.autor_q2}
                            onChange={(v) => setData("autor_q2", v)}
                            disabled={readonly}
                          >
                            Les mesures temporaires (barricades, signaux…) sont installées pour protéger la zone.
                          </CheckLine>
                        </div>
                        <div className="py-2 first:pt-0 last:pb-0">
                          <CheckLine
                            checked={!!data.autor_q3}
                            onChange={(v) => setData("autor_q3", v)}
                            disabled={readonly}
                          >
                            L'impact sur la circulation a été évalué et les permis requis ont été demandés.
                          </CheckLine>
                        </div>
                      </div>
                    </Row>

                    <Row label="Responsable construction (Contractant)">
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="space-y-3">
                          <Text
                            placeholder="Nom"
                            disabled={readonly}
                            value={data.sig_resp_construction_nom}
                            onChange={(e) =>
                              setData("sig_resp_construction_nom", e.target.value)
                            }
                            required={!readonly}
                          />
                          <Text
                            type="date"
                            disabled={readonly}
                            value={data.sig_resp_construction_date}
                            onChange={(e) =>
                              setData("sig_resp_construction_date", e.target.value)
                            }
                            required={!readonly}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <FieldError>{errors.sig_resp_construction_nom}</FieldError>
                            <FieldError>{errors.sig_resp_construction_date}</FieldError>
                          </div>
                        </div>

                        <SignaturePicker
                          id="sig_resp_construction"
                          label="Signature (JPG/PNG)"
                          value={data.sig_resp_construction_file}
                          onChange={(f) => setData("sig_resp_construction_file", f)}
                          disabled={readonly}
                          error={errors.sig_resp_construction_file}
                        />
                      </div>
                    </Row>

                    <Row label="Responsable HSE (Contractant)">
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="space-y-3">
                          <Text
                            placeholder="Nom"
                            disabled={readonly}
                            value={data.sig_resp_hse_nom}
                            onChange={(e) => setData("sig_resp_hse_nom", e.target.value)}
                            required={!readonly}
                          />
                          <Text
                            type="date"
                            disabled={readonly}
                            value={data.sig_resp_hse_date}
                            onChange={(e) => setData("sig_resp_hse_date", e.target.value)}
                            required={!readonly}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <FieldError>{errors.sig_resp_hse_nom}</FieldError>
                            <FieldError>{errors.sig_resp_hse_date}</FieldError>
                          </div>
                        </div>

                        <SignaturePicker
                          id="sig_resp_hse"
                          label="Signature (JPG/PNG)"
                          value={data.sig_resp_hse_file}
                          onChange={(f) => setData("sig_resp_hse_file", f)}
                          disabled={readonly}
                          error={errors.sig_resp_hse_file}
                        />
                      </div>
                    </Row>

                    {/* ParkX placeholders (disabled) */}
                    <Row label="Construction manager ParkX">
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 opacity-60">
                        <div className="space-y-3">
                          <Text
                            placeholder="Nom (à compléter par ParkX)"
                            value={data.cm_parkx_nom || ""}
                            disabled
                          />
                          <Text
                            type="date"
                            value={data.cm_parkx_date || ""}
                            disabled
                          />
                        </div>
                        <SignaturePicker
                          id="sig_cm_parkx"
                          label="Signature (désactivée)"
                          value={data.cm_parkx_file}
                          onChange={() => {}}
                          disabled
                        />
                      </div>
                    </Row>

                    <Row label="HSE Manager ParkX">
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 opacity-60">
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

                  {/* FERMETURE — hidden for contractants now, available later for admin */}
                  {showFermeture && (
                    <FormCard title="Fermeture du permis">
                      <Row label="Checklist de fermeture">
                        <div className="divide-y divide-gray-100 space-y-0">
                          <CheckLine
                            checked={!!data.ferm_q1}
                            onChange={(v) => setData("ferm_q1", v)}
                            disabled={readonly}
                          >
                            Le personnel assigné a été avisé que le travail est complété.
                          </CheckLine>
                          <CheckLine
                            checked={!!data.ferm_q2}
                            onChange={(v) => setData("ferm_q2", v)}
                            disabled={readonly}
                          >
                            Les mesures temporaires, barricades et signaux d'avertissement ont été enlevés.
                          </CheckLine>
                          <CheckLine
                            checked={!!data.ferm_q3}
                            onChange={(v) => setData("ferm_q3", v)}
                            disabled={readonly}
                          >
                            Les matériaux, outils et équipements ont été enlevés des lieux de travail.
                          </CheckLine>
                          <CheckLine
                            checked={!!data.ferm_q4}
                            onChange={(v) => setData("ferm_q4", v)}
                            disabled={readonly}
                          >
                            L'excavation a été remblayée.
                          </CheckLine>
                          <CheckLine
                            checked={!!data.ferm_q5}
                            onChange={(v) => setData("ferm_q5", v)}
                            disabled={readonly}
                          >
                            Les dessins ont été mis à jour.
                          </CheckLine>
                          <div className="pt-3">
                            <CheckLine
                              checked={!!data.ferm_q6}
                              onChange={(v) => setData("ferm_q6", v)}
                              disabled={readonly}
                            >
                              Suivi additionnel requis (spécifier)
                            </CheckLine>
                            {data.ferm_q6 && (
                              <div className="mt-3">
                                <Text
                                  placeholder="Précisez le suivi requis"
                                  disabled={readonly}
                                  value={data.ferm_suivi_detail}
                                  onChange={(e) =>
                                    setData("ferm_suivi_detail", e.target.value)
                                  }
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </Row>

                      <Row label="Responsable construction (Contractant)">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                          <div className="space-y-3">
                            <Text
                              placeholder="Nom"
                              disabled={readonly}
                              value={data.ferm_resp_construction_nom}
                              onChange={(e) =>
                                setData("ferm_resp_construction_nom", e.target.value)
                              }
                            />
                            <Text
                              type="date"
                              disabled={readonly}
                              value={data.ferm_resp_construction_date}
                              onChange={(e) =>
                                setData("ferm_resp_construction_date", e.target.value)
                              }
                            />
                          </div>
                          <SignaturePicker
                            id="ferm_sig_resp_construction"
                            label="Signature (JPG/PNG)"
                            value={data.ferm_resp_construction_file}
                            onChange={(f) =>
                              setData("ferm_resp_construction_file", f)
                            }
                            disabled={readonly}
                            error={errors.ferm_resp_construction_file}
                          />
                        </div>
                      </Row>

                      <Row label="Responsable HSE (Contractant)">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                          <div className="space-y-3">
                            <Text
                              placeholder="Nom"
                              disabled={readonly}
                              value={data.ferm_resp_hse_nom}
                              onChange={(e) =>
                                setData("ferm_resp_hse_nom", e.target.value)
                              }
                            />
                            <Text
                              type="date"
                              disabled={readonly}
                              value={data.ferm_resp_hse_date}
                              onChange={(e) =>
                                setData("ferm_resp_hse_date", e.target.value)
                              }
                            />
                          </div>
                          <SignaturePicker
                            id="ferm_sig_resp_hse"
                            label="Signature (JPG/PNG)"
                            value={data.ferm_resp_hse_file}
                            onChange={(f) => setData("ferm_resp_hse_file", f)}
                            disabled={readonly}
                            error={errors.ferm_resp_hse_file}
                          />
                        </div>
                      </Row>

                      {/* ParkX placeholders (disabled) */}
                      <Row label="Construction manager ParkX">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 opacity-60">
                          <div className="space-y-3">
                            <Text placeholder="Nom (à compléter par ParkX)" value={data.cm_parkx_nom || ""} disabled />
                            <Text type="date" value={data.cm_parkx_date || ""} disabled />
                          </div>
                          <SignaturePicker
                            id="sig_cm_parkx"
                            label="Signature (désactivée)"
                            value={data.cm_parkx_file}
                            onChange={() => {}}
                            disabled
                          />
                        </div>
                      </Row>

                      <Row label="HSE Manager ParkX">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 opacity-60">
                          <div className="space-y-3">
                            <Text placeholder="Nom (à compléter par ParkX)" disabled />
                            <Text type="date" placeholder="Date —" disabled />
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
                  )}

                  {/* ACTIONS */}
                  {!readonly && (
                    <motion.div 
                      className="flex items-center justify-end gap-3 pb-2 pt-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <motion.button
                        type="submit"
                        disabled={processing}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="rounded-md px-8 py-3 text-sm font-semibold text-white bg-gray-800 hover:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-60 w-full sm:w-auto"
                      >
                        {processing ? "Envoi…" : "Soumettre"}
                      </motion.button>
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}