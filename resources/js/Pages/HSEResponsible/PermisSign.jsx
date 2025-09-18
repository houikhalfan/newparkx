import React, { useEffect, useMemo, useState, useRef } from "react";
import { useForm, Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Search,
  Filter,
  Calendar,
  UserCircle,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  ArrowRight,
  LogOut,
  ChevronDown,
} from "lucide-react";

/* --------------------------- UI building blocks --------------------------- */
const BRAND = "#0E8A5D"; // ParkX green

// Fixed Text component with forwardRef
const Text = React.forwardRef(({ disabled, ...rest }, ref) => (
  <input
    ref={ref}
    {...rest}
    disabled={disabled}
    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 ${
      disabled 
        ? "bg-gray-100 text-gray-500" 
        : "bg-white border-gray-300 focus:ring-2 focus:border-indigo-500 focus:ring-indigo-200"
    }`}
  />
));

const Area = ({ rows = 3, disabled, ...rest }) => (
  <textarea
    rows={rows}
    disabled={disabled}
    {...rest}
    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 ${
      disabled 
        ? "bg-gray-100 text-gray-500" 
        : "bg-white border-gray-300 focus:ring-2 focus:border-indigo-500 focus:ring-indigo-200"
    }`}
  />
);

const FieldError = ({ children }) =>
  children ? <p className="mt-1 text-xs text-rose-600">{children}</p> : null;

const CheckLine = ({ children, checked, onChange, disabled }) => (
  <label
    className={`flex items-start gap-3 py-2 ${
      disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
    }`}
  >
    <input
      type="checkbox"
      className="mt-0.5 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      checked={!!checked}
      onChange={(e) => onChange?.(e.target.checked)}
      disabled={disabled}
    />
    <span className="text-sm text-gray-700 leading-5">{children}</span>
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
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {label}
      </label>

      <div className="flex items-center">
        <label
          htmlFor={id}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl cursor-pointer hover:bg-indigo-700 transition-colors duration-200"
        >
          Choisir un fichier
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
          className="hidden"
        />
        <span className="ml-3 text-sm text-gray-500">
          {isFile ? value.name : isStoredPath ? "Signature déjà uploadée" : "Aucun fichier choisi"}
        </span>
      </div>

      {/* Live File preview */}
      {isFile && (
        <img
          src={preview || URL.createObjectURL(value)}
          alt="Signature"
          className="mt-3 h-24 w-auto rounded-xl border border-gray-200 bg-white shadow-sm"
        />
      )}

      {/* Stored path preview in readonly */}
      {!isFile && isStoredPath && (
        <img
          src={`/storage/${value}`}
          alt="Signature"
          className="mt-3 h-24 w-auto rounded-xl border border-gray-200 bg-white shadow-sm"
        />
      )}

      <FieldError>{error}</FieldError>
    </div>
  );
}

const FormCard = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden mb-6"
  >
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5">
      <h2 className="text-lg font-bold text-white">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

const Row = ({ label, children, className = "" }) => (
  <div
    className={[
      "flex flex-col gap-3 py-4 border-b border-gray-200 last:border-b-0 md:flex-row md:items-start",
      className,
    ].join(" ")}
  >
    <div className="md:w-72 shrink-0">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
    </div>
    <div className="md:flex-1">{children}</div>
  </div>
);

