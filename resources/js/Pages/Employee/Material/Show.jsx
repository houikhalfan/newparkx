import React from "react";
import { useForm, usePage, Link, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  Truck,
  ArrowRight,
  UserCircle,
  CheckCircle,
  XCircle,
  FileText,
  ClipboardCheck,
  Shield,
  FileSignature,
} from "lucide-react";
import Swal from "sweetalert2";

export default function EmployeeMatShow() {
  const { req, csrf_token, auth } = usePage().props;
  const { user } = auth || {};

  const acceptForm = useForm({ comment: "" });
  const rejectForm = useForm({ reason: "" });

  const accept = (e) => {
    e.preventDefault();
    acceptForm.post(route("employee.materiel.accept", req.id), {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Demande acceptée",
          timer: 1200,
          showConfirmButton: false,
        }).then(() => router.visit(route("employee.materiel.index")));
      },
    });
  };

  const reject = (e) => {
    e.preventDefault();
    rejectForm.post(route("employee.materiel.reject", req.id), {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Demande rejetée",
          timer: 1200,
          showConfirmButton: false,
        }).then(() => router.visit(route("employee.materiel.index")));
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
      </div>

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
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Matériel
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Détails de la demande
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href={route("employee.materiel.index")}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-white font-semibold shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                }}
              >
                <ArrowRight className="w-4 h-4" />
                <span>Retour</span>
              </Link>

              <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-slate-800">
                  <p className="text-sm font-medium">
                    {user?.name || "Utilisateur"}
                  </p>
                  <p className="text-xs text-slate-600">ParkX</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main */}
      <div className="relative z-10 py-10 px-6 max-w-5xl mx-auto">
        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-6 border border-white/20"
        >
          <p className="text-slate-600">
            <span className="font-semibold">Contractant:</span>{" "}
            {req.contractor?.name} ({req.contractor?.email}) •{" "}
            <span className="font-semibold">Site:</span> {req.site?.name} •{" "}
            <span className="font-semibold">Matricule / Numéro de série:</span>{" "}
            {req.matricule || "N/A"}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Créé le{" "}
            {new Date(req.created_at).toLocaleString("fr-FR", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        </motion.div>

        {/* Files */}
        <div className="grid md:grid-cols-2 gap-6">
          <FileRow
            icon={<FileText className="w-5 h-5 text-indigo-600" />}
            label="Visite technique"
            href={route("employee.materiel.download", [
              req.id,
              "controle_reglementaire",
            ])}
          />
          <FileRow
            icon={<Shield className="w-5 h-5 text-indigo-600" />}
            label="Assurance"
            href={route("employee.materiel.download", [req.id, "assurance"])}
          />
          <FileRow
            icon={<FileText className="w-5 h-5 text-indigo-600" />}
            label="Carte grise" // ✅ NEW
            href={route("employee.materiel.download", [req.id, "carte_grise"])}
          />
          <FileRow
            icon={<ClipboardCheck className="w-5 h-5 text-indigo-600" />}
            label="Habilitation du conducteur"
            href={route("employee.materiel.download", [
              req.id,
              "habilitation_conducteur",
            ])}
          />
          <FileRow
            icon={<FileSignature className="w-5 h-5 text-indigo-600" />}
            label="Checklist"
            href={route("employee.materiel.download", [
              req.id,
              "rapports_conformite",
            ])}
          />
        </div>

        {/* Accept / Reject */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={accept}
            className="rounded-2xl border p-6 bg-white/90 backdrop-blur shadow-xl"
          >
            <h3 className="font-semibold text-lg flex items-center space-x-2 text-emerald-700">
              <CheckCircle className="w-5 h-5" />
              <span>Valider</span>
            </h3>
            <textarea
              className="mt-3 w-full rounded-xl border px-3 py-2 text-sm"
              rows={4}
              value={acceptForm.data.comment}
              onChange={(e) => acceptForm.setData("comment", e.target.value)}
              placeholder="Commentaire (optionnel)…"
            />
            <button className="mt-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 text-sm font-semibold shadow-lg hover:scale-105 transition">
              Accepter
            </button>
          </motion.form>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={reject}
            className="rounded-2xl border p-6 bg-white/90 backdrop-blur shadow-xl"
          >
            <h3 className="font-semibold text-lg flex items-center space-x-2 text-rose-700">
              <XCircle className="w-5 h-5" />
              <span>Refuser</span>
            </h3>
            <textarea
              className="mt-3 w-full rounded-xl border px-3 py-2 text-sm"
              rows={5}
              required
              value={rejectForm.data.reason}
              onChange={(e) => rejectForm.setData("reason", e.target.value)}
              placeholder="Raison du refus…"
            />
            <button className="mt-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold shadow-lg hover:scale-105 transition">
              Refuser
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

const FileRow = ({ label, href, icon }) => (
  <motion.a
    whileHover={{ scale: 1.02 }}
    href={href}
    className="rounded-2xl border p-5 bg-white/80 backdrop-blur hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 flex items-center justify-between shadow-md"
  >
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-sm font-medium text-slate-800">{label}</span>
    </div>
    <span className="text-xs font-semibold text-indigo-600">Télécharger</span>
  </motion.a>
);
