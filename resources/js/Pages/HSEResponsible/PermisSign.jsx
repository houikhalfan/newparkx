import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/Pages/DashboardLayout";


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

const inputBase =
  "w-full rounded-md border px-3 py-2 text-sm outline-none transition-all duration-200 shadow-sm";
const inputActive =
  "bg-white border-gray-300 focus:ring-2 focus:border-[color:var(--brand)] focus:ring-[color:var(--brand)]";
const inputDisabled = "bg-gray-100 text-gray-500";

const Text = ({ disabled, ...rest }) => (
  <input
    {...rest}
    disabled={disabled}
    className={[inputBase, disabled ? inputDisabled : inputActive].join(" ")}
    style={{ "--brand": BRAND }}
  />
);

const Area = ({ rows = 3, disabled, ...rest }) => (
  <textarea
    rows={rows}
    disabled={disabled}
    {...rest}
    className={[inputBase, disabled ? inputDisabled : inputActive].join(" ")}
    style={{ "--brand": BRAND }}
  />
);

const FieldError = ({ children }) =>
  children ? <p className="mt-1 text-xs text-rose-600">{children}</p> : null;

const CheckLine = ({ children, checked, onChange, disabled }) => (
  <label
    className={[
      "flex items-start gap-2 py-1",
      disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
    ].join(" ")}
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
        style={{ ["--brand"]: BRAND, ["accentColor"]: BRAND }}
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
      }, []);

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
  <DashboardLayout>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: BRAND }}
          >
            <div className="flex items-center gap-3">
              <img src={logoSrc} alt="ParkX" className="h-8 w-auto" />
              <h1 className="text-white font-semibold tracking-wide uppercase">
                PERMIS D’EXCAVATION — CONSTRUCTION
              </h1>
            </div>

        <div className="text-right">
  {/* NUMÉRO DE PERMIS GÉNÉRAL (user enters manually) */}
  <div className="text-[11px] text-white/90">NUMÉRO DE PERMIS GÉNÉRAL</div>
  <div className="mt-1">
    <Text
  disabled
  value={data.numero_permis_general}
/>

    <FieldError>{errors.numero_permis_general}</FieldError>
  </div>

  {/* NUMÉRO DE PERMIS (auto-generated) */}
  <div className="mt-2">
    <div className="text-[11px] text-white/90">NUMÉRO DE PERMIS</div>
  <Text
  disabled
  value={data.numero_permis || generatedPermitNumber}
/>

    <FieldError>{errors.numero_permis}</FieldError>
  </div>
