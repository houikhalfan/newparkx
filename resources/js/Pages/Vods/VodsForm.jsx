import React, { useState, useEffect, useRef, useMemo } from 'react';
import { usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  FileText, 
  User, 
  Users, 
  Building, 
  Plus, 
  X, 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  Shield,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Trash2,
  Save
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function VodsForm() {
  const { auth, flash: _flash } = usePage().props;
  const flash = _flash || {};

  // Quota banners/lock
  const { quota } = usePage().props || {};
  const canSubmit = quota?.canSubmit ?? true;
  const remaining = quota?.remaining ?? null;
  const daysLeft  = quota?.daysLeft ?? null;

  // For full reset of file inputs
  const [formVersion, setFormVersion] = useState(0);

  // Mobile detection for default-collapsed sections
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Helpers
  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todayHuman = useMemo(() => new Date().toLocaleDateString('fr-FR'), []);
  const onlyLetters = (text) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test((text || '').trim());
  const lettersOnlyProps = { pattern: "[A-Za-zÀ-ÖØ-öø-ÿ\\s]+", title: "Lettres et espaces uniquement" };

  const [header, setHeader] = useState({
    date: '', // set on mount
    projet: '',
    activite: '',
    observateur: auth?.user?.name || '',
    personnesObservees: [''],
    entrepriseObservee: [''],
  });

  useEffect(() => {
    // Only set default date once (if not prefilled by server)
    setHeader((h) => h.date ? h : { ...h, date: todayIso });
  }, [todayIso]);

  const [pratiques, setPratiques] = useState([{ text: '', photo: null }]);
  const [comportements, setComportements] = useState([{ type: '', description: '', photo: null }]);
  const [conditions, setConditions] = useState({});
  const [correctives, setCorrectives] = useState({});
  const [autresConditions, setAutresConditions] = useState([]);

  const [errors, setErrors] = useState({});
  const [topAlert, setTopAlert] = useState(null);
  const alertRef = useRef(null);

  useEffect(() => {
    if (topAlert && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      alertRef.current.focus?.();
    }
  }, [topAlert]);

  const comportementOptions = [
    "Risques de chutes de plain-pied & chutes en hauteur",
    "Risques de manutention manuelle",
    "Risques de manutention mécanisée",
    "Risques de circulations & déplacements",
    "Risques d'effondrements & chutes d'objets",
    "Risques de toxicité",
    "Risques d'incendies & explosions",
    "Risques biologiques",
    "Risques d'électricité",
    "Risques de manque d'hygiène",
    "Risques de bruits",
    "Risques de vibrations",
    "Risques d'ambiances thermiques",
    "Risques d'ambiances lumineuses",
    "Risques de rayonnements",
    "Risques de machines & outils",
    "Risques d'interventions en entreprises extérieures",
    "Risques d'organisation du travail & Stress",
  ];

  const dangerousConditionsList = [
    "EPI","Environnement de travail","Conditions de travail","Outillage",
    "Procédures et modes opératoires","Qualifications, habilitation et formation",
    "Inappropriés aux risques","Housekeeping insatisfaisant","Mauvaise ergonomie",
    "Mauvais état de conformité","Non portés correctement","Gestion de déchets insatisfaisante",
    "Problème d'accessibilité","Inappropriés aux tâches","Inadéquats aux tâches",
    "Non appliqués ou appliqués incorrectement","En mauvais état",
    "Présence de fuites et émanations","Non utilisés correctement","Personnel non formé",
    "Personnel non habilité"
  ];

  const handleFileUpload = (list, setList, index, file, key = 'photo') => {
    const updated = [...list];
    updated[index][key] = file || null;
    setList(updated);
  };

  const handleConditionToggle = (key) => {
    setConditions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCorrectiveChange = (key, field, value) => {
    setCorrectives(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!header.date) newErrors.date = "La date est requise.";
    if (!header.projet) newErrors.projet = "Le projet est requis.";
    if (!header.activite) newErrors.activite = "L\'activité est requise.";

    if (header.projet && !onlyLetters(header.projet)) newErrors.projet = "Le projet ne doit contenir que des lettres et des espaces.";
    if (header.activite && !onlyLetters(header.activite)) newErrors.activite = "L\'activité ne doit contenir que des lettres et des espaces.";

    if (!header.personnesObservees[0]) newErrors.personnesObservees = "Au moins une personne observée est requise.";
    header.personnesObservees.forEach((p, i) => { if (p && !onlyLetters(p)) newErrors[`personnesObservees_${i}`] = "Seules les lettres et espaces sont autorisés."; });

    if (!header.entrepriseObservee[0]) newErrors.entrepriseObservee = "Au moins une entreprise observée est requise.";
    header.entrepriseObservee.forEach((e, i) => { if (e && !onlyLetters(e)) newErrors[`entrepriseObservee_${i}`] = "Seules les lettres et espaces sont autorisés."; });

    pratiques.forEach((p, i) => { if (p.text && !p.photo) newErrors[`pratique_${i}`] = "L\'image est requise pour la bonne pratique."; });
    comportements.forEach((c, i) => { if ((c.type || c.description) && !c.photo) newErrors[`comportement_${i}`] = "L\'image est requise pour le comportement."; });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTopAlert(null);

    if (!canSubmit) {
      setTopAlert("Quota mensuel atteint. Impossible de soumettre un nouveau VOD.");
      await Swal.fire({ icon: 'warning', title: 'Quota atteint', text: "Le formulaire est bloqué jusqu\'au mois prochain." });
      return;
    }
    if (!validateForm()) {
      setTopAlert("Veuillez remplir tous les champs obligatoires.");
      await Swal.fire({ icon: 'error', title: 'Champs manquants', text: 'Merci de corriger les erreurs surlignées.' });
      return;
    }

    // ✅ Confirm before sending
    const { isConfirmed } = await Swal.fire({
      icon: 'question',
      title: 'Confirmer l\'envoi',
      text: 'Soumettre ce VOD maintenant ?',
      showCancelButton: true,
      confirmButtonText: 'Oui, soumettre',
      cancelButtonText: 'Annuler',
    });
    if (!isConfirmed) return;

    const formData = new FormData();

    Object.entries(header).forEach(([key, val]) => {
      if (Array.isArray(val)) val.forEach((v, i) => formData.append(`${key}[${i}]`, v));
      else formData.append(key, val);
    });

    pratiques.forEach((p, i) => {
      formData.append(`pratiques[${i}][text]`, p.text || '');
      if (p.photo) formData.append(`pratiques[${i}][photo]`, p.photo);
    });

    comportements.forEach((c, i) => {
      formData.append(`comportements[${i}][type]`, c.type || '');
      formData.append(`comportements[${i}][description]`, c.description || '');
      if (c.photo) formData.append(`comportements[${i}][photo]`, c.photo);
    });

    Object.entries(conditions).forEach(([key, val]) => {
      formData.append(`conditions[${key}]`, val ? '1' : '0');
    });

    Object.entries(correctives).forEach(([key, val]) => {
      Object.entries(val || {}).forEach(([f, v]) => {
        if (v instanceof File) formData.append(`correctives[${key}][${f}]`, v);
        else formData.append(`correctives[${key}][${f}]`, v ?? '');
      });
    });

    router.post('/vods/store', formData, {
      forceFormData: true,
      headers: { 'Content-Type': 'multipart/form-data' },
      preserveScroll: false,

      onFinish: () => {
        if (Swal.isVisible()) Swal.close();
      },

      onSuccess: async () => {
        setHeader({
          date: todayIso,
          projet: '',
          activite: '',
          observateur: auth?.user?.name || '',
          personnesObservees: [''],
          entrepriseObservee: [''],
        });
        setPratiques([{ text: '', photo: null }]);
        setComportements([{ type: '', description: '', photo: null }]);
        setConditions({});
        setCorrectives({});
        setAutresConditions([]);
        setErrors({});
        setTopAlert(null);
        setFormVersion(v => v + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        await Swal.fire({
          icon: 'success',
          title: 'VOD envoyé',
          text: 'Votre VOD a été enregistré avec succès.',
          timer: 1600,
          showConfirmButton: false,
        });
      },

      onError: async (serverErrors) => {
        setTopAlert("Des erreurs de validation sont survenues. Merci de corriger les champs en rouge.");
        setErrors((prev) => ({ ...prev, ...serverErrors }));

        if (!serverErrors || (typeof serverErrors === 'object' && Object.keys(serverErrors).length === 0)) {
          await Swal.fire({
            icon: 'error',
            title: 'Erreur serveur',
            text: 'La requête a échoué (session expirée ou erreur serveur). Vérifiez l\'onglet Réseau.',
          });
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Erreurs de validation',
            text: 'Vérifiez les champs indiqués en rouge.',
          });
        }
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10"
    >
      <form
        key={formVersion}
        onSubmit={handleSubmit}
        noValidate
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 max-w-6xl mx-auto p-8 space-y-8"
      >
        {/* Alerts */}
        {topAlert && (
          <motion.div
            ref={alertRef}
            role="alert"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 text-red-800 shadow-lg"
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-3" />
              <span className="font-semibold">{topAlert}</span>
            </div>
          </motion.div>
        )}
        {flash.success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            role="status"
            className="p-4 rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 shadow-lg"
          >
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-3" />
              <span className="font-semibold">{flash.success}</span>
            </div>
          </motion.div>
        )}

        {/* Quota banners */}
        {typeof remaining === 'number' && remaining > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 shadow-lg"
          >
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-3" />
              <span className="font-semibold">
                Il vous reste <strong>{remaining}</strong> VOD(s) à soumettre ce mois-ci
                {typeof daysLeft === 'number' && <> — Jours restants : <strong>{daysLeft}</strong></>}.
              </span>
            </div>
          </motion.div>
        )}
        {canSubmit === false && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 text-red-800 shadow-lg"
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-3" />
              <span className="font-semibold">Quota mensuel atteint — le formulaire est bloqué jusqu\'au mois prochain.</span>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6 border-b border-slate-200 pb-8"
        >
          {/* Left: logo */}
          <div className="flex justify-center sm:justify-start">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Center: title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center">
            Visite Observation et Ronde HSE
          </h1>

          {/* Right: date */}
          <div className="text-sm text-slate-600 text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <Calendar className="w-4 h-4" />
              <span><strong>Date d'émission:</strong> {todayHuman}</span>
            </div>
          </div>
        </motion.div>

        {/* Everything inside this fieldset will disable when quota reached */}
        <fieldset disabled={!canSubmit} className={!canSubmit ? 'opacity-60 pointer-events-none select-none' : ''}>
          {/* Champs d'entête */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Field
              label="Date"
              error={errors.date}
              input={
                <div className="relative">
                  <input
                    type="date"
                    value={header.date}
                    onChange={(e) => setHeader({ ...header, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300"
                    required
                    aria-invalid={!!errors.date}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
              }
            />

            <Field
              label="Projet"
              error={errors.projet}
              input={
                <input
                  type="text"
                  placeholder="Projet"
                  value={header.projet}
                  onChange={(e) => setHeader({ ...header, projet: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300"
                  {...lettersOnlyProps}
                  required
                  aria-invalid={!!errors.projet}
                />
              }
            />

            <Field
              label="Activité"
              error={errors.activite}
              input={
                <input
                  type="text"
                  placeholder="Activité"
                  value={header.activite}
                  onChange={(e) => setHeader({ ...header, activite: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300"
                  {...lettersOnlyProps}
                  required
                  aria-invalid={!!errors.activite}
                />
              }
            />

            <Field
              className="md:col-span-3"
              label="Observateur"
              input={
                <div className="relative">
                  <input
                    type="text"
                    value={header.observateur}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
              }
            />

            {/* Personnes observées */}
            <div className="md:col-span-3 space-y-4">
              <Label>Personnes observées</Label>
              <div className="space-y-3">
                {header.personnesObservees.map((person, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder={`Personne observée ${index + 1}`}
                        value={person}
                        onChange={(e) => {
                          const updated = [...header.personnesObservees];
                          updated[index] = e.target.value;
                          setHeader({ ...header, personnesObservees: updated });
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300"
                        {...lettersOnlyProps}
                        required={index === 0}
                      />
                      <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                    {index > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => {
                          const copy = [...header.personnesObservees];
                          copy.splice(index, 1);
                          setHeader({ ...header, personnesObservees: copy });
                        }}
                        className="px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
                {errors.personnesObservees && <p className="text-red-500 text-sm">{errors.personnesObservees}</p>}
                {header.personnesObservees.map((_, i) =>
                  errors[`personnesObservees_${i}`] ? (
                    <p key={i} className="text-red-500 text-sm">{errors[`personnesObservees_${i}`]}</p>
                  ) : null
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setHeader({ ...header, personnesObservees: [...header.personnesObservees, ''] })}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-emerald-600 hover:text-emerald-700 font-semibold transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter personne</span>
                </motion.button>
              </div>
            </div>

            {/* Entreprises observées */}
            <div className="md:col-span-3 space-y-4">
              <Label>Entreprises observées</Label>
              <div className="space-y-3">
                {header.entrepriseObservee.map((entreprise, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder={`Entreprise observée ${index + 1}`}
                        value={entreprise}
                        onChange={(e) => {
                          const updated = [...header.entrepriseObservee];
                          updated[index] = e.target.value;
                          setHeader({ ...header, entrepriseObservee: updated });
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300"
                        {...lettersOnlyProps}
                        required={index === 0}
                      />
                      <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                    {index > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => {
                          const copy = [...header.entrepriseObservee];
                          copy.splice(index, 1);
                          setHeader({ ...header, entrepriseObservee: copy });
                        }}
                        className="px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
                {errors.entrepriseObservee && <p className="text-red-500 text-sm">{errors.entrepriseObservee}</p>}
                {header.entrepriseObservee.map((_, i) =>
                  errors[`entrepriseObservee_${i}`] ? (
                    <p key={i} className="text-red-500 text-sm">{errors[`entrepriseObservee_${i}`]}</p>
                  ) : null
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setHeader({ ...header, entrepriseObservee: [...header.entrepriseObservee, ''] })}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-emerald-600 hover:text-emerald-700 font-semibold transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter entreprise</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Bonnes pratiques */}
          <SectionCard title="Bonnes pratiques" defaultOpen={!isMobile}>
            {pratiques.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="space-y-4 mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.text}
                      onChange={(e) => {
                        const updated = [...pratiques];
                        updated[i].text = e.target.value;
                        setPratiques(updated);
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <ImageInput
                      file={item.photo}
                      onChange={(file) => handleFileUpload(pratiques, setPratiques, i, file)}
                      ariaLabel={`Photo bonne pratique ${i + 1}`}
                    />
                    {i > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => {
                          const copy = [...pratiques];
                          copy.splice(i, 1);
                          setPratiques(copy);
                        }}
                        className="px-3 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
                {errors[`pratique_${i}`] && <p className="text-red-500 text-sm">{errors[`pratique_${i}`]}</p>}
              </motion.div>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setPratiques([...pratiques, { text: '', photo: null }])}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-emerald-600 hover:text-emerald-700 font-semibold transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter</span>
            </motion.button>
          </SectionCard>

          {/* Comportements dangereux */}
          <SectionCard title="Comportements dangereux" defaultOpen={!isMobile}>
            {comportements.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 space-y-4"
              >
                <select
                  value={item.type}
                  onChange={(e) => {
                    const updated = [...comportements];
                    updated[i].type = e.target.value;
                    setComportements(updated);
                  }}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                >
                  <option value="">-- Choisir un type de risque --</option>
                  {comportementOptions.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...comportements];
                    updated[i].description = e.target.value;
                    setComportements(updated);
                  }}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                />
                <div className="flex items-center gap-3">
                  <ImageInput
                    file={item.photo}
                    onChange={(file) => handleFileUpload(comportements, setComportements, i, file)}
                    ariaLabel={`Photo comportement ${i + 1}`}
                  />
                  {i > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        const copy = [...comportements];
                        copy.splice(i, 1);
                        setComportements(copy);
                      }}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
                {errors[`comportement_${i}`] && <p className="text-red-500 text-sm">{errors[`comportement_${i}`]}</p>}
              </motion.div>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setComportements([...comportements, { type: '', description: '', photo: null }])}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-red-600 hover:text-red-700 font-semibold transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter</span>
            </motion.button>
          </SectionCard>

          {/* Conditions dangereuses */}
          <SectionCard title="Conditions dangereuses" defaultOpen={!isMobile}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dangerousConditionsList.map((cond) => (
                <motion.label
                  key={cond}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    checked={!!conditions[cond]}
                    onChange={() => handleConditionToggle(cond)}
                  />
                  <span className="text-sm font-medium text-slate-700">{cond}</span>
                </motion.label>
              ))}
            </div>

            {autresConditions.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"
              >
                <input
                  type="text"
                  placeholder="Autre condition"
                  value={val}
                  onChange={(e) => {
                    const copy = [...autresConditions];
                    copy[idx] = e.target.value;
                    setAutresConditions(copy);
                  }}
                  onBlur={(e) => {
                    const name = e.target.value.trim();
                    if (name && !conditions[name]) setConditions((prev) => ({ ...prev, [name]: true }));
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    const copy = [...autresConditions];
                    copy.splice(idx, 1);
                    setAutresConditions(copy);
                  }}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setAutresConditions([...autresConditions, ''])}
              className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une autre</span>
            </motion.button>
          </SectionCard>

          {/* Actions correctives */}
          <SectionCard title="Actions correctives" defaultOpen={!isMobile}>
            {Object.entries(conditions).filter(([, val]) => val).length === 0 ? (
              <p className="text-sm text-slate-500 p-4 rounded-xl bg-slate-50">Sélectionnez des conditions dangereuses pour saisir des actions.</p>
            ) : null}
            {Object.entries(conditions).filter(([, val]) => val).map(([key]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl mb-6 shadow-lg space-y-4"
              >
                <h4 className="text-lg font-bold text-slate-800">{key}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Action"
                    onChange={(e) => handleCorrectiveChange(key, 'action', e.target.value)}
                    className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300"
                  />
                  <input
                    type="text"
                    placeholder="Responsable"
                    onChange={(e) => handleCorrectiveChange(key, 'responsable', e.target.value)}
                    className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300"
                  />
                  <input
                    type="text"
                    placeholder="Statut"
                    onChange={(e) => handleCorrectiveChange(key, 'statut', e.target.value)}
                    className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300"
                  />
                </div>
                <ImageInput
                  file={correctives[key]?.photo || null}
                  onChange={(file) => handleCorrectiveChange(key, 'photo', file)}
                  ariaLabel={`Photo corrective ${key}`}
                />
              </motion.div>
            ))}
          </SectionCard>
        </fieldset>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="pt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!canSubmit}
            className={`w-full md:w-auto px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 shadow-lg ${
              !canSubmit
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-xl'
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              <Save className="w-5 h-5" />
              <span>Soumettre le formulaire</span>
              <Sparkles className="w-5 h-5" />
            </div>
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}

/* ---------- UI helpers ---------- */

function Label({ children }) {
  return <label className="text-sm text-slate-700 font-bold">{children}</label>;
}

function Field({ label, input, error, className = '' }) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="mt-2">{input}</div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

// Collapsible card used for big sections on mobile
function SectionCard({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => { setOpen(defaultOpen); }, [defaultOpen]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border-2 border-slate-200 rounded-3xl shadow-lg overflow-hidden"
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 transition-all duration-300"
        aria-expanded={open}
      >
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-slate-500 text-xl"
        >
          ▾
        </motion.span>
      </motion.button>
      {open && <div className="p-6 bg-white">{children}</div>}
    </motion.section>
  );
}

// Image input with thumbnail + filename, mobile friendly
function ImageInput({ file, onChange, ariaLabel }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const inputId = React.useId();

  return (
    <div className="flex items-center gap-3">
      {preview ? (
        <div className="relative">
          <img src={preview} alt="" className="w-16 h-16 rounded-xl object-cover border-2 border-slate-200 shadow-md" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        </div>
      ) : (
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-gray-100 border-2 border-slate-200 flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-slate-400" />
        </div>
      )}
      <label
        htmlFor={inputId}
        className="px-4 py-2 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 cursor-pointer font-semibold text-slate-700 hover:border-emerald-300 transition-all duration-300"
      >
        {file ? 'Changer la photo' : 'Ajouter une photo'}
      </label>
      {file && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => onChange(null)}
          className="px-3 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      )}
      <input
        id={inputId}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="sr-only"
        aria-label={ariaLabel}
      />
    </div>
  );
}