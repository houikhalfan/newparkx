import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/Pages/DashboardLayout";
import { 
  FileText, 
  Calendar, 
  User, 
  MapPin, 
  AlertTriangle, 
  Shield, 
  HardHat, 
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Sparkles,
  Package,
  Hash,
  ArrowRight,
  LogOut,
  UserCircle,
  ChevronDown,
  ChevronUp,
  Save,
  CheckSquare,
  Square
} from 'lucide-react';

/* --------------------------- UI building blocks --------------------------- */
const BRAND = "#0E8A5D"; // ParkX green

export default function PermisSign({
  permis,
  sites = [],
  flash = {},
  readonly = false,
  showSignatureResponsableSite = true,
  showFermeture = false,
}) {
  const contractorName = permis?.contractant || "GENERIC";

  // Modern Card Component
  const FormCard = ({ title, children, icon: Icon = FileText }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden mb-6"
    >
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );

  // Modern Row Component
  const Row = ({ label, children, className = "", icon: Icon }) => (
    <div
      className={[
        "flex flex-col gap-4 py-4 border-b border-slate-200 last:border-b-0 md:flex-row md:items-start",
        className,
      ].join(" ")}
    >
      <div className="md:w-72 shrink-0">
        <label className="flex items-center text-sm font-semibold text-slate-700">
          {Icon && <Icon className="w-4 h-4 mr-2" />}
          {label}
        </label>
      </div>
      <div className="md:flex-1">{children}</div>
    </div>
  );

  // Modern Input Components
  const inputBase = "w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all duration-300 shadow-sm";
  const inputActive = "bg-white border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";
  const inputDisabled = "bg-slate-100 text-slate-500 border-slate-200";

  const Text = ({ disabled, icon: Icon, ...rest }) => (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />}
      <input
        {...rest}
        disabled={disabled}
        className={[
          inputBase, 
          disabled ? inputDisabled : inputActive,
          Icon ? "pl-10" : ""
        ].join(" ")}
      />
    </div>
  );

  const Area = ({ rows = 3, disabled, icon: Icon, ...rest }) => (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />}
      <textarea
        rows={rows}
        disabled={disabled}
        {...rest}
        className={[
          inputBase, 
          disabled ? inputDisabled : inputActive,
          Icon ? "pl-10 pt-2" : ""
        ].join(" ")}
      />
    </div>
  );

  const FieldError = ({ children }) =>
    children ? <p className="mt-2 text-xs text-rose-600 font-medium">{children}</p> : null;

  // Modern Checkbox Component
  const CheckLine = ({ children, checked, onChange, disabled, icon: Icon }) => (
    <label
      className={[
        "flex items-start gap-3 py-2 group cursor-pointer",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {checked ? (
        <CheckSquare className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
      ) : (
        <Square className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0 group-hover:text-indigo-400" />
      )}
      <div className="flex items-center">
        {Icon && <Icon className="w-4 h-4 mr-2 text-slate-500" />}
        <span className="text-sm text-slate-700 leading-5">{children}</span>
      </div>
      <input
        type="checkbox"
        className="hidden"
        checked={!!checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
      />
    </label>
  );

  // Modern Select Component
  const Select = ({ disabled, icon: Icon, children, ...rest }) => (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />}
      <select
        {...rest}
        disabled={disabled}
        className={[
          inputBase,
          "appearance-none",
          disabled ? inputDisabled : inputActive,
          Icon ? "pl-10" : ""
        ].join(" ")}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
    </div>
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
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          {label}
        </label>

        <div className="relative">
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
            className="block w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:px-4 file:py-3 file:text-white transition-all duration-300 file:cursor-pointer"
            style={{ 
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            }}
          />
          <style>{`
            #${id}::file-selector-button{
              background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
              border: none;
              color: white;
              font-weight: 600;
            }
            #${id}:hover::file-selector-button{
              filter: brightness(1.1);
            }
            #${id}:disabled::file-selector-button{
              opacity: 0.6;
              cursor: not-allowed;
            }
          `}</style>
        </div>

        {/* Live File preview */}
        {isFile && (
          <img
            src={preview || URL.createObjectURL(value)}
            alt="Signature"
            className="mt-3 h-24 w-auto rounded-xl border-2 border-slate-200 bg-white shadow-sm"
          />
        )}

        {/* Stored path preview in readonly */}
        {!isFile && isStoredPath && (
          <img
            src={`/storage/${value}`}
            alt="Signature"
            className="mt-3 h-24 w-auto rounded-xl border-2 border-slate-200 bg-white shadow-sm"
          />
        )}

        <FieldError>{error}</FieldError>
      </div>
    );
  }

  /* ================================= PAGE ================================== */

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

  const generatedPermitNumber = useMemo(
    () => generatePermitNumber(contractorName),
    [contractorName]
  );
  
  const normalizeArray = (val) =>
    Array.isArray(val) ? val : val ? [val] : [];

  // Pre-fill from permis (read or edit context)
  const initialState = useMemo(() => {
    return permis
      ? {
          // HEADER
          numero_permis_general: permis.numero_permis_general || "",
          numero_permis: generatedPermitNumber,   // ✅ use memoized value

          // IDENTIFICATION
          site_id: permis.site_id || "",
          duree_de: permis.duree_de || "",
          duree_a: permis.duree_a || "",
          description: permis.description || "",
          analyse_par: permis.analyse_par || "",
          date_analyse: permis.date_analyse || "",
          demandeur: permis.demandeur || "",
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
          cm_parkx_nom: permis.cm_parkx_nom || "",
          cm_parkx_date: permis.cm_parkx_date || "",
          cm_parkx_file: permis.cm_parkx_file || null,

          hse_parkx_nom: permis.hse_parkx_nom || "",
          hse_parkx_date: permis.hse_parkx_date || "",
          hse_parkx_file: permis.hse_parkx_file || null,
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
          numero_permis: generatedPermitNumber,   // ✅ use memoized value
          // IDENTIFICATION
          site_id: "",
          duree_de: "",
          duree_a: "",
          description: "",
          analyse_par: "",
          date_analyse: "",
          demandeur: "",
          contractant: "",
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
          cm_parkx_nom: "",
          cm_parkx_date: "",
          cm_parkx_file: null,

          hse_parkx_nom: "",
          hse_parkx_date: "",
          hse_parkx_file: null,
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
  }, [permis, generatedPermitNumber]);

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
    <DashboardLayout>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse" />
      </div>

      <div className="relative z-10 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">PERMIS D'EXCAVATION — CONSTRUCTION</h1>
                    <p className="text-indigo-100">Formulaire de demande et validation</p>
                  </div>
                </div>

                <div className="text-right text-white">
                  {/* NUMÉRO DE PERMIS GÉNÉRAL (user enters manually) */}
                  <div className="text-sm font-medium mb-1">NUMÉRO DE PERMIS GÉNÉRAL</div>
                  <Text
                    disabled={readonly}
                    value={data.numero_permis_general}
                    onChange={(e) => setData("numero_permis_general", e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  />
                  <FieldError>{errors.numero_permis_general}</FieldError>

                  {/* NUMÉRO DE PERMIS (auto-generated) */}
                  <div className="mt-3 text-sm font-medium mb-1">NUMÉRO DE PERMIS</div>
                  <Text
                    disabled
                    value={data.numero_permis || generatedPermitNumber}
                    className="bg-white/20 border-white/30 text-white"
                  />
                  <FieldError>{errors.numero_permis}</FieldError>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Flash */}
          <AnimatePresence>
            {flash?.success && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 font-medium"
              >
                {flash.success}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* IDENTIFICATION */}
            <FormCard title="Identification" icon={User}>
              <Row label="Endroit / Plan" icon={MapPin}>
                <Select
                  value={data.site_id}
                  disabled={readonly}
                  onChange={(e) => setData("site_id", e.target.value)}
                  icon={MapPin}
                >
                  <option value="" disabled>Choisir un site…</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Select>
                <FieldError>{errors.site_id}</FieldError>
              </Row>

              <Row label="Durée" icon={Calendar}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Text
                    type="date"
                    disabled={readonly}
                    value={data.duree_de}
                    onChange={(e) => setData("duree_de", e.target.value)}
                    icon={Calendar}
                  />
                  <Text
                    type="date"
                    disabled={readonly}
                    value={data.duree_a}
                    onChange={(e) => setData("duree_a", e.target.value)}
                    icon={Calendar}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldError>{errors.duree_de}</FieldError>
                  <FieldError>{errors.duree_a}</FieldError>
                </div>
              </Row>

              <Row label="Description du travail" icon={FileText}>
                <Area
                  disabled={readonly}
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                  icon={FileText}
                />
                <FieldError>{errors.description}</FieldError>
              </Row>

              <Row label="Analyse des risques réalisée par" icon={User}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Text
                    disabled={readonly}
                    value={data.analyse_par}
                    onChange={(e) => setData("analyse_par", e.target.value)}
                    icon={User}
                  />
                  <Text
                    type="date"
                    disabled={readonly}
                    value={data.date_analyse}
                    onChange={(e) => setData("date_analyse", e.target.value)}
                    icon={Calendar}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldError>{errors.analyse_par}</FieldError>
                  <FieldError>{errors.date_analyse}</FieldError>
                </div>
              </Row>

              <Row label="Demandeur du permis" icon={User}>
                <Text
                  disabled={readonly}
                  value={data.demandeur}
                  onChange={(e) => setData("demandeur", e.target.value)}
                  icon={User}
                />
                <FieldError>{errors.demandeur}</FieldError>
              </Row>

              <Row label="Contractant effectuant le travail" icon={User}>
                <div>
                  <Text
                    disabled={readonly}
                    value={data.contractant}
                    onChange={(e) => setData("contractant", e.target.value)}
                    icon={User}
                  />
                  <label className="mt-3 flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 focus:ring-2 focus:ring-indigo-200"
                      style={{ accentColor: BRAND }}
                      disabled={readonly}
                      checked={!!data.meme_que_demandeur}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setData("meme_que_demandeur", checked);
                        if (checked) setData("contractant", data.demandeur || "");
                      }}
                    />
                    Même que demandeur
                  </label>
                </div>
                <FieldError>{errors.contractant}</FieldError>
              </Row>
            </FormCard>

            {/* DANGERS PARTICULIERS */}
            <FormCard title="Dangers particuliers" icon={AlertTriangle}>
              <Row label="Aucun">
                <CheckLine
                  checked={!!data.danger_aucun}
                  onChange={(v) => setData("danger_aucun", v)}
                  disabled={readonly}
                  icon={CheckCircle}
                >
                  Aucun
                </CheckLine>
              </Row>

              <Row label="L'excavation est :" icon={AlertTriangle}>
                <div className="space-y-2">
                  {optExcavationEst.map((o) => (
                    <CheckLine
                      key={o.key}
                      checked={Array.isArray(data.excavation_est) && data.excavation_est.includes(o.key)}
                      onChange={() => toggleArray("excavation_est", o.key)}
                      disabled={readonly || data.danger_aucun}
                    >
                      {o.label}
                    </CheckLine>
                  ))}
                </div>
              </Row>

              <Row label="Conduites / Tuyauterie souterraine" icon={AlertTriangle}>
                <div className="space-y-2">
                  {optConduites.map((o) => (
                    <CheckLine
                      key={o.key}
                      checked={Array.isArray(data.conduites) && data.conduites.includes(o.key)}
                      onChange={() => toggleArray("conduites", o.key)}
                      disabled={readonly || data.danger_aucun}
                    >
                      {o.label}
                    </CheckLine>
                  ))}
                </div>
              </Row>

              <Row label="Situations dangereuses" icon={AlertTriangle}>
                <div className="space-y-2">
                  {optSituations.map((o) => (
                    <CheckLine
                      key={o.key}
                      checked={Array.isArray(data.situations) && data.situations.includes(o.key)}
                      onChange={() => toggleArray("situations", o.key)}
                      disabled={readonly || data.danger_aucun}
                    >
                      {o.label}
                    </CheckLine>
                  ))}
                  {Array.isArray(data.situations) &&
                    data.situations.includes("autre") &&
                    !data.danger_aucun && (
                      <div className="pt-2">
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
            <FormCard title="Équipement de protection personnelle (ÉPI) requis" icon={Shield}>
              <Row label="Sans ÉPI additionnel">
                <CheckLine
                  checked={!!data.epi_sans_additionnel}
                  onChange={(v) => setData("epi_sans_additionnel", v)}
                  disabled={readonly}
                  icon={CheckCircle}
                >
                  Sans ÉPI additionnel
                </CheckLine>
              </Row>

              <Row label="Éléments" icon={Shield}>
                <div className="space-y-2">
                  {optEpiSimples.map((o) => (
                    <CheckLine
                      key={o.key}
                      checked={Array.isArray(data.epi_simples) && data.epi_simples.includes(o.key)}
                      onChange={() => toggleArray("epi_simples", o.key)}
                      disabled={readonly || data.epi_sans_additionnel}
                    >
                      {o.label}
                    </CheckLine>
                  ))}
                  <div className="pt-2">
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
            <FormCard title="Équipement de protection" icon={HardHat}>
              <Row label="Équipement de protection additionnel non requis">
                <CheckLine
                  checked={!!data.equip_non_requis}
                  onChange={(v) => setData("equip_non_requis", v)}
                  disabled={readonly}
                  icon={CheckCircle}
                >
                  Équipement de protection additionnel non requis
                </CheckLine>
              </Row>

              <Row label="Mesures" icon={HardHat}>
                <div className={data.equip_non_requis ? "opacity-60" : ""}>
                  <div className="space-y-2">
                    {optEquip.map((o) => (
                      <CheckLine
                        key={o.key}
                        checked={Array.isArray(data.equip_checks) && data.equip_checks.includes(o.key)}
                        onChange={() => toggleArray("equip_checks", o.key)}
                        disabled={readonly || data.equip_non_requis}
                      >
                        {o.label}
                      </CheckLine>
                    ))}
                  </div>
                  <div className="pt-2">
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
            <FormCard title="Commentaires et recommandations particulières" icon={MessageSquare}>
              <Row label="Aucun commentaire">
                <CheckLine
                  checked={!!data.aucun_commentaire}
                  onChange={(v) => setData("aucun_commentaire", v)}
                  disabled={readonly}
                  icon={CheckCircle}
                >
                  Aucun commentaire additionnel ou recommandation
                </CheckLine>
              </Row>

              <Row label="Commentaires" icon={MessageSquare}>
                <Area
                  rows={3}
                  disabled={readonly || data.aucun_commentaire}
                  value={data.commentaires}
                  onChange={(e) => setData("commentaires", e.target.value)}
                  icon={MessageSquare}
                />
              </Row>

              <Row label="Propriétaire des lieux (nom en lettres moulées)" icon={User}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Text
                      disabled={readonly}
                      value={data.proprietaire_nom}
                      onChange={(e) => setData("proprietaire_nom", e.target.value)}
                      icon={User}
                    />
                    <FieldError>{errors.proprietaire_nom}</FieldError>
                  </div>
    
                  <SignaturePicker
                    id="prop_sig"
                    label="Signature (JPG/PNG)"
                    value={data.proprietaire_signature}
                    onChange={(f) => setData("proprietaire_signature", f)}
                    disabled={readonly}
                    error={errors.proprietaire_signature}
                  />

                  <div>
                    <Text
                      type="date"
                      disabled={readonly}
                      value={data.proprietaire_date}
                      onChange={(e) => setData("proprietaire_date", e.target.value)}
                      icon={Calendar}
                    />
                    <FieldError>{errors.proprietaire_date}</FieldError>
                  </div>
                </div>
              </Row>
            </FormCard>

            {/* SIGNATURES D'AUTORISATION */}
            <FormCard title="Signatures d'autorisation de permis" icon={FileText}>
              <Row label="Vérifications" icon={CheckCircle}>
                <div className="space-y-2">
                  <CheckLine
                    checked={!!data.autor_q1}
                    onChange={(v) => setData("autor_q1", v)}
                    disabled={readonly}
                  >
                    Les infrastructures souterraines sont identifiées et marquées sur le terrain.
                  </CheckLine>
                  <CheckLine
                    checked={!!data.autor_q2}
                    onChange={(v) => setData("autor_q2", v)}
                    disabled={readonly}
                  >
                    Les mesures temporaires (barricades, signaux…) sont installées pour protéger la zone.
                  </CheckLine>
                  <CheckLine
                    checked={!!data.autor_q3}
                    onChange={(v) => setData("autor_q3", v)}
                    disabled={readonly}
                  >
                    L'impact sur la circulation a été évalué et les permis requis ont été demandés.
                  </CheckLine>
                </div>
              </Row>

              <Row label="Responsable construction (Contractant)" icon={User}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <Text
                      placeholder="Nom"
                      disabled={readonly}
                      value={data.sig_resp_construction_nom}
                      onChange={(e) => setData("sig_resp_construction_nom", e.target.value)}
                      icon={User}
                      required={!readonly}
                    />
                    <Text
                      type="date"
                      disabled={readonly}
                      value={data.sig_resp_construction_date}
                      onChange={(e) => setData("sig_resp_construction_date", e.target.value)}
                      icon={Calendar}
                      required={!readonly}
                    />
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
                <div className="grid grid-cols-2 gap-4">
                  <FieldError>{errors.sig_resp_construction_nom}</FieldError>
                  <FieldError>{errors.sig_resp_construction_date}</FieldError>
                </div>
              </Row>

              <Row label="Responsable HSE (Contractant)" icon={User}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <Text
                      placeholder="Nom"
                      disabled={readonly}
                      value={data.sig_resp_hse_nom}
                      onChange={(e) => setData("sig_resp_hse_nom", e.target.value)}
                      icon={User}
                      required={!readonly}
                    />
                    <Text
                      type="date"
                      disabled={readonly}
                      value={data.sig_resp_hse_date}
                      onChange={(e) => setData("sig_resp_hse_date", e.target.value)}
                      icon={Calendar}
                      required={!readonly}
                    />
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
                <div className="grid grid-cols-2 gap-4">
                  <FieldError>{errors.sig_resp_hse_nom}</FieldError>
                  <FieldError>{errors.sig_resp_hse_date}</FieldError>
                </div>
              </Row>
            </FormCard>

            {/* ParkX Signatures */}
            <FormCard title="Validation ParkX" icon={CheckCircle}>
              <Row label="Construction manager ParkX" icon={User}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <Text
                      placeholder="Nom (à compléter par ParkX)"
                      disabled={readonly && !showSignatureResponsableSite}
                      value={data.cm_parkx_nom || ""}
                      onChange={(e) => setData("cm_parkx_nom", e.target.value)}
                      icon={User}
                    />
                    <Text
                      type="date"
                      disabled={readonly && !showSignatureResponsableSite}
                      value={data.cm_parkx_date || ""}
                      onChange={(e) => setData("cm_parkx_date", e.target.value)}
                      icon={Calendar}
                    />
                  </div>
                  <SignaturePicker
                    id="sig_cm_parkx"
                    label="Signature (JPG/PNG)"
                    value={data.cm_parkx_file}
                    onChange={(f) => setData("cm_parkx_file", f)}
                    disabled={readonly && !showSignatureResponsableSite}
                    error={errors.cm_parkx_file}
                  />
                </div>
              </Row>

              <Row label="HSE Manager ParkX" icon={User}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 opacity-60">
                  <div className="space-y-4">
                    <Text disabled placeholder="Nom (à compléter par ParkX)" icon={User} />
                    <Text disabled placeholder="Date —" icon={Calendar} />
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

            {showFermeture && (
              <FormCard title="Fermeture du permis (à remplir physiquement)" icon={FileText}>
                <Row label="Checklist de fermeture (à cocher manuellement)" icon={CheckCircle}>
                  <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2">
                    <li>Le personnel assigné a été avisé que le travail est complété.</li>
                    <li>Les mesures temporaires, barricades et signaux d'avertissement ont été enlevés.</li>
                    <li>Les matériaux, outils et équipements ont été enlevés des lieux de travail.</li>
                    <li>L'excavation a été remblayée.</li>
                    <li>Les dessins ont été mis à jour.</li>
                    <li>Suivi additionnel requis (spécifier) : ..............................................</li>
                  </ul>
                </Row>

                <Row label="Responsable construction (Contractant)" icon={User}>
                  <div className="grid grid-cols-1 md:grid-cols-3 text-sm text-slate-700 gap-4">
                    <div className="border-b border-dashed border-slate-400 py-4">
                      Nom : .................................................
                    </div>
                    <div className="border-b border-dashed border-slate-400 py-4">
                      Date : ................................................
                    </div>
                    <div className="border-b border-dashed border-slate-400 py-4">
                      Signature : ...........................................
                    </div>
                  </div>
                </Row>

                <Row label="Responsable HSE (Contractant)" icon={User}>
                  <div className="grid grid-cols-1 md:grid-cols-3 text-sm text-slate-700 gap-4">
                    <div className="border-b border-dashed border-slate-400 py-4">
                      Nom : .................................................
                    </div>
                    <div className="border-b border-dashed border-slate-400 py-4">
                      Date : ................................................
                    </div>
                    <div className="border-b border-dashed border-slate-400 py-4">
                      Signature : ...........................................
                    </div>
                  </div>
                </Row>

                <Row label="Construction Manager ParkX" icon={User}>
                  <div className="grid grid-cols-1 md:grid-cols-3 text-sm text-slate-700 gap-4">
                    <div className="border-b border-dashed border-slate-400 py-4">
                      Nom : .................................................
                    </div>
                    <div className="border-b border-dashed border-slate-400 py-4">
                      Date : ................................................
                    </div>
                    <div className="border-b border-dashed border-slate-400 py-4">
                      Signature : ...........................................
                    </div>
                  </div>
                </Row>

                <Row label="HSE Manager ParkX" icon={User}>
                  <div className="grid grid-cols-1 md:grid-cols-3 text-sm text-slate-700 gap-4">
                    <div className="border-b border-dashed border-slate-400 py-4">
                      Nom : .................................................
                    </div>
                    <div className="border-b border-dashed border-slate-400 py-4">
                      Date : ................................................
                    </div>
                    <div className="border-b border-dashed border-slate-400 py-4">
                      Signature : ...........................................
                    </div>
                  </div>
                </Row>
              </FormCard>
            )}

            {/* ACTIONS */}
            {!readonly && (
              <motion.div 
                className="flex items-center justify-end gap-4 pb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.button
                  type="submit"
                  disabled={processing}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
                >
                  <Save className="w-5 h-5" />
                  <span>{processing ? "Envoi…" : "Soumettre"}</span>
                </motion.button>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}