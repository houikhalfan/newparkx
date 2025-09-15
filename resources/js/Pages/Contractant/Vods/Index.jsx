import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Head, router } from '@inertiajs/react';
import { History, PlusCircle, Clock } from 'lucide-react';
import ContractantSidebar from '@/Components/ContractantSidebar';
import ContractantTopHeader from '@/Components/ContractantTopHeader';
import VodsForm from "./Form";
import VodsHistory from "./History";

export default function ContractantVodsIndex({ contractor }) {
  const [active, setActive] = useState("form");
  const [loading, setLoading] = useState(false);
  const [historyVods, setHistoryVods] = useState(null);

  // Load history data only when needed
  useEffect(() => {
    if (active !== "history" || historyVods !== null) return;
    setLoading(true);
    fetch("/contractant/vods/history/data", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((d) => setHistoryVods(d?.vods || []))
      .finally(() => setLoading(false));
  }, [active, historyVods]);

  return (
    <>
      <Head title="VODs" />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-emerald-900 relative overflow-hidden flex">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(6,182,212,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Sidebar */}
        <ContractantSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <ContractantTopHeader 
            contractor={contractor}
            showBackButton={true}
            backRoute={route('contractant.home')}
            backLabel="Retour au tableau de bord"
          />

          {/* Main Content */}
          <div className="relative z-10 px-6 pb-12 flex-1">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">VODS</span>
                </h1>
                <p className="text-gray-300 text-lg">Gérez vos déclarations de VODS</p>
              </motion.div>

              {/* Navigation Tabs */}
           <motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.4 }}
  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-1 shadow-lg mb-8 max-w-md mx-auto"
>
  <nav className="flex gap-2">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setActive("form")}
      className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
        active === "form"
          ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-md"
          : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <PlusCircle className="w-4 h-4 mr-2" />
      Remplir
    </motion.button>

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setActive("history")}
      className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
        active === "history"
          ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-md"
          : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <History className="w-4 h-4 mr-2" />
      Historique
    </motion.button>
  </nav>
</motion.div>


              {/* Content Area */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                }}
              >
                <AnimatePresence mode="wait">
                  {active === "form" && (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <VodsForm />
                    </motion.div>
                  )}

                  {active === "history" && (
                    <motion.div
                      key="history"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {loading && historyVods === null ? (
                        <div className="text-center py-12">
                          <div className="p-4 bg-white/5 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <Clock className="w-10 h-10 text-cyan-400 animate-pulse" />
                          </div>
                          <h3 className="text-lg font-medium text-white mb-2">Chargement en cours</h3>
                          <p className="text-gray-400">Veuillez patienter...</p>
                        </div>
                      ) : (
                        <VodsHistory vods={historyVods || []} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}