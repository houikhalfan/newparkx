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
        ? "bg-gray-100 text-gray-500" 
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
        ? "bg-gray-100 text-gray-500" 
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
    <div className="p-5">{children}</div>
  </div>
);

const Row = ({ label, children, className = "" }) => (
  <div
    className={[
      "flex flex-col gap-1 py-3 border-b last:border-b-0 md:flex-row md:items-start",
      className,
    ].join(" ")}
  >
    <div className="md:w-72 shrink-0 pt-1.5">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
    </div>
    <div className="md:flex-1">{children}</div>
  </div>
);

/* ================================= PAGE ================================== */
export default function PermisSign({
  permis,
  sites = [],
  flash = {},
  readonly = false,
  showSignatureResponsableSite = true,
  showFermeture = false,
}) {
  const contractorName = permis?.contractant || "GENERIC";
  const cmParkxNomRef = useRef(null);
  const cmParkxDateRef = useRef(null);

  // Fix cursor focus issue - simpler approach
  useEffect(() => {
    // Focus on name field when component mounts
    const timer = setTimeout(() => {
      if (cmParkxNomRef.current) {
        cmParkxNomRef.current.focus();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

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
        label:
          "Barricades de 1,1 mètres installées à proximité des excavations de plus de 1,8 mètres de profondeur",
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
  function generatePermitNumber(contractorName = "GENERIC") {
    const date = new Date();
    const yyyyMMdd = date.toISOString().slice(0, 10).replace(/-/g, "");
    const rand = Math.floor(1000 + Math.random() * 9000); // 4 digits
    const slug = contractorName.toUpperCase().replace(/\s+/g, "").slice(0, 8);
    return `PX-${slug}-${yyyyMMdd}-${rand}`;
  }

  const normalizeArray = (val) =>
    Array.isArray(val) ? val : val ? [val] : [];

  // Simplified state initialization without complex memoization
  const initialState = {
    // HEADER
    numero_permis_general: permis?.numero_permis_general || "",
    numero_permis: permis?.numero_permis || generatePermitNumber(contractorName),

    // IDENTIFICATION
    site_id: permis?.site_id || "",
    duree_de: permis?.duree_de || "",
    duree_a: permis?.duree_a || "",
    description: permis?.description || "",
    analyse_par: permis?.analyse_par || "",
    date_analyse: permis?.date_analyse || "",
    demandeur: permis?.demandeur || "",
    contractant: permis?.contractant || "",
    meme_que_demandeur: !!permis?.meme_que_demandeur,

    // DANGERS
    danger_aucun: !!permis?.danger_aucun,
    excavation_est: Array.isArray(permis?.excavation_est) ? permis.excavation_est : permis?.excavation_est ? [permis.excavation_est] : [],
    conduites: Array.isArray(permis?.conduites) ? permis.conduites : permis?.conduites ? [permis.conduites] : [],
    situations: Array.isArray(permis?.situations) ? permis.situations : permis?.situations ? [permis.situations] : [],
    situation_autre: permis?.situation_autre || "",

    // EPI
    epi_sans_additionnel: !!permis?.epi_sans_additionnel,
    epi_simples: Array.isArray(permis?.epi_simples) ? permis.epi_simples : permis?.epi_simples ? [permis.epi_simples] : [],
    epi_autre: permis?.epi_autre || "",

    // ÉQUIPEMENT
    equip_non_requis: !!permis?.equip_non_requis,
    equip_checks: Array.isArray(permis?.equip_checks) ? permis.equip_checks : permis?.equip_checks ? [permis.equip_checks] : [],
    equip_autre: permis?.equip_autre || "",

    // COMMENTAIRES & PROPRIÉTAIRE
    aucun_commentaire: !!permis?.aucun_commentaire,
    commentaires: permis?.commentaires || "",
    proprietaire_nom: permis?.proprietaire_nom || "",
    proprietaire_signature: permis?.proprietaire_signature || null,
    proprietaire_date: permis?.proprietaire_date || "",

    // AUTORISATION
    autor_q1: !!permis?.autor_q1,
    autor_q2: !!permis?.autor_q2,
    autor_q3: !!permis?.autor_q3,

    sig_resp_construction_nom: permis?.sig_resp_construction_nom || "",
    sig_resp_construction_date: permis?.sig_resp_construction_date || "",
    sig_resp_construction_file: permis?.sig_resp_construction_file || null,

    sig_resp_hse_nom: permis?.sig_resp_hse_nom || "",
    sig_resp_hse_date: permis?.sig_resp_hse_date || "",
    sig_resp_hse_file: permis?.sig_resp_hse_file || null,
    
    cm_parkx_nom: permis?.cm_parkx_nom || "",
    cm_parkx_date: permis?.cm_parkx_date || "",
    cm_parkx_file: permis?.cm_parkx_file || null,

    hse_parkx_nom: permis?.hse_parkx_nom || "",
    hse_parkx_date: permis?.hse_parkx_date || "",
    hse_parkx_file: permis?.hse_parkx_file || null,

    // FERMETURE (kept in state but not shown for contractant)
    ferm_q1: !!permis?.ferm_q1,
    ferm_q2: !!permis?.ferm_q2,
    ferm_q3: !!permis?.ferm_q3,
    ferm_q4: !!permis?.ferm_q4,
    ferm_q5: !!permis?.ferm_q5,
    ferm_q6: !!permis?.ferm_q6,
    ferm_suivi_detail: permis?.ferm_suivi_detail || "",
    ferm_resp_construction_nom: permis?.ferm_resp_construction_nom || "",
    ferm_resp_construction_date: permis?.ferm_resp_construction_date || "",
    ferm_resp_construction_file: permis?.ferm_resp_construction_file || null,
    ferm_resp_hse_nom: permis?.ferm_resp_hse_nom || "",
    ferm_resp_hse_date: permis?.ferm_resp_hse_date || "",
    ferm_resp_hse_file: permis?.ferm_resp_hse_file || null,
  };

  const { data, setData, post, processing, errors } = useForm(initialState);

  const toggleArray = (key, val) => {
    const s = new Set(Array.isArray(data[key]) ? data[key] : []);
    s.has(val) ? s.delete(val) : s.add(val);
    setData(key, Array.from(s));
  };

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

    post(route("responsibleSite.permis.sign", permis.id), {
      data,
      forceFormData: true,
      onSuccess: () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    });
  };

  const logoSrc = "/images/logo.png";

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
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              {/* Logo & Brand */}
              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    PERMIS D'EXCAVATION
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">Gestion et signatures du permis</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                {/* Back Button */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <a
                    href="/dashboard"
                    className="group relative inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m12 19-7-7 7-7" />
                      <path d="M19 12H5" />
                    </svg>
                    <span>Retour au Tableau de Bord</span>
                  </a>
                </motion.div>

                {/* User Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="text-slate-800">
                    <p className="text-sm font-medium">Responsable de site</p>
                    <p className="text-xs text-slate-600">ParkX</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              PERMIS D'EXCAVATION
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
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

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Header with Numbers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 mb-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Informations du permis</h3>
                  <p className="text-sm text-slate-600">Numéros d'identification</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* NUMÉRO DE PERMIS GÉNÉRAL */}
                  <div>
                    <div className="text-sm text-slate-600 mb-1">NUMÉRO DE PERMIS GÉNÉRAL</div>
                    <Text
                      disabled
                      value={data.numero_permis_general}
                    />
                  </div>
                  
                  {/* NUMÉRO DE PERMIS */}
                  <div>
                    <div className="text-sm text-slate-600 mb-1">NUMÉRO DE PERMIS</div>
                    <Text
                      disabled
                      value={data.numero_permis}
                    />
                  </div>
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
                  <div className="grid grid-cols-2 gap-3">
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
                  className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500"
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
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
                />
              </Row>

              <Row label="Analyse des risques réalisée par">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Text
                    disabled={true}
                    value={data.analyse_par}
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
                  className="cursor-not-allowed"
                />
              </Row>

              <Row label="Contractant effectuant le travail">
                <div>
                  <Text
                    disabled={true}
                    value={data.contractant}
                    className="cursor-not-allowed"
                  />
                </div>
              </Row>
            </FormCard>

            {/* DANGERS PARTICULIERS */}
            <FormCard title="Dangers particuliers">
              <Row label="Aucun">
                <CheckLine
                  checked={!!data.danger_aucun}
                  disabled={true}
                >
                  Aucun
                </CheckLine>
              </Row>

              <Row label="L'excavation est :">
                <div className="divide-y">
                  {optExcavationEst.map((o) => (
                    <div key={o.key} className="py-1">
                      <CheckLine
                        checked={Array.isArray(data.excavation_est) && data.excavation_est.includes(o.key)}
                        disabled={true}
                      >
                        {o.label}
                      </CheckLine>
                    </div>
                  ))}
                </div>
              </Row>

              <Row label="Conduites / Tuyauterie souterraine">
                <div className="divide-y">
                  {optConduites.map((o) => (
                    <div key={o.key} className="py-1">
                      <CheckLine
                        checked={Array.isArray(data.conduites) && data.conduites.includes(o.key)}
                        disabled={true}
                      >
                        {o.label}
                      </CheckLine>
                    </div>
                  ))}
                </div>
              </Row>

              <Row label="Situations dangereuses">
                <div className="divide-y">
                  {optSituations.map((o) => (
                    <div key={o.key} className="py-1">
                      <CheckLine
                        checked={Array.isArray(data.situations) && data.situations.includes(o.key)}
                        disabled={true}
                      >
                        {o.label}
                      </CheckLine>
                    </div>
                  ))}
                </div>
              </Row>
            </FormCard>

            {/* ÉPI */}
            <FormCard title="Équipement de protection personnelle (ÉPI) requis">
              <Row label="Sans ÉPI additionnel">
                <CheckLine
                  checked={!!data.epi_sans_additionnel}
                  disabled={true}
                >
                  Sans ÉPI additionnel
                </CheckLine>
              </Row>

              <Row label="Éléments">
                <div className="divide-y">
                  {optEpiSimples.map((o) => (
                    <div key={o.key} className="py-1">
                      <CheckLine
                        checked={Array.isArray(data.epi_simples) && data.epi_simples.includes(o.key)}
                        disabled={true}
                      >
                        {o.label}
                      </CheckLine>
                    </div>
                  ))}
                </div>
              </Row>
            </FormCard>

            {/* ÉQUIPEMENT DE PROTECTION */}
            <FormCard title="Équipement de protection">
              <Row label="Équipement de protection additionnel non requis">
                <CheckLine
                  checked={!!data.equip_non_requis}
                  disabled={true}
                >
                  Équipement de protection additionnel non requis
                </CheckLine>
              </Row>

              <Row label="Mesures">
                <div className="divide-y">
                  {optEquip.map((o) => (
                    <div key={o.key} className="py-1">
                      <CheckLine
                        checked={Array.isArray(data.equip_checks) && data.equip_checks.includes(o.key)}
                        disabled={true}
                      >
                        {o.label}
                      </CheckLine>
                    </div>
                  ))}
                </div>
              </Row>
            </FormCard>

            {/* COMMENTAIRES & PROPRIÉTAIRE */}
            <FormCard title="Commentaires et recommandations particulières">
              <Row label="Aucun commentaire">
                <CheckLine
                  checked={!!data.aucun_commentaire}
                  disabled={true}
                >
                  Aucun commentaire additionnel ou recommandation
                </CheckLine>
              </Row>

              <Row label="Commentaires">
                <Area
                  rows={3}
                  disabled={true}
                  value={data.commentaires}
                />
              </Row>

              <Row label="Propriétaire des lieux (nom en lettres moulées)">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div>
                    <Text
                      disabled={true}
                      value={data.proprietaire_nom}
                    />
                  </div>
                  
                  {data.proprietaire_signature && (
                    <img
                      src={data.proprietaire_signature instanceof File 
                        ? URL.createObjectURL(data.proprietaire_signature) 
                        : `/storage/${data.proprietaire_signature}`}
                      alt="Signature propriétaire"
                      className="h-20 w-auto rounded border border-gray-200 bg-white shadow-sm"
                    />
                  )}
                  
                  <div>
                    <Text
                      type="date"
                      disabled={true}
                      value={data.proprietaire_date}
                    />
                  </div>
                </div>
              </Row>
            </FormCard>

            {/* SIGNATURES D'AUTORISATION */}
            <FormCard title="Signatures d'autorisation de permis">
              <Row label="Vérifications">
                <div className="divide-y">
                  <div className="py-1">
                    <CheckLine
                      checked={!!data.autor_q1}
                      disabled={true}
                    >
                      Les infrastructures souterraines sont identifiées et marquées sur le terrain.
                    </CheckLine>
                  </div>
                  <div className="py-1">
                    <CheckLine
                      checked={!!data.autor_q2}
                      disabled={true}
                    >
                      Les mesures temporaires (barricades, signaux…) sont installées pour protéger la zone.
                    </CheckLine>
                  </div>
                  <div className="py-1">
                    <CheckLine
                      checked={!!data.autor_q3}
                      disabled={true}
                    >
                      L'impact sur la circulation a été évalué et les permis requis ont été demandés.
                    </CheckLine>
                  </div>
                </div>
              </Row>

              <Row label="Responsable construction (Contractant)">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-3">
                    <Text
                      disabled={true}
                      value={data.sig_resp_construction_nom}
                    />
                    <Text
                      type="date"
                      disabled={true}
                      value={data.sig_resp_construction_date}
                    />
                  </div>

                  {data.sig_resp_construction_file && (
                    <img
                      src={data.sig_resp_construction_file instanceof File 
                        ? URL.createObjectURL(data.sig_resp_construction_file) 
                        : `/storage/${data.sig_resp_construction_file}`}
                      alt="Signature responsable construction"
                      className="h-20 w-auto rounded border border-gray-200 bg-white shadow-sm"
                    />
                  )}
                </div>
              </Row>

              <Row label="Responsable HSE (Contractant)">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-3">
                    <Text
                      disabled={true}
                      value={data.sig_resp_hse_nom}
                    />
                    <Text
                      type="date"
                      disabled={true}
                      value={data.sig_resp_hse_date}
                    />
                  </div>

                  {data.sig_resp_hse_file && (
                    <img
                      src={data.sig_resp_hse_file instanceof File 
                        ? URL.createObjectURL(data.sig_resp_hse_file) 
                        : `/storage/${data.sig_resp_hse_file}`}
                      alt="Signature responsable HSE"
                      className="h-20 w-auto rounded border border-gray-200 bg-white shadow-sm"
                    />
                  )}
                </div>
              </Row>
            </FormCard>

            {/* ACTIONS */}
            {!readonly && (
              <div className="flex items-center justify-end gap-3 pb-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="rounded-md px-5 py-2 text-sm font-semibold text-white shadow transition disabled:opacity-60"
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