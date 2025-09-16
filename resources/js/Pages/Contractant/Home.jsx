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
} from "lucide-react";

const ServiceCard = ({ Icon, title, desc, href, color, isSignature, onClick }) => {
  const content = (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        duration: 0.3
      }}
      className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-cyan-500/20 shadow-2xl rounded-2xl p-6 flex flex-col items-center text-center justify-between hover:border-cyan-400/40 transition-all duration-500 overflow-hidden h-[320px]"
      style={{
        background: 'linear-gradient(135deg, rgba(31,41,55,0.8) 0%, rgba(17,24,39,0.9) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(6, 182, 212, 0.1)'
      }}
    >
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Icon Container with Neon Effect */}
      <div className="relative mb-4">
        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br ${color} shadow-2xl group-hover:shadow-cyan-500/25 transition-all duration-500 relative overflow-hidden`}
          style={{
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Icon Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
          <Icon size={32} className="text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
          
          {/* Animated Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/50 via-transparent to-emerald-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
               style={{ background: 'conic-gradient(from 0deg, transparent, rgba(6,182,212,0.5), transparent)' }} />
        </div>
        
        {/* Floating Particles */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-300" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
          {desc}
        </p>
      </div>
      
      {/* Interactive Button */}
      <div className="relative">
        <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 rounded-full text-sm font-medium text-cyan-300 group-hover:from-cyan-500/30 group-hover:to-emerald-500/30 group-hover:border-cyan-400/50 group-hover:text-cyan-200 transition-all duration-300 backdrop-blur-sm">
          <span>Accéder</span>
          <motion.svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24"
            className="group-hover:translate-x-1 transition-transform duration-300"
          >
          <path fill="currentColor" d="M13 5l7 7-7 7v-4H4v-6h9V5z" />
          </motion.svg>
      </span>
        
        {/* Button Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
      </div>

      {/* Corner Accents */}
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-500/30 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
      color: "from-cyan-500 to-blue-600",
    },
    {
      title: "Documents",
      desc: "Consulter et télécharger les documents partagés.",
      href: "/contractant/documents",
      Icon: FileText,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Statistiques HSE",
      desc: "Soumettre et suivre vos statistiques de santé, sécurité et environnement.",
      href: route("contractant.hse-statistics.index"),
      Icon: BarChart3,
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Permis",
      desc: "Déposez vos pièces pour signature par l'administration.",
      Icon: FileSignature,
      color: "from-pink-500 to-rose-600",
      isSignature: true,
    },
    {
      title: "Ressources Matérielles",
      desc: "Gérer et suivre l'état de vos engins et équipements.",
      href: route("contractant.materiel.index"),
      Icon: Package,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-violet-500/25 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      {/* Top Dashboard Bar */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-50 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(31,41,55,0.8) 0%, rgba(17,24,39,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(6, 182, 212, 0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-2xl">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ParkX</h1>
                <p className="text-xs text-gray-400">Contractor Portal</p>
              </div>
            </div>

            {/* Contractor Profile & Actions */}
            <div className="flex items-center space-x-6">
              {/* Contractor Info */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{contractor?.name || 'Contractor'}</p>
                  <p className="text-xs text-gray-400">{contractor?.company_name || 'Company'}</p>
                </div>
                
                {/* Profile Circle with Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <div 
                    className="group cursor-pointer"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl border-2 border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300">
                      <span className="text-white font-bold text-lg">
                        {contractor?.name?.charAt(0)?.toUpperCase() || 'C'}
                      </span>
                    </div>
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300" />
                    
                    {/* Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-gray-900 animate-pulse" />
                  </div>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {showProfileDropdown && (
                      <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-14 w-64 bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden z-50"
                      style={{
                        background: 'linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.98) 100%)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(6, 182, 212, 0.2)'
                      }}
                    >
                      {/* Profile Header */}
                      <div className="p-4 border-b border-cyan-500/20">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {contractor?.name?.charAt(0)?.toUpperCase() || 'C'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{contractor?.name || 'Contractor'}</p>
                            <p className="text-xs text-gray-400">{contractor?.email || 'email@example.com'}</p>
                            <p className="text-xs text-cyan-300">{contractor?.company_name || 'Company'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <Link href={route('contractant.profile')} className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-cyan-500/10 rounded-lg transition-colors duration-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Mon Profil</span>
                        </Link>
                        
                      </div>

                      {/* Logout Button */}
                      <div className="p-2 border-t border-red-500/20">
                        <button 
                          onClick={() => {
                            router.post(route('contractant.logout'));
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
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
                className="group relative px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-full text-red-300 hover:from-red-500/30 hover:to-orange-500/30 hover:border-red-400/50 hover:text-red-200 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-sm font-medium">Déconnexion</span>
                </div>
                
                {/* Button Glow Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-orange-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent mb-6">
              {name}
          </h1>
            <div className="text-2xl md:text-3xl font-semibold text-white/90 mb-4">
              Bienvenue dans votre espace ParkX
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

        {/* Futuristic Modal */}
        <AnimatePresence>
          {showSignatureOptions && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl max-w-2xl w-full p-8 overflow-hidden"
                initial={{ scale: 0.9, opacity: 0, rotateX: -15 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.9, opacity: 0, rotateX: 15 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(31,41,55,0.9) 0%, rgba(17,24,39,0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(6, 182, 212, 0.2)'
                }}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5" />
                
                <button
                  onClick={() => setShowSignatureOptions(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300 z-10"
                >
                  <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-8 text-center bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Choisissez une option
                </h2>

                {/* Gestion des fichiers */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-cyan-300 mb-4 uppercase tracking-wider">
                    Gestion des Fichiers
                  </h3>
                  <Link
                    href={route("contractant.suivi-permis.index")}
                    className="group flex flex-col items-center justify-center rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/10 p-6 transition-all duration-500 backdrop-blur-sm"
                    onClick={() => setShowSignatureOptions(false)}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl group-hover:shadow-cyan-500/25 transition-all duration-500">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white text-center group-hover:text-cyan-300 transition-colors duration-300">
                      Suivre la situation de vos fichiers
                    </h3>
                    <p className="text-sm text-gray-300 mt-2 text-center group-hover:text-gray-200 transition-colors duration-300">
                      Envoyez vos documents pour signature.
                    </p>
                  </Link>
                </div>

                {/* Demandes de permis */}
                <div>
                  <h3 className="text-sm font-semibold text-emerald-300 mb-4 uppercase tracking-wider">
                    Demandes de Permis
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* ✅ Create excavation permit */}
                    <Link
                      href={route("contractant.permisexcavation.create")}
                      className="group flex flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-500/10 p-6 transition-all duration-500 backdrop-blur-sm"
                      onClick={() => setShowSignatureOptions(false)}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl group-hover:shadow-emerald-500/25 transition-all duration-500">
                        <ClipboardList className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white text-center group-hover:text-emerald-300 transition-colors duration-300">
                        Nouveau Permis d'excavation
                      </h3>
                      <p className="text-sm text-gray-300 mt-2 text-center group-hover:text-gray-200 transition-colors duration-300">
                        Déposez vos nouvelles demandes de permis.
                      </p>
                    </Link>

                    {/* Secure Work Permit (frontend only for now) */}
                    <Link
                      href="/contractant/permis-de-travail-securitaire"
                      className="group flex flex-col items-center justify-center rounded-2xl border border-violet-500/30 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-violet-400/50 hover:shadow-2xl hover:shadow-violet-500/10 p-6 transition-all duration-500 backdrop-blur-sm"
                      onClick={() => setShowSignatureOptions(false)}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl group-hover:shadow-violet-500/25 transition-all duration-500">
                        <ClipboardList className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white text-center group-hover:text-violet-300 transition-colors duration-300">
                        Permis de Travail Sécuritaire
                      </h3>
                      <p className="text-sm text-gray-300 mt-2 text-center group-hover:text-gray-200 transition-colors duration-300">
                        Déposez vos demandes de permis.
                      </p>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Futuristic Info Panels */}
        <section className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="group relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/40 transition-all duration-500 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(31,41,55,0.6) 0%, rgba(17,24,39,0.8) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(6, 182, 212, 0.1)'
            }}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Icon */}
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 010 2.828L4.828 15H4a1 1 0 01-1-1V8a1 1 0 011-1h.828z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full animate-pulse" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
              Centre de Notifications
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-200 transition-colors duration-300">
              Vos alertes et messages importants s'affichent ici en temps réel.
            </p>
            
            {/* Status Indicators */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm text-emerald-300">Système actif</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-sm text-cyan-300">0 nouvelles</span>
              </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="group relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8 hover:border-emerald-400/40 transition-all duration-500 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(31,41,55,0.6) 0%, rgba(17,24,39,0.8) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(16, 185, 129, 0.1)'
            }}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Icon */}
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full animate-pulse" />
          </div>

            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
              Support Technique
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-200 transition-colors duration-300">
              Contactez l'équipe d'administration ParkX pour toute assistance.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-lg">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:admin@parkx.test" className="text-emerald-300 hover:text-emerald-200 transition-colors duration-300 font-medium">
                  admin@parkx.test
                </a>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-lg">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-cyan-300 font-medium">Disponible 24/7</span>
              </div>
          </div>

            {/* Corner Accents */}
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-500/30 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        </section>
      </main>
    </div>
  );
}
