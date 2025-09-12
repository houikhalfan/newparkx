// resources/js/Pages/Contractant/ContractorHome.jsx

import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  FileText,
  BarChart3,
  FileSignature,
  FolderOpen,
  ClipboardList,
  X,
} from "lucide-react";
import ContractorUserDropdown from "@/Components/ContractorUserDropdown";

const ServiceCard = ({ Icon, title, desc, href, color, isSignature, onClick }) => {
  const content = (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
      className="group relative bg-white/90 backdrop-blur-xl border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-2xl transition-all"
    >
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon size={28} className="text-white" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{desc}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-600">
        Ouvrir
        <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80">
          <path fill="currentColor" d="M13 5l7 7-7 7v-4H4v-6h9V5z" />
        </svg>
      </span>
    </motion.div>
  );

  return isSignature ? (
    <button onClick={onClick} className="w-full">{content}</button>
  ) : (
    <Link href={href} className="w-full">{content}</Link>
  );
};

export default function ContractorHome() {
  const { auth } = usePage().props;
  const name = auth?.contractor?.name ?? auth?.user?.name ?? "Bienvenue";
  const contractor = auth?.contractor;

  const [showSignatureOptions, setShowSignatureOptions] = useState(false);

  const cards = [
    {
      title: "VODs",
      desc: "Créer et suivre vos Visites Observation & Ronde.",
      href: "/contractant/vods",
      Icon: FolderOpen,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Documents",
      desc: "Consulter et télécharger les documents partagés.",
      href: "/contractant/documents",
      Icon: FileText,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Statistiques HSE",
      desc: "Soumettre et suivre vos statistiques de santé, sécurité et environnement.",
      href: route("contractant.hse-statistics.index"),
      Icon: BarChart3,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Paraphe & Signature",
      desc: "Déposez vos pièces pour signature par l’administration.",
      Icon: FileSignature,
      color: "from-purple-500 to-pink-500",
      isSignature: true,
    },
    {
      title: "Ressources Matérielles",
      desc: "Gérer et suivre l’état de vos engins et équipements.",
      href: route("contractant.materiel.index"),
      Icon: Package,
      color: "from-indigo-500 to-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-30">
        <img src="/images/logo.png" alt="ParkX Logo" className="h-8 w-auto" />
        <ContractorUserDropdown contractor={contractor} />
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white overflow-hidden">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-blue-500/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 blur-[150px] rounded-full" />

        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {name}, accédez à vos services ParkX
          </h1>
          <p className="mt-5 text-white/80 max-w-2xl mx-auto text-lg">
            Outils, transparence, collaboration — tout ce qu'il faut pour avancer rapidement.
          </p>
        </div>
      </section>

      {/* Cards Section */}
      <main className="max-w-6xl mx-auto px-6 -mt-12 pb-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
            >
              <ServiceCard
                Icon={card.Icon}
                title={card.title}
                desc={card.desc}
                href={card.href}
                color={card.color}
                isSignature={card.isSignature}
                onClick={() => setShowSignatureOptions(true)}
              />
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showSignatureOptions && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => setShowSignatureOptions(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                  <X size={22} />
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  Choisissez une option
                </h2>

                {/* Gestion des fichiers */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                    Gestion des Fichiers
                  </h3>
                  <Link
                    href={route("contractant.suivi-permis.index")}
                    className="flex flex-col items-center justify-center rounded-xl border bg-white hover:shadow-lg p-6 transition"
                    onClick={() => setShowSignatureOptions(false)}
                  >
                    <FileText className="w-10 h-10 text-blue-600 mb-3" />
                    <h3 className="text-md font-semibold text-gray-900 text-center">
                      Suivre la situation de vos fichiers
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      Envoyez vos documents pour signature.
                    </p>
                  </Link>
                </div>

                {/* Demandes de permis */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                    Demandes de Permis
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* ✅ Create excavation permit */}
                    <Link
                      href={route("contractant.permisexcavation.create")}
                      className="flex flex-col items-center justify-center rounded-xl border bg-white hover:shadow-lg p-6 transition"
                      onClick={() => setShowSignatureOptions(false)}
                    >
                      <ClipboardList className="w-10 h-10 text-green-600 mb-3" />
                      <h3 className="text-md font-semibold text-gray-900 text-center">
                        Nouveau Permis d'excavation
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        Déposez vos nouvelles demandes de permis.
                      </p>
                    </Link>

                    {/* Secure Work Permit (frontend only for now) */}
                    <Link
                      href="/contractant/permis-de-travail-securitaire"
                      className="flex flex-col items-center justify-center rounded-xl border bg-white hover:shadow-lg p-6 transition"
                      onClick={() => setShowSignatureOptions(false)}
                    >
                      <ClipboardList className="w-10 h-10 text-green-600 mb-3" />
                      <h3 className="text-md font-semibold text-gray-900 text-center">
                        Permis de Travail Sécuritaire
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        Déposez vos demandes de permis.
                      </p>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Help */}
        <section className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white border shadow p-6">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <p className="mt-2 text-sm text-gray-600">
              Vos alertes et messages importants s’affichent ici.
            </p>
          </div>
          <div className="rounded-2xl bg-white border shadow p-6">
            <h3 className="font-semibold text-lg">Contacts</h3>
            <p className="mt-2 text-sm text-gray-600">
              Administration ParkX —{" "}
              <a href="mailto:admin@parkx.test" className="text-blue-600">
                admin@parkx.test
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