</div>

          </div>
        </div>

        {/* Flash */}
        <AnimatePresence>
          {flash?.success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              {flash.success}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={onSubmit} className="space-y-6">
              <fieldset disabled>
          {/* IDENTIFICATION */}
          <FormCard title="Identification">
            <Row label="Endroit / Plan">
              <select
                value={data.site_id}
                disabled={readonly}
                onChange={(e) => setData("site_id", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-all duration-200 shadow-sm focus:ring-2"
                style={{ ["--tw-ring-color"]: BRAND }}
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
            </Row>

            <Row label="Durée">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Text
                  type="date"
                  disabled={readonly}
                  value={data.duree_de}
                  onChange={(e) => setData("duree_de", e.target.value)}
                />
                <Text
                  type="date"
                  disabled={readonly}
                  value={data.duree_a}
                  onChange={(e) => setData("duree_a", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FieldError>{errors.duree_de}</FieldError>
                <FieldError>{errors.duree_a}</FieldError>
              </div>
            </Row>

            <Row label="Description du travail">
              <Area
                disabled={readonly}
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
              />
              <FieldError>{errors.description}</FieldError>
            </Row>

            <Row label="Analyse des risques réalisée par">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Text
                  disabled={readonly}
                  value={data.analyse_par}
                  onChange={(e) => setData("analyse_par", e.target.value)}
                />
                <Text
                  type="date"
                  disabled={readonly}
                  value={data.date_analyse}
                  onChange={(e) => setData("date_analyse", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FieldError>{errors.analyse_par}</FieldError>
                <FieldError>{errors.date_analyse}</FieldError>
              </div>
            </Row>

            <Row label="Demandeur du permis">
              <Text
                disabled={readonly}
                value={data.demandeur}
                onChange={(e) => setData("demandeur", e.target.value)}
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
                <label className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 focus:ring-2"
                    style={{ accentColor: BRAND, ["--tw-ring-color"]: BRAND }}
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

            <Row label="L’excavation est :">
              <div className="divide-y">
                {optExcavationEst.map((o) => (
                  <div key={o.key} className="py-1">
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
              <div className="divide-y">
                {optConduites.map((o) => (
                  <div key={o.key} className="py-1">
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
              <div className="divide-y">
                {optSituations.map((o) => (
                  <div key={o.key} className="py-1">
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
              <div className="divide-y">
                {optEpiSimples.map((o) => (
                  <div key={o.key} className="py-1">
                    <CheckLine
                      checked={Array.isArray(data.epi_simples) && data.epi_simples.includes(o.key)}
                      onChange={() => toggleArray("epi_simples", o.key)}
                      disabled={readonly || data.epi_sans_additionnel}
                    >
                      {o.label}
                    </CheckLine>
                  </div>
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
                <div className="divide-y">
                  {optEquip.map((o) => (
                    <div key={o.key} className="py-1">
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
              />
            </Row>

            <Row label="Propriétaire des lieux (nom en lettres moulées)">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <Text
                    disabled={readonly}
                    value={data.proprietaire_nom}
                    onChange={(e) => setData("proprietaire_nom", e.target.value)}
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
                  />
                  <FieldError>{errors.proprietaire_date}</FieldError>
                </div>
              </div>
            </Row>
          </FormCard>

          {/* SIGNATURES D’AUTORISATION */}
          <FormCard title="Signatures d’autorisation de permis">
            <Row label="Vérifications">
              <div className="divide-y">
                <div className="py-1">
                  <CheckLine
                    checked={!!data.autor_q1}
                    onChange={(v) => setData("autor_q1", v)}
                    disabled={readonly}
                  >
                    Les infrastructures souterraines sont identifiées et marquées sur le terrain.
                  </CheckLine>
                </div>
                <div className="py-1">
                  <CheckLine
                    checked={!!data.autor_q2}
                    onChange={(v) => setData("autor_q2", v)}
                    disabled={readonly}
                  >
                    Les mesures temporaires (barricades, signaux…) sont installées pour protéger la zone.
                  </CheckLine>
                </div>
                <div className="py-1">
                  <CheckLine
                    checked={!!data.autor_q3}
                    onChange={(v) => setData("autor_q3", v)}
                    disabled={readonly}
                  >
                    L’impact sur la circulation a été évalué et les permis requis ont été demandés.
                  </CheckLine>
                </div>
              </div>
            </Row>

            <Row label="Responsable construction (Contractant)">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
              <div className="grid grid-cols-2 gap-3">
                <FieldError>{errors.sig_resp_construction_nom}</FieldError>
                <FieldError>{errors.sig_resp_construction_date}</FieldError>
              </div>
            </Row>

            <Row label="Responsable HSE (Contractant)">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
              <div className="grid grid-cols-2 gap-3">
                <FieldError>{errors.sig_resp_hse_nom}</FieldError>
                <FieldError>{errors.sig_resp_hse_date}</FieldError>
              </div>
            </Row>
            </FormCard> 
  </fieldset>
           {/* ParkX Signatures */}
<FormCard title="Validation ParkX">
  <Row label="Construction manager ParkX">
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="space-y-3">
        <Text
          placeholder="Nom (à compléter par ParkX)"
          disabled={readonly && !showSignatureResponsableSite}
          value={data.cm_parkx_nom || ""}
          onChange={(e) => setData("cm_parkx_nom", e.target.value)}
        />
        <Text
          type="date"
          disabled={readonly && !showSignatureResponsableSite}
          value={data.cm_parkx_date || ""}
          onChange={(e) => setData("cm_parkx_date", e.target.value)}
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

<Row label="HSE Manager ParkX">
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
    <div className="space-y-3">
      <Text
        placeholder="Nom (à compléter par ParkX)"
        value={data.hse_parkx_nom || ""}
        onChange={(e) => setData("hse_parkx_nom", e.target.value)}
      />
      <Text
        type="date"
        value={data.hse_parkx_date || ""}
        onChange={(e) => setData("hse_parkx_date", e.target.value)}
      />
    </div>
    <SignaturePicker
      id="sig_hse_parkx"
      label="Signature (JPG/PNG)"
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
        <li>Les mesures temporaires, barricades et signaux d’avertissement ont été enlevés.</li>
        <li>Les matériaux, outils et équipements ont été enlevés des lieux de travail.</li>
        <li>L’excavation a été remblayée.</li>
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
    </DashboardLayout>
  );
}