// Background blobs for visual appeal
const BackgroundBlobs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
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
  auth,
}) {
  const { user } = auth || {};
  const contractorName = permis?.contractant || "GENERIC";
  const hseParkxNomRef = useRef(null);
  const hseParkxDateRef = useRef(null);

  // Fix cursor focus issue - simpler approach
  useEffect(() => {
    // Focus on name field when component mounts
    const timer = setTimeout(() => {
      if (hseParkxNomRef.current) {
        hseParkxNomRef.current.focus();
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
      "hse_parkx_nom", "hse_parkx_date", "hse_parkx_file"
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

    post(route("hseResponsible.permis.sign", permis.id), {
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
      <BackgroundBlobs />
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Permis d'excavation
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Validation HSE Manager ParkX
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition"
                style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
              >
                <ArrowRight className="w-4 h-4 inline-block mr-2" />
                Retour au Tableau de Bord
              </Link>

            

              <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name || "Utilisateur"}</p>
                  <p className="text-xs text-slate-600">HSE Manager ParkX</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 py-8 px-6 max-w-6xl mx-auto">
        {flash?.success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-emerald-700 text-sm shadow-md"
          >
            {flash.success}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
            Formulaire de Permis d'Excavation
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Validation HSE Manager ParkX
          </p>
        </motion.div>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Informations du Permis</h3>
                <p className="text-indigo-100 text-sm">Identifiant et numéros de référence</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de Permis Général
              </label>
              <Text
                disabled
                value={data.numero_permis_general}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de Permis
              </label>
              <Text
                disabled
                value={data.numero_permis}
              />
            </div>
          </div>
        </motion.div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* All sections are disabled except HSE Manager ParkX */}
          <fieldset disabled={true}>
            {/* IDENTIFICATION */}
            <FormCard title="Identification">
              <Row label="Endroit / Plan">
                <select
                  value={data.site_id}
                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-sm text-gray-500"
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">De</label>
                    <Text
                      type="date"
                      value={data.duree_de}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">À</label>
                    <Text
                      type="date"
                      value={data.duree_a}
                    />
                  </div>
                </div>
              </Row>

              <Row label="Description du travail">
                <Area
                  value={data.description}
                  placeholder="Décrivez les travaux à réaliser..."
                />
              </Row>

              <Row label="Analyse des risques réalisée par">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <Text
                      value={data.analyse_par}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <Text
                      type="date"
                      value={data.date_analyse}
                    />
                  </div>
                </div>
              </Row>

              <Row label="Demandeur du permis">
                <Text
                  value={data.demandeur}
                />
              </Row>

              <Row label="Contractant effectuant le travail">
                <div>
                  <Text
                    value={data.contractant}
                  />
                  <label className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-gray-400"
                      checked={!!data.meme_que_demandeur}
                      readOnly
                    />
                    Même que demandeur
                  </label>
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
                <div className="space-y-2">
                  {optExcavationEst.map((o) => (
                    <CheckLine
                      key={o.key}
                      checked={Array.isArray(data.excavation_est) && data.excavation_est.includes(o.key)}
                      disabled={true}
                    >
                      {o.label}
                    </CheckLine>
                  ))}
                </div>
              </Row>

              <Row label="Conduites / Tuyauterie souterraine">
                <div className="space-y-2">
                  {optConduites.map((o) => (
                    <CheckLine
                      key={o.key}
                      checked={Array.isArray(data.conduites) && data.conduites.includes(o.key)}
                      disabled={true}
                    >
                      {o.label}
                    </CheckLine>
                  ))}
                </div>
              </Row>

              <Row label="Situations dangereuses">
                <div className="space-y-2">
                  {optSituations.map((o) => (
                    <CheckLine
                      key={o.key}
                      checked={Array.isArray(data.situations) && data.situations.includes(o.key)}
                      disabled={true}
                    >
                      {o.label}
                    </CheckLine>
                  ))}
                  {Array.isArray(data.situations) &&
                    data.situations.includes("autre") && (
                      <div className="pt-2">
                        <Text
                          placeholder="Autre (préciser)"
                          value={data.situation_autre}
                          disabled={true}
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
                  disabled={true}
                >
                  Sans ÉPI additionnel
                </CheckLine>
              </Row>

              <Row label="Éléments">
                <div className="space-y-2">
                  {optEpiSimples.map((o) => (
                    <CheckLine
                      key={o.key}
                      checked={Array.isArray(data.epi_simples) && data.epi_simples.includes(o.key)}
                      disabled={true}
                    >
                      {o.label}
                    </CheckLine>
                  ))}
                  <div className="pt-2">
                    <Text
                      placeholder="Autre"
                      value={data.epi_autre}
                      disabled={true}
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
                  disabled={true}
                >
                  Équipement de protection additionnel non requis
                </CheckLine>
              </Row>

              <Row label="Mesures">
                <div className="space-y-2">
                  {optEquip.map((o) => (
                    <CheckLine
                      key={o.key}
                      checked={Array.isArray(data.equip_checks) && data.equip_checks.includes(o.key)}
                      disabled={true}
                    >
                      {o.label}
                    </CheckLine>
                  ))}
                  <div className="pt-2">
                    <Text
                      placeholder="Autre"
                      value={data.equip_autre}
                      disabled={true}
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
                  disabled={true}
                >
                  Aucun commentaire additionnel ou recommandation
                </CheckLine>
              </Row>

              <Row label="Commentaires">
                <Area
                  rows={3}
                  value={data.commentaires}
                  disabled={true}
                  placeholder="Ajoutez des commentaires ou recommandations..."
                />
              </Row>

              <Row label="Propriétaire des lieux">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <Text
                      value={data.proprietaire_nom}
                      disabled={true}
                    />
                  </div>

                  <div>
                    {data.proprietaire_signature && (
                      <img
                        src={data.proprietaire_signature instanceof File 
                          ? URL.createObjectURL(data.proprietaire_signature) 
                          : `/storage/${data.proprietaire_signature}`}
                        alt="Signature propriétaire"
                        className="h-24 w-auto rounded-xl border border-gray-200 bg-white shadow-sm"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <Text
                      type="date"
                      value={data.proprietaire_date}
                      disabled={true}
                    />
                  </div>
                </div>
              </Row>
            </FormCard>

            {/* SIGNATURES D'AUTORISATION */}
            <FormCard title="Signatures d'autorisation de permis">
              <Row label="Vérifications">
                <div className="space-y-3">
                  <CheckLine
                    checked={!!data.autor_q1}
                    disabled={true}
                  >
                    Les infrastructures souterraines sont identifiées et marquées sur le terrain.
                  </CheckLine>
                  <CheckLine
                    checked={!!data.autor_q2}
                    disabled={true}
                  >
                    Les mesures temporaires (barricades, signaux…) sont installées pour protéger la zone.
                  </CheckLine>
                  <CheckLine
                    checked={!!data.autor_q3}
                    disabled={true}
                  >
                    L'impact sur la circulation a été évalué et les permis requis ont été demandés.
                  </CheckLine>
                </div>
              </Row>

              <Row label="Responsable construction (Contractant)">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                      <Text
                        value={data.sig_resp_construction_nom}
                        disabled={true}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <Text
                        type="date"
                        value={data.sig_resp_construction_date}
                        disabled={true}
                      />
                    </div>
                  </div>

                  {data.sig_resp_construction_file && (
                    <img
                      src={data.sig_resp_construction_file instanceof File 
                        ? URL.createObjectURL(data.sig_resp_construction_file) 
                        : `/storage/${data.sig_resp_construction_file}`}
                      alt="Signature responsable construction"
                      className="h-24 w-auto rounded-xl border border-gray-200 bg-white shadow-sm"
                    />
                  )}
                </div>
              </Row>

              <Row label="Responsable HSE (Contractant)">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                      <Text
                        value={data.sig_resp_hse_nom}
                        disabled={true}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <Text
                        type="date"
                        value={data.sig_resp_hse_date}
                        disabled={true}
                      />
                    </div>
                  </div>

                  {data.sig_resp_hse_file && (
                    <img
                      src={data.sig_resp_hse_file instanceof File 
                        ? URL.createObjectURL(data.sig_resp_hse_file) 
                        : `/storage/${data.sig_resp_hse_file}`}
                      alt="Signature responsable HSE"
                      className="h-24 w-auto rounded-xl border border-gray-200 bg-white shadow-sm"
                    />
                  )}
                </div>
              </Row>
            </FormCard>

            {/* Construction Manager ParkX - Disabled */}
            <FormCard title="Validation ParkX">
              <Row label="Construction manager ParkX">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 opacity-60">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                      <Text
                        placeholder="Nom (à compléter par ParkX)"
                        value={data.cm_parkx_nom || ""}
                        disabled={true}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <Text
                        type="date"
                        value={data.cm_parkx_date || ""}
                        disabled={true}
                      />
                    </div>
                  </div>
                  {data.cm_parkx_file && (
                    <img
                      src={data.cm_parkx_file instanceof File 
                        ? URL.createObjectURL(data.cm_parkx_file) 
                        : `/storage/${data.cm_parkx_file}`}
                      alt="Signature CM ParkX"
                      className="h-24 w-auto rounded-xl border border-gray-200 bg-white shadow-sm"
                    />
                  )}
                </div>
              </Row>
            </FormCard>
          </fieldset>

          {/* HSE Manager ParkX - Editable */}
          <FormCard title="Validation HSE Manager ParkX">
            <Row label="HSE Manager ParkX">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <Text
                      ref={hseParkxNomRef}
                      placeholder="Nom (à compléter par ParkX)"
                      value={data.hse_parkx_nom || ""}
                      onChange={(e) => setData("hse_parkx_nom", e.target.value)}
                      onFocus={(e) => e.target.select()}
                    />
                    <FieldError>{errors.hse_parkx_nom}</FieldError>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <Text
                      type="date"
                      ref={hseParkxDateRef}
                      value={data.hse_parkx_date || ""}
                      onChange={(e) => setData("hse_parkx_date", e.target.value)}
                      onFocus={(e) => e.target.select()}
                    />
                    <FieldError>{errors.hse_parkx_date}</FieldError>
                  </div>
                </div>
                <SignaturePicker
                  id="sig_hse_parkx"
                  label="Signature"
                  value={data.hse_parkx_file}
                  onChange={(f) => setData("hse_parkx_file", f)}
                  error={errors.hse_parkx_file}
                />
              </div>
            </Row>
          </FormCard>

          {showFermeture && (
            <FormCard title="Fermeture du permis (à remplir physiquement)">
              <Row label="Checklist de fermeture (à cocher manuellement)">
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                  <li>Le personnel assigné a été avisé que le travail est complété.</li>
                  <li>Les mesures temporaires, barricades et signaux d'avertissement ont été enlevés.</li>
                  <li>Les matériaux, outils et équipements ont été enlevés des lieux de travail.</li>
                  <li>L'excavation a été remblayée.</li>
                  <li>Les dessins ont été mis à jour.</li>
                  <li>Suivi additionnel requis (spécifier) : ..............................................</li>
                </ul>
              </Row>

              <Row label="Responsable construction (Contractant)">
                <div className="grid grid-cols-1 md:grid-cols-3 text-sm text-gray-700 gap-4">
                  <div className="border-b border-dashed border-gray-400 py-4">
                    Nom : .................................................
                  </div>
                  <div className="border-b border-dashed border-gray-400 py-4">
                    Date : ................................................
                  </div>
                  <div className="border-b border-dashed border-gray-400 py-4">
                    Signature : ...........................................
                  </div>
                </div>
              </Row>

              <Row label="Responsable HSE (Contractant)">
                <div className="grid grid-cols-1 md:grid-cols-3 text-sm text-gray-700 gap-4">
                  <div className="border-b border-dashed border-gray-400 py-4">
                    Nom : .................................................
                  </div>
                  <div className="border-b border-dashed border-gray-400 py-4">
                    Date : ................................................
                  </div>
                  <div className="border-b border-dashed border-gray-400 py-4">
                    Signature : ...........................................
                  </div>
                </div>
              </Row>

              <Row label="Construction Manager ParkX">
                <div className="grid grid-cols-1 md:grid-cols-3 text-sm text-gray-700 gap-4">
                  <div className="border-b border-dashed border-gray-400 py-4">
                    Nom : .................................................
                  </div>
                  <div className="border-b border-dashed border-gray-400 py-4">
                    Date : ................................................
                  </div>
                  <div className="border-b border-dashed border-gray-400 py-4">
                    Signature : ...........................................
                  </div>
                </div>
              </Row>

              <Row label="HSE Manager ParkX">
                <div className="grid grid-cols-1 md:grid-cols-3 text-sm text-gray-700 gap-4">
                  <div className="border-b border-dashed border-gray-400 py-4">
                    Nom : .................................................
                  </div>
                  <div className="border-b border-dashed border-gray-400 py-4">
                    Date : ................................................
                  </div>
                  <div className="border-b border-dashed border-gray-400 py-4">
                    Signature : ...........................................
                  </div>
                </div>
              </Row>
            </FormCard>
          )}

          {/* ACTIONS */}
          {!readonly && (
            <motion.div 
              className="flex items-center justify-end gap-4 pb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
              >
                {processing ? "Envoi en cours..." : "Soumettre le permis"}
              </button>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
}