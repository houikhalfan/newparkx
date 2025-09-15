// resources/js/Pages/Contractant/Material/Index.jsx
import React, { useMemo, useState, useEffect } from "react";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { motion } from "framer-motion";
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

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-emerald-900 relative overflow-hidden flex">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(6,182,212,0.3) 1px, transparent 0)`,
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
          <div className="relative z-10 px-6 pb-12 flex-1">
            <div className="max-w-7xl mx-auto">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    Ressources matériel
                  </span>
                </h1>
                <p className="text-gray-300 text-lg">
                  Gérez vos demandes et ressources
                </p>
              </motion.div>

              {/* Tabs + Search */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-cyan-950/30 backdrop-blur-xl border border-cyan-600/30 rounded-2xl p-4 shadow-2xl mb-8 max-w-3xl mx-auto"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <Segmented
                    active={active}
                    onChange={setActive}
                    counts={countsSafe}
                  />
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Rechercher (site)…"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUpload(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Nouvelle demande
                  </motion.button>
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
                className="bg-cyan-950/30 backdrop-blur-xl border border-cyan-600/30 rounded-3xl p-6 shadow-2xl"
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

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          csrf_token={csrf_token}
          sites={sites}
          onClose={() => setShowUpload(false)}
        />
      )}
    </>
  );
}

/* ----------------------------- Subcomponents ----------------------------- */

function Segmented({ active, onChange, counts }) {
  const base =
    "text-sm inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 focus:outline-none";
  
  // Tous les onglets ont le même fond de base (le dégradé vert)
  const baseBackground = "bg-gradient-to-r from-cyan-500 to-emerald-500";
  
  // Styles pour l'onglet actif
  const activeCls = "text-white shadow-lg ring-2 ring-white/50 ring-offset-2 ring-offset-cyan-800 scale-105";
  
  // Styles pour les onglets inactifs
  const inactiveCls = "text-white/80 bg-gradient-to-r from-cyan-500/60 to-emerald-500/60 hover:from-cyan-500/80 hover:to-emerald-500/80 hover:text-white";

  return (
    <div className="inline-flex gap-2 p-1 bg-cyan-900/30 rounded-xl backdrop-blur-sm">
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
    <div className="bg-cyan-900/30 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyan-200">
          <span className="p-1.5 rounded-md bg-cyan-500/20 text-cyan-200">
            {icon}
          </span>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="text-lg font-bold text-white">{value}</div>
      </div>
    </div>
  );
}

function EmptyState({ title, hint }) {
  return (
    <div className="px-6 py-12 text-center bg-cyan-900/20 border border-cyan-500/20 rounded-xl">
      <div className="text-base font-semibold text-cyan-200">{title}</div>
      <div className="text-sm text-gray-300 mt-1">{hint}</div>
    </div>
  );
}

function StatusBadge({ kind }) {
  const map = {
    pending: {
      text: "En attente",
      cls: "bg-blue-500/20 text-blue-200 border border-blue-400/30",
    },
    accepted: {
      text: "Acceptée",
      cls: "bg-green-500/20 text-green-200 border border-green-400/30",
    },
    rejected: {
      text: "Refusée",
      cls: "bg-red-500/20 text-red-200 border border-red-400/30",
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
    row.qrcode_text || "Cet engin est conforme par l’administration.";

  return (
    <div className="bg-cyan-950/30 backdrop-blur-xl border border-cyan-600/30 rounded-2xl p-5 shadow-lg flex flex-col h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-base font-semibold text-white truncate">
            {row.site?.name ? `Site : ${row.site.name}` : `Demande #${row.id}`}
          </div>
          <div className="text-xs text-gray-300 mt-0.5">
            Créé le {formatDate(row.created_at)}
          </div>

          {row.decision_comment && (
            <p className="mt-2 text-xs text-gray-200">
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
        <div className="mt-4 border-t border-white/20 pt-3">
          <div className="text-sm font-medium mb-2 flex items-center gap-2 text-white">
            <QrCode className="w-4 h-4" /> QR “Conforme”
          </div>

          <img alt="QR conforme" className="h-48 w-48" src={pngUrl} />

          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                printQR(pngUrl, row.site?.name || `Demande #${row.id}`, qrText)
              }
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm hover:opacity-90"
              title="Imprimer uniquement le QR"
            >
              <FileText className="w-4 h-4" />
              Imprimer le QR
            </button>
          </div>

          {qrText && (
            <div className="text-xs text-gray-300 mt-2 whitespace-pre-line">
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
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-3xl bg-cyan-950/30 backdrop-blur-xl border border-cyan-600/30 rounded-2xl shadow-2xl">
        <div className="px-5 py-4 border-b border-cyan-600/30 flex items-center justify-between text-white">
          <div className="font-semibold">
            Nouvelle demande — Ressources matériel
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-cyan-900/40 text-gray-200"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 grid gap-4 md:grid-cols-2 text-white"
        >
          <input type="hidden" name="_token" value={csrf_token} />

          {/* Site */}
          <div>
            <label className="text-sm font-medium">Site *</label>
            <select
              required
              value={data.site_id}
              onChange={(e) => setData("site_id", e.target.value)}
              className="mt-1 w-full border border-cyan-600/30 
               bg-gray-900 text-white 
               rounded-lg px-3 py-2 
               focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="" disabled className="bg-gray-900 text-gray-300">
                Choisir un site…
              </option>
              {sites.map((s) => (
                <option
                  key={s.id}
                  value={s.id}
                  className="bg-gray-900 text-white hover:bg-cyan-600"
                >
                  {s.name}
                </option>
              ))}
            </select>
            {errors.site_id && (
              <div className="text-red-400 text-xs mt-1">{errors.site_id}</div>
            )}
          </div>

          {/* Matricule */}
          <div>
            <label className="text-sm font-medium">
              Matricule / Numéro de série *
            </label>
            <input
              type="text"
              required
              value={data.matricule}
              onChange={(e) => setData("matricule", e.target.value)}
              className="mt-1 w-full border border-cyan-600/30 bg-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Entrez le matricule"
            />
            {errors.matricule && (
              <div className="text-red-400 text-xs mt-1">{errors.matricule}</div>
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

          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg border border-cyan-600/30 text-gray-200 hover:bg-cyan-900/40"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white hover:opacity-90"
            >
              {processing ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FileField({ label, onChange, error }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type="file"
        required
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        className="mt-1 w-full text-sm text-white"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
      />
      <p className="text-xs text-gray-400 mt-1">
        PDF, JPG/PNG, DOC/DOCX (max 10 Mo)
      </p>
      {error && <div className="text-red-400 text-xs mt-1">{error}</div>}
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
