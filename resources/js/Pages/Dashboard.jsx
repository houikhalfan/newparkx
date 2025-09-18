import React, { useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  Package, 
  Video, 
  FileSignature, 
  Archive,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Star,
  Zap,
  TrendingUp,
  Activity,
  BarChart3,
  Settings,
  Bell,
  Sparkles,
  Globe,
  Layers,
  Database,
  Cpu,
  Network,
  PenTool,
  Truck,
  LogOut,
  UserCircle
} from 'lucide-react';

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.25l7.25 2.5v5.25c0 4.97-3.13 9.44-7.25 10.75-4.12-1.31-7.25-5.78-7.25-10.75V5.75L12 3.25z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12.25l1.75 1.75 3.25-3.25" />
    </svg>
  );
}

export default function Dashboard() {
  const {
    isResponsible = false,
    assignedPending = 0,
    materialPending = 0,
    auth = {},
  } = usePage().props || {};

  const isAdmin = !!auth?.isAdmin;
  const { user } = auth || {};

  /** Base cards */
  const baseCards = useMemo(
    () => [
      {
        title: 'Documents',
        description: 'Gérez, téléchargez et partagez vos fichiers',
        icon: FileText,
        href: '/documents',
        gradient: 'from-blue-500 to-cyan-500',
        lightGradient: 'from-blue-50 to-cyan-50',
        stats: 'Tous vos fichiers',
        trend: '+12%',
        category: 'Gestion',
        badge: 'Nouveau'
      },
      {
        title: 'Demande EPI',
        description: 'Demandez et gérez vos équipements de protection individuelle',
        icon: Package,
        href: '/epi-requests',
        gradient: 'from-purple-500 to-pink-500',
        lightGradient: 'from-purple-50 to-pink-50',
        stats: 'Équipements disponibles',
        trend: '+8%',
        category: 'Sécurité',
        badge: 'Populaire'
      },
      {
        title: 'VODS',
        description: 'Accédez aux vidéos et formulaires liés',
        icon: Video,
        href: '/vods',
        gradient: 'from-emerald-500 to-teal-500',
        lightGradient: 'from-emerald-50 to-teal-50',
        stats: 'Formations en ligne',
        trend: '+15%',
        category: 'Formation',
        badge: 'Hot'
      },
     
    ],
    []
  );

  /** HSE Responsable cards */
const hseResponsableCards = useMemo(
  () => [
    {
      title: 'Signatures HSE',
      description: 'Validez les permis et documents en attente de signature HSE',
      icon: Shield, // or FileSignature if you prefer
      href: '/hse-responsible/permis',
      badge: assignedPending,
      gradient: 'from-green-500 to-emerald-500',
      lightGradient: 'from-green-50 to-emerald-50',
      stats: 'Documents à signer',
      category: 'HSE',
    }
  ],
  [assignedPending]
);

  /** Responsable cards */
  const responsableCards = useMemo(
    () => [
     {
title: 'Gestion des Permis',
description: 'Consultez et signez les documents rapidement',
  icon: FileSignature,
  href: '/responsible-site/suivi-permis',   // 👈 new route
  badge: assignedPending,
  gradient: 'from-orange-500 to-red-500',
  lightGradient: 'from-orange-50 to-red-50',
  stats: 'En attente de signature',
  trend: assignedPending > 0 ? 'Urgent' : 'À jour',
  category: 'Administration',
  priority: assignedPending > 0 ? 'high' : 'normal'
},
      {
        title: 'Ressources Matérielles',
        description: 'Gérez et suivez vos ressources matérielles',
        icon: Archive,
        href: '/materiel',
        badge: materialPending,
        gradient: 'from-cyan-500 to-blue-500',
        lightGradient: 'from-cyan-50 to-blue-50',
        stats: 'Ressources disponibles',
        trend: '+5%',
        category: 'Ressources',
        badge: 'Essentiel'
      },
    ],
    [assignedPending, materialPending]
  );

 const { isHseResponsible = false } = usePage().props || {};

const cards = useMemo(() => {
  let all = [...baseCards];

  if (isResponsible) {
    all = [...all, ...responsableCards];
  }

  if (isHseResponsible) {
    all = [...all, ...hseResponsableCards];
  }

  return all;
}, [baseCards, responsableCards, hseResponsableCards, isResponsible, isHseResponsible]);


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
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <img src="/images/wh.png" className="h-8 w-auto" alt="PARKX Logo" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    ParkX
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">Plateforme Industrielle Intelligente</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                {/* Admin Button */}
                {isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <Link
                      href="/admin/home"
                      className="group relative inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                      <Shield className="w-4 h-4" />
                      <span>Dashboard Admin</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                )}

                {/* Logout Button */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Link
                    href="/logout"
                    method="post"
                    className="group relative inline-flex items-center space-x-2 px-4 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg bg-red-500 hover:bg-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                  </Link>
                </motion.div>

                {/* User Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
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

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="relative z-10 pt-16 pb-20"
      >
        <div className="max-w-6xl mx-auto px-6 text-center">

          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Bienvenue sur votre interface ParkX. Accédez à tous vos outils et services 
            en un seul endroit pour optimiser votre expérience industrielle.
          </p>

        </div>
      </motion.section>

      {/* Services Grid */}
      <section className="relative z-10 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.15, duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <Link href={card.href} className="block h-full">
                  <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 overflow-hidden group-hover:shadow-2xl transition-all duration-500">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.lightGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Floating Elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-lg group-hover:scale-125 transition-transform duration-700" />

                    {/* Badge */}
                    {typeof card.badge === 'number' && card.badge > 0 && (
                      <div className="absolute top-6 right-6 z-10">
                        <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold h-8 min-w-[32px] px-3 shadow-lg animate-pulse">
                          {card.badge > 99 ? '99+' : card.badge}
                        </span>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="relative z-10 mb-6">
                      <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r ${card.gradient} text-white shadow-lg`}>
                        {card.category}
                      </span>
                      {card.badge && typeof card.badge === 'string' && (
                        <span className="ml-2 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 text-white">
                          {card.badge}
                        </span>
                      )}
                    </div>

                    {/* Icon */}
                    <div className="relative z-10 mb-6">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <card.icon className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 mb-6">
                      <h4 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-slate-900 transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                        {card.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="relative z-10 flex items-center justify-between mb-6">
                      <span className="text-sm text-slate-500 font-medium">{card.stats}</span>
                      <span className={`text-sm font-bold ${
                        card.trend === 'Urgent' ? 'text-red-500' : 
                        card.trend === 'À jour' ? 'text-emerald-500' : 
                        'text-blue-500'
                      }`}>
                        {card.trend}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-800 transition-colors">
                        Accéder au service
                      </span>
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${card.gradient} flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300 shadow-lg`}>
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.7 }}
        className="relative z-10 py-20 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
            <h3 className="text-4xl font-bold text-slate-800 mb-6">
              Prêt à optimiser votre expérience ?
            </h3>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              Explorez nos services et découvrez comment ParkX peut transformer votre workflow industriel.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                Commencer maintenant
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl border-2 border-slate-300 text-slate-700 font-bold text-lg transition-all duration-300 hover:bg-slate-50 hover:border-slate-400"
              >
                En savoir plus
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}