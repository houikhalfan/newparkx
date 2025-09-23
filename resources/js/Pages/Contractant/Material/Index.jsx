// resources/js/Pages/Contractant/Material/Index.jsx
import React, { useMemo, useState, useEffect } from "react";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  QrCode,
  FileText,
} from "lucide-react";
import ContractantSidebar from "@/Components/ContractantSidebar";
import ContractantTopHeader from "@/Components/ContractantTopHeader";

export default function MaterialIndex({ contractor }) {
  const {
    pending = [],
    accepted = [],
    rejected = [],
    sites = [],
    csrf_token,
    swal,
  } = usePage().props || {};

  useEffect(() => {
    if (!swal) return;
    if (window?.Swal?.fire) {
      window.Swal.fire({
        icon: swal.type || "info",
        title:
          swal.type === "success"
            ? "Succès"
            : swal.type === "error"
            ? "Erreur"
            : "Info",
        text: swal.text || "",
        confirmButtonText: "OK",
      });
    } else {
      alert(swal.text || "Opération effectuée");
    }
  }, [swal]);

  const [showUpload, setShowUpload] = useState(false);
  const [active, setActive] = useState("pending");
  const [q, setQ] = useState("");

  // Gérer le défilement du body quand la modale est ouverte
  useEffect(() => {
    if (showUpload) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showUpload]);

  const countsSafe = {
    pending: Array.isArray(pending) ? pending.length : 0,
    accepted: Array.isArray(accepted) ? accepted.length : 0,
    rejected: Array.isArray(rejected) ? rejected.length : 0,
  };

  const source =
    active === "pending" ? pending : active === "accepted" ? accepted : rejected;

  const filtered = useMemo(() => {
    if (!q.trim()) return source;
    const k = q.toLowerCase();
    return source.filter((r) =>
      (r.site?.name || "").toLowerCase().includes(k)
    );
  }, [source, q]);

  return (
    <>
      <Head title="Ressources matériel" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden flex">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59,130,246,0.2) 1px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Sidebar */}
        <ContractantSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <ContractantTopHeader
            contractor={contractor}
            showBackButton={true}
            backRoute={route("contractant.home")}
            backLabel="Retour au tableau de bord"
          />

          {/* Content */}
          <div className="relative z-10 px-6 pb-12 flex-1 pt-8">
            <div className="max-w-7xl mx-auto">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center mb-16"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Ressources matériel
                  </span>
                </h1>
                <p className="text-gray-600 text-lg">
                  Gérez vos demandes et ressources
                </p>
              </motion.div>

              {/* Tabs + Search */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-12 max-w-5xl mx-auto"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <Segmented
                      active={active}
                      onChange={setActive}
                      counts={countsSafe}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Rechercher (site)…"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowUpload(true)}
                      className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="hidden sm:inline">Nouvelle demande</span>
                      <span className="sm:hidden">Nouvelle</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <SummaryCard
                  icon={<Clock className="w-4 h-4" />}
                  label="En attente"
                  value={countsSafe.pending}
                />
                <SummaryCard
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  label="Acceptées"
                  value={countsSafe.accepted}
                />
                <SummaryCard
                  icon={<XCircle className="w-4 h-4" />}
                  label="Refusées"
                  value={countsSafe.rejected}
                />
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-6 shadow-2xl"
              >
                {filtered.length === 0 ? (
                  <EmptyState
                    title={
                      active === "pending"
                        ? "Aucune demande en attente"
                        : active === "accepted"
                        ? "Aucune demande acceptée"
                        : "Aucune demande refusée"
                    }
                    hint={
                      q
                        ? `Aucun résultat pour « ${q} »`
                        : "Les éléments apparaîtront ici."
                    }
                  />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((r) => (
                      <Card key={r.id} row={r} kind={active} />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal avec AnimatePresence */}
      <AnimatePresence>
        {showUpload && (
          <UploadModal
            csrf_token={csrf_token}
            sites={sites}
            onClose={() => setShowUpload(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ----------------------------- Subcomponents ----------------------------- */

function Segmented({ active, onChange, counts }) {
  const base =
    "text-sm inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 focus:outline-none";
  
  // Tous les onglets ont le même fond de base (le dégradé bleu/violet)
  const baseBackground = "bg-gradient-to-r from-blue-500 to-purple-500";
  
  // Styles pour l'onglet actif
  const activeCls = "text-white shadow-lg ring-2 ring-white/50 ring-offset-2 ring-offset-blue-200 scale-105";
  
  // Styles pour les onglets inactifs
  const inactiveCls = "text-white/80 bg-gradient-to-r from-blue-500/60 to-purple-500/60 hover:from-blue-500/80 hover:to-purple-500/80 hover:text-white";

  return (
    <div className="inline-flex gap-2 p-1 bg-blue-100/50 rounded-xl backdrop-blur-sm">
      <button
        className={`${base} ${baseBackground} ${active === "pending" ? activeCls : inactiveCls}`}
        onClick={() => onChange("pending")}
        type="button"
      >
        <Clock className="w-4 h-4" />
        <span className="font-medium">En attente</span>
        <Badge tone={active === "pending" ? "emerald" : "cyan"}>
          {counts.pending}
        </Badge>
      </button>
      <button
        className={`${base} ${baseBackground} ${active === "accepted" ? activeCls : inactiveCls}`}
        onClick={() => onChange("accepted")}
        type="button"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span className="font-medium">Acceptées</span>
        <Badge tone={active === "accepted" ? "emerald" : "cyan"}>
          {counts.accepted}
        </Badge>
      </button>
      <button
        className={`${base} ${baseBackground} ${active === "rejected" ? activeCls : inactiveCls}`}
        onClick={() => onChange("rejected")}
        type="button"
      >
        <XCircle className="w-4 h-4" />
        <span className="font-medium">Refusées</span>
        <Badge tone={active === "rejected" ? "emerald" : "cyan"}>
          {counts.rejected}
        </Badge>
      </button>
    </div>
  );
}

function Badge({ children, tone = "gray" }) {
  const map = {
    gray: "bg-gray-100 text-gray-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    white: "bg-white/20 text-white",
    cyan: "bg-cyan-100/90 text-cyan-800",
    emerald: "bg-emerald-100/90 text-emerald-800",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-xs font-medium ${
        map[tone] || map.gray
      }`}
    >
      {children}
    </span>
  );
}

function SummaryCard({ icon, label, value }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-blue-200/50 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700">
          <span className="p-1.5 rounded-md bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg">
            {icon}
          </span>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="text-lg font-bold text-gray-800">{value}</div>
      </div>
    </div>
  );
}

function EmptyState({ title, hint }) {
  return (
    <div className="px-6 py-12 text-center bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl">
      <div className="text-base font-semibold text-gray-800">{title}</div>
      <div className="text-sm text-gray-600 mt-1">{hint}</div>
    </div>
  );
}

function StatusBadge({ kind }) {
  const map = {
    pending: {
      text: "En attente",
      cls: "bg-blue-100 text-blue-700 border border-blue-200",
    },
    accepted: {
      text: "Acceptée",
      cls: "bg-green-100 text-green-700 border border-green-200",
    },
    rejected: {
      text: "Refusée",
      cls: "bg-red-100 text-red-700 border border-red-200",
    },
  };
  const { text, cls } = map[kind] || map.pending;
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${cls}`}>
      {text}
    </span>
  );
}

function Card({ row, kind }) {
  const pngUrl =
    row.qr_png_url || (row.qrcode_path ? `/storage/${row.qrcode_path}` : null);
  const qrText =
    row.qrcode_text || "Cet engin est conforme par l'administration.";

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-blue-200/50 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-base font-semibold text-gray-800 truncate">
            {row.site?.name ? `Site : ${row.site.name}` : `Demande #${row.id}`}
          </div>
          <div className="text-xs text-gray-600 mt-0.5">
            Créé le {formatDate(row.created_at)}
          </div>

          {row.decision_comment && (
            <p className="mt-2 text-xs text-gray-700">
              <span className="font-medium">
                Commentaire du responsable
                {kind === "rejected" ? " (refus)" : ""}
                {kind === "accepted" ? " (validation)" : ""} :
              </span>{" "}
              {row.decision_comment}
            </p>
          )}
        </div>
        <StatusBadge kind={kind} />
      </div>

      {kind === "accepted" && pngUrl && (
        <div className="mt-4 border-t border-gray-200 pt-3">
          <div className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-800">
            <QrCode className="w-4 h-4" /> QR "Conforme"
          </div>

          <img alt="QR conforme" className="h-48 w-48" src={pngUrl} />

          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                printQR(pngUrl, row.site?.name || `Demande #${row.id}`, qrText)
              }
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm hover:opacity-90 shadow-lg"
              title="Imprimer uniquement le QR"
            >
              <FileText className="w-4 h-4" />
              Imprimer le QR
            </button>
          </div>

          {qrText && (
            <div className="text-xs text-gray-600 mt-2 whitespace-pre-line">
              {qrText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Upload Modal ----------------------------- */

function UploadModal({ csrf_token, sites = [], onClose }) {
  const { post, processing, errors, setData, data, reset } = useForm({
    site_id: "",
    matricule: "",
    controle_reglementaire: null,
    assurance: null,
    carte_grise: null,
    habilitation_conducteur: null,
    rapports_conformite: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route("contractant.materiel.store"), {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        reset();
        if (window?.Swal?.fire) {
          window.Swal.fire({
            icon: "success",
            title: "Envoyé",
            text: "Votre demande a été transmise.",
          }).then(() => {
            window.Inertia?.reload?.({
              only: ["pending", "accepted", "rejected", "counts"],
            });
            onClose();
          });
        } else {
          window.Inertia?.reload?.({
            only: ["pending", "accepted", "rejected", "counts"],
          });
          onClose();
        }
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Overlay avec fond flou */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Contenu de la modale */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative z-60 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-blue-200/50 rounded-3xl shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
        }}
      >
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm px-6 py-5 border-b border-blue-200/50 flex items-center justify-between">
          <div className="font-bold text-lg text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nouvelle demande — Ressources matériel
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-gray-800 transition-all duration-300"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 grid gap-6 md:grid-cols-2 text-gray-800"
        >
          <input type="hidden" name="_token" value={csrf_token} />

          {/* Site */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Site *</label>
            <select
              required
              value={data.site_id}
              onChange={(e) => setData("site_id", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 px-4 py-3 text-sm transition-all duration-300"
              style={{ colorScheme: 'light' }}
            >
              <option value="" disabled className="bg-white text-gray-500">
                Choisir un site…
              </option>
              {sites.map((s) => (
                <option
                  key={s.id}
                  value={s.id}
                  className="bg-white text-gray-800"
                >
                  {s.name}
                </option>
              ))}
            </select>
            {errors.site_id && (
              <div className="text-red-600 text-sm mt-2 flex items-center gap-2">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.site_id}
              </div>
            )}
          </div>

          {/* Matricule */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Matricule / Numéro de série *
            </label>
            <input
              type="text"
              required
              value={data.matricule}
              onChange={(e) => setData("matricule", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 px-4 py-3 text-sm transition-all duration-300"
              placeholder="Entrez le matricule"
            />
            {errors.matricule && (
              <div className="text-red-600 text-sm mt-2 flex items-center gap-2">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.matricule}
              </div>
            )}
          </div>

          {/* Files */}
          <FileField
            label="Visite technique *"
            onChange={(f) => setData("controle_reglementaire", f)}
            error={errors.controle_reglementaire}
          />
          <FileField
            label="Assurance *"
            onChange={(f) => setData("assurance", f)}
            error={errors.assurance}
          />
          <FileField
            label="Carte grise *"
            onChange={(f) => setData("carte_grise", f)}
            error={errors.carte_grise}
          />
          <FileField
            label="Habilitation du conducteur *"
            onChange={(f) => setData("habilitation_conducteur", f)}
            error={errors.habilitation_conducteur}
          />
          <FileField
            label="Checklist *"
            onChange={(f) => setData("rapports_conformite", f)}
            error={errors.rapports_conformite}
          />

          <div className="md:col-span-2 flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function FileField({ label, onChange, error }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type="file"
          required
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-gray-800 file:bg-blue-500/20 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 file:text-sm file:mr-3 file:hover:bg-blue-500/30 transition-all duration-300"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        />
        <p className="text-xs text-gray-500 mt-2">
          PDF, JPG/PNG, DOC/DOCX (max 10 Mo)
        </p>
      </div>
      {error && (
        <div className="text-red-600 text-sm mt-2 flex items-center gap-2">
          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
          {error}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- helpers ----------------------------- */

function printQR(url, title, text) {
  const imgUrl = new URL(url, window.location.origin).href;
  const esc = (s) =>
    String(s || "")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  const safeTitle = esc(title || "QR de conformité");
  const safeText = esc(text || "").replace(/\n/g, "<br>");

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${safeTitle}</title>
<style>
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 16px; }
  .wrap { text-align: center; }
  img { width: 320px; height: 320px; image-rendering: pixelated; }
  h1 { font-size: 16px; margin: 8px 0 12px; }
  .hint { font-size: 12px; color: #444; margin-top: 8px; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
  <div class="wrap">
    <h1>${safeTitle}</h1>
    <img id="qr" src="${imgUrl}" alt="QR conforme">
    ${safeText ? `<div class="hint">${safeText}</div>` : ``}
  </div>
  <script>
    const go = () => setTimeout(() => { window.print(); window.close(); }, 200);
    const img = document.getElementById('qr');
    if (img.complete) { go(); } else { img.addEventListener('load', go); }
  </script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, "_blank");
  setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
}

function formatDate(d) {
  const date = new Date(d);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}