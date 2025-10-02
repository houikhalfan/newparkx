import React, { useMemo, useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from 'sweetalert2';

/* --------------------------------- UI bits -------------------------------- */
const BRAND = "#0E8A5D"; // ParkX green

const Section = ({ title, children }) => (
  <div className="rounded-xl border border-gray-300 bg-white shadow-md overflow-hidden mb-6">
    <div className="px-4 py-2" style={{ backgroundColor: BRAND }}>
      <h2 className="text-[13px] font-semibold tracking-wide text-white uppercase">
        {title}
      </h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const Label = ({ children, className = "", ...rest }) => (
  <label
    {...rest}
    className={`block text-sm font-semibold text-gray-800 mb-1 ${className}`}
  >
    {children}
  </label>
);

const Text = ({ disabled, readOnly, ...rest }) => (
  <input
    {...rest}
    className={[
      "w-full rounded-md border px-3 py-2 text-sm outline-none transition-all duration-200 shadow-sm",
      disabled || readOnly ? "bg-gray-100 text-gray-500" : "bg-white border-gray-300 focus:ring-2 focus:border-[#0E8A5D] focus:ring-[#0E8A5D]",
    ].join(" ")}
    disabled={disabled || readOnly}
  />
);

const Area = ({ disabled, readOnly, rows = 4, ...rest }) => (
  <textarea
    rows={rows}
    {...rest}
    className={[
      "w-full rounded-md border px-3 py-2 text-sm outline-none transition-all duration-200 shadow-sm",
      disabled || readOnly ? "bg-gray-100 text-gray-500" : "bg-white border-gray-300 focus:ring-2 focus:border-[#0E8A5D] focus:ring-[#0E8A5D]",
    ].join(" ")}
    disabled={disabled || readOnly}
  />
);

const FieldError = ({ children }) =>
  children ? <p className="mt-1 text-xs text-rose-600">{children}</p> : null;

function CheckRow({ checked, onChange, label, disabled, readOnly }) {
  return (
    <label className={`flex items-start gap-2 py-1 ${disabled || readOnly ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-gray-300 focus:ring-2"
        style={{ accentColor: BRAND, "--tw-ring-color": BRAND }}
        checked={!!checked}
        onChange={(e) => !readOnly && onChange(e.target.checked)}
        disabled={disabled || readOnly}
      />
      <span className="text-sm text-gray-800 leading-5">{label}</span>
    </label>
  );
}

function CheckboxGroup({
  legend,
  options,
  values = [],
  setValues,
  showOtherField = false,
  otherValue = "",
  onOtherChange = () => {},
  disabled = false,
  readOnly = false,
}) {
  return (
    <fieldset className="space-y-3" disabled={disabled}>
      <legend className="text-sm font-semibold text-gray-800 mb-2">{legend}</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {options.map((o) => (
          <div key={o.key} className="py-1">
            <CheckRow
              checked={values.includes(o.key)}
              onChange={() => {}}
              label={o.label}
              disabled={disabled}
              readOnly={readOnly}
            />
          </div>
        ))}
      </div>
      
      {showOtherField && values.includes("autre") && (
        <div className="mt-3">
          <Label>Précisez l'autre option:</Label>
          <Text
            value={otherValue}
            readOnly={readOnly}
          />
        </div>
      )}
    </fieldset>
  );
}

function SignaturePicker({ id, label, value, onChange, disabled, error, readOnly }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // For stored signatures (read-only mode)
  if (readOnly && value && typeof value === 'string') {
    return (
      <div>
        <Label htmlFor={id}>{label}</Label>
        <div className="mt-2">
          <img
            src={`/storage/${value}`}
            alt="Signature"
            className="h-20 w-auto rounded border border-gray-200 bg-white shadow-sm"
          />
        </div>
      </div>
    );
  }

  // For file upload (editable mode)
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg"
        disabled={disabled || readOnly}
        onChange={(e) => {
          if (readOnly) return;
          const file = e.target.files?.[0] || null;
          onChange(file);
          if (file) setPreview(URL.createObjectURL(file));
          else setPreview(null);
        }}
        className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-2 file:text-white transition-all duration-200"
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

      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="Signature preview"
            className="h-20 w-auto rounded border border-gray-200 bg-white shadow-sm"
          />
        </div>
      )}
      <FieldError>{error}</FieldError>
      <p className="mt-1 text-xs text-gray-500">Formats acceptés : JPG/PNG</p>
    </div>
  );
}

/* -------------------- HSE Manager Signature Component -------------------- */
function HSEManagerSignature({ permitData, onSignatureSubmit, isSubmitting = false, errors = {}, readonly = false }) {
  const [signatureData, setSignatureData] = useState({
    hse_parkx_nom: permitData?.hse_parkx_nom || "",
    hse_parkx_date: permitData?.hse_parkx_date || "",
    hse_parkx_file: permitData?.hse_parkx_signature || null,
    hse_parkx_commentaires: permitData?.hse_parkx_commentaires || "",
  });

  const set = (key, value) => {
    setSignatureData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = {};
    if (!signatureData.hse_parkx_nom.trim()) {
      validationErrors.hse_parkx_nom = "Nom requis.";
    }
    if (!signatureData.hse_parkx_date) {
      validationErrors.hse_parkx_date = "Date requise.";
    }
    if (!signatureData.hse_parkx_file) {
      validationErrors.hse_parkx_file = "Signature requise.";
    }

    if (Object.keys(validationErrors).length > 0) {
      if (onSignatureSubmit) {
        onSignatureSubmit(null, validationErrors);
      }
      return;
    }

    if (onSignatureSubmit) {
      onSignatureSubmit(signatureData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Section title="Validation HSE Manager ParkX">
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-3">
            En tant que HSE Manager ParkX, j'atteste avoir vérifié que toutes les mesures de sécurité 
            nécessaires ont été mises en place et que le permis de travail à chaud est conforme aux 
            exigences HSE du site.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label>HSE Manager ParkX</Label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-2">
              <div className="space-y-3">
                <Text
                  value={signatureData.hse_parkx_nom}
                  onChange={(e) => set("hse_parkx_nom", e.target.value)}
                  placeholder="Nom (à compléter par ParkX)"
                  readOnly={readonly}
                />
                <Text
                  type="date"
                  value={signatureData.hse_parkx_date}
                  onChange={(e) => set("hse_parkx_date", e.target.value)}
                  readOnly={readonly}
                />
              </div>
              <SignaturePicker
                id="hse_parkx_file"
                label="Signature (JPG/PNG)"
                value={signatureData.hse_parkx_file}
                onChange={(file) => set("hse_parkx_file", file)}
                disabled={isSubmitting || readonly}
                error={errors.hse_parkx_file}
                readOnly={readonly}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <FieldError>{errors.hse_parkx_nom}</FieldError>
              <FieldError>{errors.hse_parkx_date}</FieldError>
            </div>
          </div>

        
        </div>

        {!readonly && (
          <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t">
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="rounded-md px-5 py-2 text-sm font-semibold text-white shadow transition disabled:opacity-60"
              style={{ backgroundColor: BRAND }}
            >
              {isSubmitting ? 'Signature en cours...' : 'Signer le permis'}
            </motion.button>
          </div>
        )}
      </Section>
    </motion.div>
  );
}

/* ---------------------------------- Page ---------------------------------- */
export default function PermisTravailAChaudHSE({ permis, readonly = false, showSignatureHSE = true }) {
  const { auth, flash } = usePage().props;

  // Fonction utilitaire pour formater les dates pour les inputs date
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

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

  /* ------------------------------- form state ------------------------------ */
  const [isSigning, setIsSigning] = useState(false);
  const [signatureErrors, setSignatureErrors] = useState({});

  // Handler for HSE manager signature
  const handleHSESignature = async (signatureData, validationErrors = null) => {
    if (validationErrors) {
      setSignatureErrors(validationErrors);
      return;
    }

    setIsSigning(true);

    const formData = new FormData();
    Object.entries(signatureData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    try {
      await router.post(route("hseResponsible.permis-travail-chaud.sign", { permisTravailChaud: permis.id }), formData, {
        forceFormData: true,
        onSuccess: () => {
          Swal.fire({
            title: 'Succès!',
            text: 'Permis signé avec succès',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          // Redirect to the HSE responsible permits index
          router.visit(route('hseResponsible.permis.index'));
        },
        onError: (errors) => {
          setSignatureErrors(errors);
          Swal.fire({
            title: 'Erreur!',
            text: 'Erreur lors de la signature',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
    } catch (error) {
      console.error('Signature error:', error);
    } finally {
      setIsSigning(false);
    }
  };

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
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" x2="8" y1="13" y2="13" />
                      <line x1="16" x2="8" y1="17" y2="17" />
                      <line x1="10" x2="8" y1="9" y2="9" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    PERMIS DE TRAVAIL À CHAUD
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">Validation HSE Manager ParkX</p>
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
                    href={route('hseResponsible.permis.index')}
                    className="group relative inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m12 19-7-7 7-7" />
                      <path d="M19 12H5" />
                    </svg>
                    <span>Retour à la liste</span>
                  </a>
                </motion.div>

                {/* User Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="text-slate-800">
                    <p className="text-sm font-medium">HSE Manager</p>
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
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              PERMIS DE TRAVAIL À CHAUD
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Validation HSE Manager ParkX
            </p>
          </motion.div>

          {/* Flash Messages */}
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

          <div className="space-y-6">
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
                
                <div>
                  <div className="text-sm text-slate-600 mb-1">NUMÉRO DE PERMIS</div>
                  <Text
                    disabled
                    value={permis.numero_permis}
                  />
                </div>
              </div>
            </motion.div>

            {/* Display permit information in read-only mode */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-6"
            >
              {/* IDENTIFICATION - Read Only */}
              <Section title="IDENTIFICATION">
                <div className="space-y-4">
                  <div>
                    <Label>Endroit</Label>
                    <Text
                      readOnly
                      value={permis.site?.name || permis.site_id}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>De (Date de début)</Label>
                      <Text
                        type="date"
                        readOnly
                        value={formatDateForInput(permis.date_debut)}
                      />
                    </div>

                    <div>
                      <Label>À (Date de fin)</Label>
                      <Text
                        type="date"
                        readOnly
                        value={formatDateForInput(permis.date_fin)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description de la tâche</Label>
                    <Area
                      readOnly
                      value={permis.description_tache}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Plan sécuritaire de la tâche réalisé par</Label>
                      <Text
                        readOnly
                        value={permis.plan_securitaire_par}
                      />
                    </div>

                    <div>
                      <Label>Date du plan sécuritaire</Label>
                      <Text
                        type="date"
                        readOnly
                        value={formatDateForInput(permis.date_plan_securitaire)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Contractant demandeur du permis</Label>
                      <Text
                        readOnly
                        value={permis.contractant_demandeur}
                      />
                    </div>

                    <div>
                      <Label>Contractant effectuant le travail</Label>
                      <Text
                        readOnly
                        value={permis.contractant_travail}
                      />
                    </div>
                  </div>
                </div>
              </Section>

              {/* TYPE D'ACTIVITE - Read Only */}
              <Section title="TYPE D'ACTIVITE">
                <CheckboxGroup
                  legend="Sélectionner les activités"
                  options={optActivite}
                  values={permis.activites || []}
                  showOtherField={true}
                  otherValue={permis.activite_autre || ""}
                  readOnly={true}
                />
              </Section>

              {/* DANGERS PARTICULIERS - Read Only */}
              <Section title="DANGERS PARTICULIERS">
                <CheckboxGroup
                  legend="Sélectionner les dangers"
                  options={optDangers}
                  values={permis.dangers || []}
                  showOtherField={true}
                  otherValue={permis.danger_autre || ""}
                  readOnly={true}
                />
              </Section>

              {/* ÉQUIPEMENT DE PROTECTION PERSONNELLE REQUIS - Read Only */}
              <Section title="ÉQUIPEMENT DE PROTECTION PERSONNELLE REQUIS">
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-semibold">
                    Lunettes de sécurité, chapeau, bottes, gants et manches longues sont toujours requis
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <CheckboxGroup
                      legend="PROTECTION PHYSIQUE"
                      options={optProtectionPhysique}
                      values={permis.protection_physique || []}
                      showOtherField={true}
                      otherValue={permis.protection_physique_autre || ""}
                      readOnly={true}
                    />
                  </div>
                  <div>
                    <CheckboxGroup
                      legend="PROTECTION RESPIRATOIRE"
                      options={optProtectionRespiratoire}
                      values={permis.protection_respiratoire || []}
                      readOnly={true}
                    />
                  </div>
                </div>
              </Section>

              {/* ÉQUIPEMENT DE PROTECTION - Read Only */}
              <Section title="ÉQUIPEMENT DE PROTECTION">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <CheckboxGroup
                      legend="PROTECTION INCENDIE"
                      options={optProtectionIncendie}
                      values={permis.protection_incendie || []}
                      showOtherField={true}
                      otherValue={permis.protection_incendie_autre || ""}
                      readOnly={true}
                    />
                  </div>
                  <div>
                    <CheckboxGroup
                      legend="ÉQUIPEMENT D'INSPECTION"
                      options={optEquipementInspection}
                      values={permis.equipement_inspection || []}
                      readOnly={true}
                    />
                  </div>
                  <div>
                    <CheckboxGroup
                      legend="PERMIS"
                      options={optPermis}
                      values={permis.permis_requis || []}
                      readOnly={true}
                    />
                  </div>
                  <div>
                    <CheckboxGroup
                      legend="SURVEILLANCE REQUISE"
                      options={optSurveillance}
                      values={permis.surveillance_requise || []}
                      readOnly={true}
                    />
                  </div>
                </div>
              </Section>

              {/* COMMENTAIRES - Read Only */}
              <Section title="COMMENTAIRES ET RECOMMANDATIONS PARTICULIÈRES">
                {permis.aucun_commentaire ? (
                  <p className="text-gray-600 text-sm">Aucun commentaire additionnel ou recommandation</p>
                ) : (
                  <Area
                    readOnly
                    value={permis.commentaires}
                    rows={4}
                  />
                )}
              </Section>

              {/* SIGNATURES CONTRACTANT - Read Only */}
              <Section title="SIGNATURES D'AUTORISATION DE PERMIS (CONTRACTANT)">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <Label>Responsable construction — Nom en lettres moulées</Label>
                    <Text
                      readOnly
                      value={permis.resp_construction_nom}
                    />
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      <SignaturePicker
                        id="resp_construction_file"
                        label="Signature"
                        value={permis.resp_construction_signature}
                        onChange={() => {}}
                        readOnly={true}
                      />
                      <div>
                        <Label>Date</Label>
                        <Text
                          type="date"
                          readOnly
                          value={formatDateForInput(permis.resp_construction_date)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Responsable HSE — Nom en lettres moulées</Label>
                    <Text
                      readOnly
                      value={permis.resp_hse_nom}
                    />
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      <SignaturePicker
                        id="resp_hse_file"
                        label="Signature"
                        value={permis.resp_hse_signature}
                        onChange={() => {}}
                        readOnly={true}
                      />
                      <div>
                        <Label>Date</Label>
                        <Text
                          type="date"
                          readOnly
                          value={formatDateForInput(permis.resp_hse_date)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              {/* CONSTRUCTION MANAGER SIGNATURE - Read Only */}
              <Section title="VALIDATION PARKX">
                <div className="space-y-4">
                  <div>
                    <Label>Construction manager ParkX</Label>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-2">
                      <div className="space-y-3">
                        <Text
                          readOnly
                          value={permis.cm_parkx_nom || ""}
                          placeholder="Nom (à compléter par ParkX)"
                        />
                        <Text
                          type="date"
                          readOnly
                          value={formatDateForInput(permis.cm_parkx_date)}
                        />
                      </div>
                      <SignaturePicker
                        id="cm_parkx_file"
                        label="Signature"
                        value={permis.cm_parkx_signature}
                        onChange={() => {}}
                        readOnly={true}
                      />
                    </div>
                  </div>
                </div>
              </Section>

              {/* HSE MANAGER SIGNATURE SECTION */}
              {showSignatureHSE && (
                <HSEManagerSignature
                  permitData={permis}
                  onSignatureSubmit={handleHSESignature}
                  isSubmitting={isSigning}
                  errors={signatureErrors}
                  readonly={readonly}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}