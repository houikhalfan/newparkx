// resources/js/Pages/Contractant/ContractorHome.jsx

import React, { useState, useEffect, useRef } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  FileText,
  BarChart3,
  FileSignature,
  FolderOpen,
  ClipboardList,
  X,
  Sparkles,
  Zap,
  Star,
} from "lucide-react";

const ServiceCard = ({ Icon, title, desc, href, color, isSignature, onClick }) => {
  const content = (
    <motion.div
      whileHover={{ 
        scale: 1.03,
        y: -8,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        duration: 0.3
      }}
      className="group relative bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-8 flex flex-col items-center text-center justify-between hover:shadow-2xl hover:border-white/80 transition-all duration-500 overflow-hidden h-[340px] hover:bg-white/90"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Icon Container with Bright Effect */}
      <div className="relative mb-6">
        <div
          className={`w-24 h-24 rounded-3xl flex items-center justify-center bg-gradient-to-br ${color} shadow-lg group-hover:shadow-xl transition-all duration-500 relative overflow-hidden`}
          style={{
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          }}
        >
          {/* Icon Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl" />
          <Icon size={36} className="text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
          
          {/* Animated Border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/40 via-transparent to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        {/* Floating Particles */}
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
        <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-300" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {desc}
        </p>
      </div>
      
      {/* Interactive Button */}
      <div className="relative">
        <span className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl text-sm font-semibold group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 shadow-lg group-hover:shadow-xl">
          <span>Accéder</span>
          <motion.svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24"
            className="group-hover:translate-x-1 transition-transform duration-300"
          >
          <path fill="currentColor" d="M13 5l7 7-7 7v-4H4v-6h9V5z" />
          </motion.svg>
      </span>
        
        {/* Button Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500" />
      </div>

      {/* Corner Accents */}
      <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-blue-300 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-purple-300 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cards = [
    {
      title: "VODS",
      desc: "Créer et suivre vos Visites Observation & Ronde.",
      href: "/contractant/vods",
      Icon: FolderOpen,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Documents",
      desc: "Consulter et télécharger les documents partagés.",
      href: "/contractant/documents",
      Icon: FileText,
      color: "from-emerald-500 to-green-500",
    },
    {
      title: "Statistiques HSE",
      desc: "Soumettre et suivre vos statistiques de santé, sécurité et environnement.",
      href: route("contractant.hse-statistics.index"),
      Icon: BarChart3,
      color: "from-purple-500 to-violet-500",
    },
    {
      title: "Permis",
      desc: "Déposez vos pièces pour signature par l'administration.",
      Icon: FileSignature,
      color: "from-pink-500 to-rose-500",
      isSignature: true,
    },
    {
      title: "Ressources Matérielles",
      desc: "Gérer et suivre l'état de vos engins et équipements.",
      href: route("contractant.materiel.index"),
      Icon: Package,
      color: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-pink-200/25 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-yellow-200/20 rounded-full blur-2xl animate-pulse delay-700" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      {/* Top Dashboard Bar */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-50 bg-white/80 backdrop-blur-xl border-b border-blue-200/50 shadow-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">ParkX</h1>
                <p className="text-sm text-gray-600">Contractor Portal</p>
              </div>
            </div>

            {/* Contractor Profile & Actions */}
            <div className="flex items-center space-x-6">
              {/* Contractor Info */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{contractor?.name || 'Contractor'}</p>
                  <p className="text-xs text-gray-600">{contractor?.company_name || 'Company'}</p>
                </div>
                
                {/* Profile Circle with Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <div 
                    className="group cursor-pointer"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg border-2 border-blue-200 hover:border-blue-300 transition-all duration-300">
                      <span className="text-white font-bold text-lg">
                        {contractor?.name?.charAt(0)?.toUpperCase() || 'C'}
                      </span>
                    </div>
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300" />
                    
                    {/* Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                  </div>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {showProfileDropdown && (
                      <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-14 w-64 bg-white/95 backdrop-blur-xl border border-blue-200/50 rounded-2xl shadow-xl overflow-hidden z-50"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.2)'
                      }}
                    >
                      {/* Profile Header */}
                      <div className="p-4 border-b border-blue-200/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {contractor?.name?.charAt(0)?.toUpperCase() || 'C'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{contractor?.name || 'Contractor'}</p>
                            <p className="text-xs text-gray-600">{contractor?.email || 'email@example.com'}</p>
                            <p className="text-xs text-blue-600">{contractor?.company_name || 'Company'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <Link href={route('contractant.profile')} className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Mon Profil</span>
                        </Link>
                        
                      </div>

                      {/* Logout Button */}
                      <div className="p-2 border-t border-red-200/30">
                        <button 
                          onClick={() => {
                            router.post(route('contractant.logout'));
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  router.post(route('contractant.logout'));
                }}
                className="group relative px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-sm font-semibold">Déconnexion</span>
                </div>
                
                {/* Button Glow Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400 to-pink-400 opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative text-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-purple-100/30" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              {name}
          </h1>
            <div className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
              Bienvenue dans votre espace ParkX
            </div>
            <div className="text-lg text-gray-600 max-w-2xl mx-auto">
              Gérez vos projets, documents et permis de manière simple et efficace
            </div>
          </motion.div>

        </div>
      </section>

      {/* Cards Section */}
      <main className="max-w-7xl mx-auto px-6 -mt-20 pb-32 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mb-16"
        >
          
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {cards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 60, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ 
                delay: idx * 0.1, 
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
              style={{
                transformStyle: "preserve-3d"
              }}
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

        {/* Bright Modal */}
        <AnimatePresence>
          {showSignatureOptions && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative bg-white/95 backdrop-blur-xl border border-blue-200/50 rounded-3xl shadow-2xl max-w-2xl w-full p-8 overflow-hidden"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.2)'
                }}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50" />
                
                <button
                  onClick={() => setShowSignatureOptions(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-300 z-10"
                >
                  <X size={24} />
                </button>

                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Choisissez une option
                </h2>

                {/* Gestion des fichiers */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-blue-600 mb-4 uppercase tracking-wider">
                    Gestion des Fichiers
                  </h3>
                  <Link
                    href={route("contractant.suivi-permis.index")}
                    className="group flex flex-col items-center justify-center rounded-2xl border border-blue-200 bg-white/80 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 p-6 transition-all duration-500 backdrop-blur-sm"
                    onClick={() => setShowSignatureOptions(false)}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-500">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 text-center group-hover:text-blue-600 transition-colors duration-300">
                      Suivre la situation de vos fichiers
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 text-center group-hover:text-gray-700 transition-colors duration-300">
                      Envoyez vos documents pour signature.
                    </p>
                  </Link>
                </div>

                {/* Demandes de permis */}
                <div>
                  <h3 className="text-sm font-semibold text-purple-600 mb-4 uppercase tracking-wider">
                    Demandes de Permis
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* ✅ Create excavation permit */}
                    <Link
                      href={route("contractant.permisexcavation.create")}
                      className="group flex flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-white/80 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 p-6 transition-all duration-500 backdrop-blur-sm"
                      onClick={() => setShowSignatureOptions(false)}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-500">
                        <ClipboardList className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 text-center group-hover:text-emerald-600 transition-colors duration-300">
                        Nouveau Permis d'excavation
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 text-center group-hover:text-gray-700 transition-colors duration-300">
                        Déposez vos nouvelles demandes de permis.
                      </p>
                    </Link>

                    {/* Secure Work Permit (frontend only for now) */}
                    <Link
                      href="/contractant/permis-de-travail-securitaire"
                      className="group flex flex-col items-center justify-center rounded-2xl border border-purple-200 bg-white/80 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/50 p-6 transition-all duration-500 backdrop-blur-sm"
                      onClick={() => setShowSignatureOptions(false)}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-500">
                        <ClipboardList className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 text-center group-hover:text-purple-600 transition-colors duration-300">
                        Permis de Travail Sécuritaire
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 text-center group-hover:text-gray-700 transition-colors duration-300">
                        Déposez vos demandes de permis.
                      </p>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bright Info Panels */}
        <section className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="group relative bg-white/80 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 hover:border-blue-300/60 hover:shadow-xl transition-all duration-500 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.1)'
            }}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Icon */}
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 010 2.828L4.828 15H4a1 1 0 01-1-1V8a1 1 0 011-1h.828z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse" />
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
              Centre de Notifications
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
              Vos alertes et messages importants s'affichent ici en temps réel.
            </p>
            
            {/* Status Indicators */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-600 font-medium">Système actif</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-sm text-blue-600 font-medium">0 nouvelles</span>
              </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-300/50 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="group relative bg-white/80 backdrop-blur-xl border border-emerald-200/50 rounded-3xl p-8 hover:border-emerald-300/60 hover:shadow-xl transition-all duration-500 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(16, 185, 129, 0.1)'
            }}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Icon */}
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-400 rounded-full animate-pulse" />
          </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
              Support Technique
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
              Contactez l'équipe d'administration ParkX pour toute assistance.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-xl">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:admin@parkx.test" className="text-emerald-600 hover:text-emerald-700 transition-colors duration-300 font-medium">
                  admin@parkx.test
                </a>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-cyan-50 to-emerald-50 border border-cyan-200 rounded-xl">
                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-cyan-600 font-medium">Disponible 24/7</span>
              </div>
          </div>

            {/* Corner Accents */}
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-300/50 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        </section>
      </main>
    </div>
  );
}
