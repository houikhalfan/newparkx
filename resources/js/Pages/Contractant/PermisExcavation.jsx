import React, { useMemo, useState } from "react";
import { Link, useForm } from "@inertiajs/react";


/* ---------- tiny UI helpers ---------- */
const Section = ({ title, children }) => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="border-b px-4 py-3 md:px-5">
      <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">{title}</h2>
    </div>
    <div className="p-4 md:p-5">{children}</div>
  </div>
);

const Label = (p) => (
  <label {...p} className={"block text-sm font-medium text-gray-700 mb-1 " + (p.className || "")} />
);

const Text = ({ id, ...rest }) => (
  <input
    id={id}
    {...rest}
    className={[
      "w-full rounded-lg border px-3 py-2 text-sm outline-none",
      "focus:ring-2 focus:ring-black/10 focus:border-gray-400",
      rest.disabled ? "bg-gray-50 text-gray-500" : "bg-white border-gray-300",
    ].join(" ")}
  />
);

const Area = ({ id, ...rest }) => (
  <textarea
    id={id}
    rows={3}
    {...rest}
    className={[
      "w-full rounded-lg border px-3 py-2 text-sm outline-none",
      "focus:ring-2 focus:ring-black/10 focus:border-gray-400",
      rest.disabled ? "bg-gray-50 text-gray-500" : "bg-white border-gray-300",
    ].join(" ")}
  />
);

const FieldError = ({ children }) =>
  children ? <p className="mt-1 text-xs text-rose-600">{children}</p> : null;

/* ---------- checkbox groups with “at least one” rule ---------- */
function CheckboxGroup({ legend, name, options, value, onChange, error }) {
  const toggle = (key) => {
    const set = new Set(value);
    set.has(key) ? set.delete(key) : set.add(key);
    onChange([...set]);
  };
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-gray-800">{legend}</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {options.map((o) => (
          <label key={o.key} className="inline-flex items-start gap-2">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black/20"
              checked={value.includes(o.key)}
              onChange={() => toggle(o.key)}
            />
            <span className="text-sm text-gray-800">{o.label}</span>
          </label>
        ))}
      </div>
      <FieldError>{error}</FieldError>
    </fieldset>
  );
}

