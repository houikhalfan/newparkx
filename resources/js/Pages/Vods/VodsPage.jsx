import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePage, Link } from '@inertiajs/react';
import { 
  Video, 
  History, 
  FileText, 
  Sparkles,
  Shield,
  ArrowLeft,
  BarChart3,
  LogOut,
  UserCircle
} from 'lucide-react';
import VodsForm from './VodsForm';
import VodsHistory from './VodsHistory';
import VodsNotifications from './VodsNotifications';

export default function VodsPage() {
const { auth, projects = [] } = usePage().props || {};
  const { user } = auth || {};
  const [activeTab, setActiveTab] = useState('form');

  const [historyVods, setHistoryVods] = useState(null);
  const [notif, setNotif] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load history data on first time we open that tab
  useEffect(() => {
    if (activeTab === 'history' && historyVods === null) {
      setLoading(true);
      fetch('/vods/history/data', { credentials: 'same-origin' })
        .then(r => r.json())
        .then(d => setHistoryVods(d.vods || []))
        .finally(() => setLoading(false));
    }
  }, [activeTab, historyVods]);

  // Load notifications data on first time we open that tab
  useEffect(() => {
    if (activeTab === 'notifications' && notif === null) {
      setLoading(true);
      fetch('/vods/notifications/data', { credentials: 'same-origin' })
        .then(r => r.json())
        .then(d => setNotif(d))
        .finally(() => setLoading(false));
    }
  }, [activeTab, notif]);

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
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    VODS
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">Visites d'Observation et Rondes HSE</p>
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
                  <Link
                    href="/dashboard"
                    className="group relative inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour au Tableau de Bord</span>
                  </Link>
                </motion.div>

              

                {/* User Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-slate-800">
                    <p className="text-sm font-medium">{user?.name || 'Utilisateur'}</p>
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
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              VODS
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Visites d'Observation et Rondes HSE
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-2 shadow-xl border border-white/20 max-w-md mx-auto">
              <nav className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('form')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                    activeTab === 'form'
                      ? 'text-white shadow-lg'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                  style={{
                    background: activeTab === 'form' 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                      : 'transparent'
                  }}
                >
                  <FileText className="w-4 h-4" />
                  <span>Remplir</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                    activeTab === 'history'
                      ? 'text-white shadow-lg'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                  style={{
                    background: activeTab === 'history' 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                      : 'transparent'
                  }}
                >
                  <History className="w-4 h-4" />
                  <span>Historique</span>
                </motion.button>
              </nav>
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {activeTab === 'form' && <VodsForm projects={projects} />}

            {activeTab === 'history' && (
              <>
                {loading && historyVods === null ? (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-slate-600 font-medium">Chargement…</p>
                  </div>
                ) : (
                  <VodsHistory vods={historyVods || []} />
                )}
              </>
            )}

            {activeTab === 'notifications' && (
              <>
                {loading && notif === null ? (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-slate-600 font-medium">Chargement…</p>
                  </div>
                ) : (
                  <VodsNotifications {...(notif || {})} />
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}