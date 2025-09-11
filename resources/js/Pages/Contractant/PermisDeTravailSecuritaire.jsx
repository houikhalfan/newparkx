import React, { useMemo, useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import ContractantLayout from "@/Pages/ContractantLayout";

/* --------------------------------- UI bits -------------------------------- */
const Section = ({ title, children }) => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="border-b px-4 py-3 md:px-5">
      <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
        {title}
      </h2>
    </div>
    <div className="p-4 md:p-5">{children}</div>
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

const Text = ({ disabled, ...rest }) => (
  <input
    {...rest}
    className={[
      "w-full rounded-lg border px-3 py-2 text-sm outline-none",
      "focus:ring-2 focus:ring-black/10 focus:border-gray-400",
      disabled ? "bg-gray-50 text-gray-500" : "bg-white border-gray-300",
    ].join(" ")}
  />
);

const Area = ({ disabled, rows = 4, ...rest }) => (
  <textarea
    rows={rows}
    {...rest}
    className={[
      "w-full rounded-lg border px-3 py-2 text-sm outline-none",
      "focus:ring-2 focus:ring-black/10 focus:border-gray-400",
      disabled ? "bg-gray-50 text-gray-500" : "bg-white border-gray-300",
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
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black/20"
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
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-gray-900 mb-1">{legend}</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {options.map((o) => (
          <label key={o.key} className="inline-flex items-start gap-2">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black/20"
              checked={values.includes(o.key)}
              onChange={() => toggle(o.key)}
              disabled={isNoneSelected && o.key !== mutuallyExclusiveKey}
            />
            <span className="text-sm text-gray-800">{o.label}</span>
          </label>
        ))}
      </div>
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
          "block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-gray-900 file:px-3 file:py-2",
          "file:text-white hover:file:opacity-90",
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

/* ---------------------------------- Page ---------------------------------- */
export default function Excavation() {
  const { sites = [] } = usePage().props;

  /* ----------------------------- static options ---------------------------- */
  // TYPE D'ACTIVITÉ
  const optActivite = useMemo(
    () => [
      { key: "travail_chaud", label: "Travail à chaud" },
      { key: "espace_confine", label: "Espace confiné" },
      { key: "consignation", label: "Consignation/Déconsignation" },
      { key: "demolition", label: "Démolition" },
      { key: "echafaudage", label: "Échafaudage" },
      { key: "lignes_elec", label: "À proximité de lignes électriques" },
      { key: "structures_temp", label: "Structures temporaires – activités à haut risque" },
      { key: "moins_3m_eau", label: "À moins de 3 m de la ligne d'eau ou littoral" },
      { key: "plateforme_aerienne", label: "Avec une plate-forme aérienne motorisée" },
      { key: "excavation", label: "Excavation" },
      { key: "dynamitage", label: "Dynamitage" },
      { key: "fermeture_route", label: "Fermeture de la route" },
      { key: "levage_critique", label: "Levage critique" },
      { key: "levage_personnel", label: "Levage du personnel" },
      { key: "radiographie", label: "Radiographie" },
      { key: "hydrotest", label: "HydroTest" },
      { key: "mise_service", label: "Mise en service" },
      { key: "autre", label: "Autre (préciser en commentaires)" },
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
      { key: "scan", label: "Rapport de scan" },
      { key: "isolement", label: "Plan d'isolement" },
      { key: "levage", label: "Étude de Levage" },
      { key: "deviation", label: "Plan de déviation de la route" },
      { key: "radio", label: "Plan de radiographie" },
      { key: "hydro", label: "Plan d'hydro-test" },
    ],
    []
  );

  // DANGERS PARTICULIERS (grand tableau)
  const optDangers = useMemo(
    () => [
      { key: "glisser", label: "Glisser / trébucher / tomber" },
      { key: "acces_difficile", label: "Accès ou travail difficilement accessible" },
      { key: "chute_hauteur", label: "Chute en hauteur" },
      { key: "mobile_rotatif", label: "Équipement mobile / rotatif" },
      { key: "coupe_outil", label: "Coupe / perforer (bords tranchants, coupe, clous…)" },
      { key: "frapper", label: "Frapper / Se faire frapper" },
      { key: "pression_souffle", label: "Équipement sous pression / sous vide" },
      { key: "brulure", label: "Brûlure de chaleur / de froid" },
      { key: "vapeurs", label: "Vapeurs inflammables / combustibles" },
      { key: "elec", label: "Danger électriques" },
      { key: "bruit", label: "Bruit" },
      { key: "ergonomie", label: "Ergonomie" },
      { key: "produits", label: "Produits chimiques" },
      { key: "faible_oxygene", label: "Faible concentration en oxygène" },
      { key: "atmosphere", label: "Atmosphère dangereuse" },
      { key: "rayonnements", label: "Radiations ionisantes / non-ionisantes" },
      { key: "stress_thermique", label: "Stress thermique (chaud / froid)" },
      { key: "poussieres", label: "Poussières et contaminants dans l'air" },
      { key: "meteo", label: "Conditions météorologiques" },
      { key: "contamination_sol", label: "Contamination des sols / de l'eau" },
      { key: "simultane", label: "Opérations simultanées" },
      { key: "autre", label: "Autre (préciser en commentaires)" },
      { key: "aucun", label: "Aucun" },
    ],
    []
  );

  // EPI – Chimique/Physique
  const optEpiChimique = useMemo(
    () => [
      { key: "lunette", label: "Lunette" },
      { key: "ecran", label: "Écran facial" },
      { key: "auditive", label: "Protection auditive" },
      { key: "arc_electrique", label: "Protection de l'Arc électrique" },
      { key: "chutes", label: "Protection contre les chutes (ligne de vie, Harnais)" },
      { key: "flottaison", label: "Équipement de flottaison" },
      { key: "gants", label: "Gants (soudage, chaleur, produits chimiques…)" },
      { key: "vetements", label: "Vêtements / tablier de soudage ou imperméables" },
      { key: "autre", label: "Autre (préciser en commentaires)" },
    ],
    []
  );

  // EPI – Respiratoire
  const optEpiResp = useMemo(
    () => [
      { key: "filtres", label: "Appareils à filtres à particules" },
      { key: "cartouches", label: "Appareils à cartouches chimiques" },
      { key: "epuration", label: "Appareil à épuration d’air pour le soudage" },
      { key: "isolant", label: "Appareil respiratoire isolant" },
    ],
    []
  );

  // ÉQUIPEMENT DE PROTECTION (checklist)
  const optEquiptComms = useMemo(
    () => [
      { key: "radios", label: "Radio(s)" },
      { key: "signaleurs", label: "Signaleurs" },
      { key: "avertissement", label: "Signaux d’avertissement" },
      { key: "perimetre", label: "Périmètre de sécurité" },
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
      { key: "echant", label: "Équipement d’échantillonnage" },
      { key: "ventilation", label: "Ventilation mécanique" },
      { key: "anemometre", label: "Anémomètre (vitesse du vent)" },
    ],
    []
  );

  const optEtincelles = useMemo(
    () => [
      { key: "anti_deflag", label: "Outils anti-déflagrants" },
      { key: "mise_terre", label: "Mise à la terre" },
      { key: "anti_explosion", label: "Éclairage anti-explosion" },
      { key: "autres", label: "Autres" },
    ],
    []
  );

  /* ------------------------------- form state ------------------------------ */
  const [data, setData] = useState({
    // IDENTIFICATION
    site_id: "",
    duree_de: "",
    duree_a: "",
    description: "",
    plan_securitaire_par: "",
    date_analyse: "",
    demandeur: "",
    contractant: "",
    meme_que_demandeur: false,

    // GROUPES (au moins 1)
    activites: [],
    permis_supp: [],
    dangers: [],

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

    // Groupes (>=1)
    if (data.activites.length === 0) e.activites = "Sélectionnez au moins une activité.";
    if (data.permis_supp.length === 0) e.permis_supp = "Sélectionnez au moins un permis supplémentaire.";
    if (data.dangers.length === 0) e.dangers = "Sélectionnez au moins un danger.";

    // EPI – au moins un globalement, sauf si “sans additionnel”
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

  const onSubmit = (e) => {
    e.preventDefault();
    setOk(false);
    if (!validate()) return;

    // Frontend-only for now:
    // Here you'd build a FormData and POST to your route for storage (including images).
    // console.log("PERMIS EXCAVATION (payload):", data);

    setOk(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ------------------------------- rendering ------------------------------- */
  return (
    <ContractantLayout title="Permis d'excavation">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Permis de travail sécuritaire — Construction 
          </h1>
      
        </div>

        <AnimatePresence>
          {ok && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              Données validées côté client. Prêt à envoyer au responsable de site
              (puis HSE). Implémentez ensuite l’enregistrement & PDF côté Laravel.
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* IDENTIFICATION */}
          <Section title="Identification">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Endroit / Plan</Label>
                <select
                  value={data.site_id}
                  onChange={(e) => set("site_id", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
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
                  <Label>Durée — De</Label>
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
                  onChange={(e) => set("demandeur", e.target.value)}
                />
                <FieldError>{errors.demandeur}</FieldError>
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
                        contractant: checked ? d.demandeur : d.contractant,
                      }));
                    }}
                  />
                  Même que demandeur
                </label>
              </div>
            </div>
          </Section>

          {/* TYPE D'ACTIVITÉ */}
          <Section title="Type d’activité">
            <CheckboxGroup
              legend="Sélectionner les activités"
              options={optActivite}
              values={data.activites}
              setValues={(v) => set("activites", v)}
              error={errors.activites}
            />
          </Section>

          {/* PERMIS SUPPLÉMENTAIRE REQUIS */}
          <Section title="Permis de travail supplémentaire requis">
            <CheckboxGroup
              legend="Permis"
              options={optPermisSupp}
              values={data.permis_supp}
              setValues={(v) => set("permis_supp", v)}
              error={errors.permis_supp}
            />
          </Section>

          {/* DANGERS PARTICULIERS */}
          <Section title="Dangers particuliers">
            <CheckboxGroup
              legend="Sélectionner les dangers (ou 'Aucun')"
              options={optDangers}
              values={data.dangers}
              setValues={(v) => set("dangers", v)}
              mutuallyExclusiveKey="aucun"
              error={errors.dangers}
            />
          </Section>

          {/* ÉQUIPEMENT DE PROTECTION PERSONNELLE (EPI) */}
          <Section title="Équipement de protection personnelle requis (EPI)">
            <div className="mb-3">
              <CheckRow
                checked={data.epi_sans_additionnel}
                onChange={(v) => set("epi_sans_additionnel", v)}
                label="Sans EPI additionnel"
              />
              <FieldError>{errors.epi}</FieldError>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className={`${data.epi_sans_additionnel ? "opacity-60" : ""}`}>
                <CheckboxGroup
                  legend="Protection chimique et physique"
                  options={optEpiChimique}
                  values={data.epi_chimique}
                  setValues={(v) => set("epi_chimique", v)}
                />
              </div>
              <div className={`${data.epi_sans_additionnel ? "opacity-60" : ""}`}>
                <CheckboxGroup
                  legend="Protection respiratoire"
                  options={optEpiResp}
                  values={data.epi_respiratoire}
                  setValues={(v) => set("epi_respiratoire", v)}
                />
              </div>
            </div>
          </Section>

          {/* ÉQUIPEMENT DE PROTECTION (checklist) */}
          <Section title="Équipement de protection / Mesures">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <CheckboxGroup
                  legend="Communications"
                  options={optEquiptComms}
                  values={data.equip_comms}
                  setValues={(v) => set("equip_comms", v)}
                  error={errors.equip_comms}
                />
              </div>
              <div>
                <CheckboxGroup
                  legend="Barrières / Sécurité"
                  options={optEquiptBarriers}
                  values={data.equip_barrieres}
                  setValues={(v) => set("equip_barrieres", v)}
                  error={errors.equip_barrieres}
                />
              </div>
              <div>
                <CheckboxGroup
                  legend="Qualité de l’air"
                  options={optQualiteAir}
                  values={data.equip_qualite_air}
                  setValues={(v) => set("equip_qualite_air", v)}
                  error={errors.equip_qualite_air}
                />
              </div>
              <div>
                <CheckboxGroup
                  legend="Électricité / Étincelles / Chocs"
                  options={optEtincelles}
                  values={data.equip_etincelles}
                  setValues={(v) => set("equip_etincelles", v)}
                  error={errors.equip_etincelles}
                />
              </div>
            </div>
          </Section>

          {/* COMMENTAIRES */}
          <Section title="Commentaires et recommandations particulières">
            <Area
              value={data.commentaires}
              onChange={(e) => set("commentaires", e.target.value)}
              placeholder="Commentaires additionnels…"
            />
            <FieldError>{errors.commentaires}</FieldError>
          </Section>

          {/* SIGNATURES — AUTORISATION (Contractant requis) */}
          <Section title="Signatures d’autorisation du permis">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Responsable construction – Contractant */}
              <div>
                <Label>Responsable construction (Contractant) — Nom</Label>
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

              {/* Responsable HSE – Contractant */}
              <div>
                <Label>Responsable HSE (Contractant) — Nom</Label>
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

              {/* ParkX roles – désactivés ici */}
              <div className="opacity-60">
                <Label>Construction manager ParkX</Label>
                <Text disabled placeholder="Renseigné par ParkX" />
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <SignaturePicker
                    id="sig_cm_parkx"
                    label="Signature (désactivée)"
                    disabled
                    value={null}
                    onChange={() => {}}
                  />
                  <div>
                    <Label>Date</Label>
                    <Text disabled placeholder="—" />
                  </div>
                </div>
              </div>

              <div className="opacity-60">
                <Label>HSE Manager ParkX</Label>
                <Text disabled placeholder="Renseigné par ParkX" />
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <SignaturePicker
                    id="sig_hse_parkx"
                    label="Signature (désactivée)"
                    disabled
                    value={null}
                    onChange={() => {}}
                  />
                  <div>
                    <Label>Date</Label>
                    <Text disabled placeholder="—" />
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* FERMETURE DU PERMIS (affiché – non requis pour l’instant) */}
          <Section title="Fermeture du permis (sera complétée après travaux)">
            <div className="grid grid-cols-1 gap-4">
              <CheckRow
                checked={data.fermeture_q1 === true}
                onChange={(v) => set("fermeture_q1", v)}
                label="Le personnel assigné aux travaux a-t-il été avisé que le travail est complété ?"
              />
              <CheckRow
                checked={data.fermeture_q2 === true}
                onChange={(v) => set("fermeture_q2", v)}
                label="Les mesures temporaires (barricades / avertissements) ont-elles été enlevées ?"
              />
              <CheckRow
                checked={data.fermeture_q3 === true}
                onChange={(v) => set("fermeture_q3", v)}
                label="Les matériaux / outils / équipements ont-ils été enlevés des lieux ?"
              />
              <p className="text-xs text-gray-500">
                * Cette section ne bloque pas la soumission du Contractant pour l’instant.
              </p>
            </div>
          </Section>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-3 pb-2">
            <button
              type="submit"
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
              Soumettre (validation locale)
            </button>
          </div>
        </form>
      </div>
    </ContractantLayout>
  );
}