/* ---------- image signature picker with preview ---------- */
function SignaturePicker({ id, label, value, onChange, disabled, error }) {
  const [preview, setPreview] = useState(null);

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

/* ============================================================
   PAGE
   ============================================================ */
export default function PermisExcavation() {
  // ---------- form state ----------
  const [data, setData] = useState({
    // IDENTIFICATION
    site: "",
    duree_de: "",
    duree_a: "",
    description: "",
    analyse_par: "",
    date_analyse: "",
    demandeur: "",
    contractant: "",
    meme_que_demandeur: false,

    // GROUPS (must pick >= 1)
    dangers_excavation: [],
    conduites_souterraines: [],
    situations_dangereuses: [],

    // EPI
    epi: {
      harnais: false,
      autre: "",
      epi_additionnel_non_requis: false,
    },

    // EQUIPEMENT PROTECTION (checklist)
    protections: {
      notes_stabilite: false,
      revision_dessins: false,
      identification_ouvrages: false,
      signalisation: false,
      barricades: false,
      excavation_manuelle_045: false,
      degagement_conduit: false,
      degagement_06: false,
      echelle_rampe: false,
      etayage: false,
      autre: "",
    },

    // COMMENTAIRES
    commentaires: "",

    // SIGNATURES (contractor side only here)
    sig_resp_construction_nom: "",
    sig_resp_construction_file: null,

    sig_resp_hse_nom: "",
    sig_resp_hse_file: null,
  });

  const set = (key, val) => setData((d) => ({ ...d, [key]: val }));

  // ---------- static options (mirroring the sheet) ----------
  const optDangers = useMemo(
    () => [
      { key: "plus_12m", label: "> 1,2 m de prof." },
      { key: "3m", label: "< 3 mètres de prof." },
      { key: "1_8m", label: "> 1,8 mètre de prof." },
      { key: "bord_rive", label: "du bord de la rive" },
      { key: "3_0m_pente", label: "> 3,0 mètres de prof. / d'une pente" },
      { key: "route", label: "d'une route" },
    ],
    []
  );

  const optConduites = useMemo(
    () => [
      { key: "electrique", label: "Électrique" },
      { key: "telecom", label: "Câbles téléphonique" },
      { key: "drainage", label: "Drainage" },
      { key: "incendie", label: "Protection incendie" },
      { key: "oleoduc", label: "Oléoduc" },
      { key: "eau", label: "Conduite d'eau" },
      { key: "proc", label: "Conduit de procédé" },
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
      { key: "autre", label: "Autre (préciser dans commentaires)" },
    ],
    []
  );

  // ---------- validation ----------
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};

    // required text fields
    const req = [
      "site",
      "duree_de",
      "duree_a",
      "description",
      "analyse_par",
      "date_analyse",
      "demandeur",
      "contractant",
    ];
    req.forEach((k) => {
      if (!String(data[k] || "").trim()) e[k] = "Champ requis.";
    });

    // groups: “at least one”
    if (data.dangers_excavation.length === 0)
      e.dangers_excavation = "Sélectionnez au moins une option.";
    if (data.conduites_souterraines.length === 0)
      e.conduites_souterraines = "Sélectionnez au moins une option.";
    if (data.situations_dangereuses.length === 0)
      e.situations_dangereuses = "Sélectionnez au moins une option.";

    // signatures required for the 2 contractor roles
    if (!data.sig_resp_construction_nom.trim()) e.sig_resp_construction_nom = "Nom requis.";
    if (!data.sig_resp_construction_file) e.sig_resp_construction_file = "Signature requise.";
    if (!data.sig_resp_hse_nom.trim()) e.sig_resp_hse_nom = "Nom requis.";
    if (!data.sig_resp_hse_file) e.sig_resp_hse_file = "Signature requise.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ---------- submit (frontend only for now) ----------
  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // For now: show JSON in console. Later, send with Inertia formData.
    // eslint-disable-next-line no-console
    console.log("PERMIS EXCAVATION (frontend only):", data);
    alert("OK ! (frontend uniquement)\nLes données sont prêtes à être envoyées au backend.");
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Permis d'excavation — Contractant</h1>
        <Link
          href="/contractant"
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          ← Retour
        </Link>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* IDENTIFICATION */}
        <Section title="Identification">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="site">Endroit / Plan</Label>
              <Text id="site" value={data.site} onChange={(e) => set("site", e.target.value)} />
              <FieldError>{errors.site}</FieldError>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="duree_de">Durée — De</Label>
                <Text
                  id="duree_de"
                  type="date"
                  value={data.duree_de}
                  onChange={(e) => set("duree_de", e.target.value)}
                />
                <FieldError>{errors.duree_de}</FieldError>
              </div>
              <div>
                <Label htmlFor="duree_a">À</Label>
                <Text
                  id="duree_a"
                  type="date"
                  value={data.duree_a}
                  onChange={(e) => set("duree_a", e.target.value)}
                />
                <FieldError>{errors.duree_a}</FieldError>
              </div>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description du travail</Label>
              <Area
                id="description"
                value={data.description}
                onChange={(e) => set("description", e.target.value)}
              />
              <FieldError>{errors.description}</FieldError>
            </div>
            <div>
              <Label htmlFor="analyse_par">Analyse des risques réalisée par</Label>
              <Text
                id="analyse_par"
                value={data.analyse_par}
                onChange={(e) => set("analyse_par", e.target.value)}
              />
              <FieldError>{errors.analyse_par}</FieldError>
            </div>
            <div>
              <Label htmlFor="date_analyse">Date</Label>
              <Text
                id="date_analyse"
                type="date"
                value={data.date_analyse}
                onChange={(e) => set("date_analyse", e.target.value)}
              />
              <FieldError>{errors.date_analyse}</FieldError>
            </div>
            <div>
              <Label htmlFor="demandeur">Demandeur du permis</Label>
              <Text
                id="demandeur"
                value={data.demandeur}
                onChange={(e) => set("demandeur", e.target.value)}
              />
              <FieldError>{errors.demandeur}</FieldError>
            </div>
            <div>
              <Label htmlFor="contractant">Contractant effectuant le travail</Label>
              <Text
                id="contractant"
                value={data.contractant}
                onChange={(e) => set("contractant", e.target.value)}
              />
              <FieldError>{errors.contractant}</FieldError>
              <label className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={data.meme_que_demandeur}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setData((d) => ({
                      ...d,
                      meme_que_demandeur: checked,
                      contractant: checked ? d.demandeur : d.contractant,
                    }));
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black/20"
                />
                Même que le demandeur
              </label>
            </div>
          </div>
        </Section>

        {/* DANGERS */}
        <Section title="Dangers particuliers">
          <div className="space-y-6">
            <CheckboxGroup
              legend="L'excavation est :"
              name="dangers_excavation"
              options={optDangers}
              value={data.dangers_excavation}
              onChange={(v) => set("dangers_excavation", v)}
              error={errors.dangers_excavation}
            />
            <CheckboxGroup
              legend="Conduites / Tuyauterie souterraines"
              name="conduites_souterraines"
              options={optConduites}
              value={data.conduites_souterraines}
              onChange={(v) => set("conduites_souterraines", v)}
              error={errors.conduites_souterraines}
            />
            <CheckboxGroup
              legend="Situations dangereuses"
              name="situations_dangereuses"
              options={optSituations}
              value={data.situations_dangereuses}
              onChange={(v) => set("situations_dangereuses", v)}
              error={errors.situations_dangereuses}
            />
          </div>
        </Section>

        {/* EPI REQUIS */}
        <Section title="Équipement de Protection Individuelle (EPI) requis">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.epi.harnais}
                onChange={(e) =>
                  set("epi", { ...data.epi, harnais: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black/20"
              />
              <span className="text-sm">Harnaisiens de retenue</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.epi.epi_additionnel_non_requis}
                onChange={(e) =>
                  set("epi", { ...data.epi, epi_additionnel_non_requis: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black/20"
              />
              <span className="text-sm">Sans EPI additionnel</span>
            </label>
            <div className="md:col-span-2">
              <Label htmlFor="epi_autre">Autre (préciser)</Label>
              <Text
                id="epi_autre"
                value={data.epi.autre}
                onChange={(e) => set("epi", { ...data.epi, autre: e.target.value })}
              />
            </div>
          </div>
        </Section>

        {/* EQUIPEMENT PROTECTION */}
        <Section title="Équipement de protection / Mesures">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[
              ["notes_stabilite", "Note de stabilité du terrain et des parois"],
              ["revision_dessins", "Révision des dessins"],
              ["identification_ouvrages", "Identification des ouvrages souterrains"],
              ["signalisation", "Barricades et signaux d'avertissement"],
              ["barricades", "Barricades de 1,1 m posées à proximité"],
              ["excavation_manuelle_045", "Excavation manuelle < 0,45 m"],
              ["degagement_conduit", "Dégagement d’un conduit souterrain"],
              ["degagement_06", "Dégagement de 0,6 mètre entre la paroi"],
              ["echelle_rampe", "Échelle ou rampe d'accès à tous les 10 m"],
              ["etayage", "Étayage"],
            ].map(([k, label]) => (
              <label key={k} className="inline-flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={data.protections[k]}
                  onChange={(e) =>
                    set("protections", { ...data.protections, [k]: e.target.checked })
                  }
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black/20"
                />
                <span className="text-sm text-gray-800">{label}</span>
              </label>
            ))}
            <div className="md:col-span-2">
              <Label htmlFor="prot_autre">Autre (préciser)</Label>
              <Text
                id="prot_autre"
                value={data.protections.autre}
                onChange={(e) =>
                  set("protections", { ...data.protections, autre: e.target.value })
                }
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
        </Section>

        {/* SIGNATURES — AUTORISATION (contractor only fields enabled) */}
        <Section title="Signatures d’autorisation du permis">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Contractor construction responsible */}
            <div>
              <Label htmlFor="sig_resp_construction_nom">
                Responsable construction — Contractant (nom en lettres moulées)
              </Label>
              <Text
                id="sig_resp_construction_nom"
                value={data.sig_resp_construction_nom}
                onChange={(e) => set("sig_resp_construction_nom", e.target.value)}
              />
              <FieldError>{errors.sig_resp_construction_nom}</FieldError>
              <div className="mt-3">
                <SignaturePicker
                  id="sig_resp_construction_file"
                  label="Signature (JPG/PNG)"
                  value={data.sig_resp_construction_file}
                  onChange={(file) => set("sig_resp_construction_file", file)}
                  error={errors.sig_resp_construction_file}
                />
              </div>
            </div>

            {/* Contractor HSE responsible */}
            <div>
              <Label htmlFor="sig_resp_hse_nom">
                Responsable HSE — Contractant (nom en lettres moulées)
              </Label>
              <Text
                id="sig_resp_hse_nom"
                value={data.sig_resp_hse_nom}
                onChange={(e) => set("sig_resp_hse_nom", e.target.value)}
              />
              <FieldError>{errors.sig_resp_hse_nom}</FieldError>
              <div className="mt-3">
                <SignaturePicker
                  id="sig_resp_hse_file"
                  label="Signature (JPG/PNG)"
                  value={data.sig_resp_hse_file}
                  onChange={(file) => set("sig_resp_hse_file", file)}
                  error={errors.sig_resp_hse_file}
                />
              </div>
            </div>

            {/* ParkX roles — disabled for contractor */}
            <div className="opacity-60">
              <Label>Construction manager ParkX</Label>
              <Text disabled placeholder="Renseigné par ParkX" />
              <div className="mt-3">
                <SignaturePicker
                  id="sig_cm_parkx"
                  label="Signature (désactivée)"
                  disabled
                  value={null}
                  onChange={() => {}}
                />
              </div>
            </div>

            <div className="opacity-60">
              <Label>HSE Manager ParkX</Label>
              <Text disabled placeholder="Renseigné par ParkX" />
              <div className="mt-3">
                <SignaturePicker
                  id="sig_hse_parkx"
                  label="Signature (désactivée)"
                  disabled
                  value={null}
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => alert("Brouillon enregistré côté client (à brancher plus tard).")}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
          >
            Enregistrer brouillon
          </button>
          <button
            type="submit"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
          >
            Soumettre
          </button>
        </div>
      </form>
    </div>
  );
}
