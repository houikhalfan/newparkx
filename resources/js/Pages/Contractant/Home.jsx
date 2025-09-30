// resources/js/Pages/Contractant/ContractorHome.jsx

import React, { useState, useEffect, useRef } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, X as CloseIcon } from "lucide-react";

const ServiceCard = ({ image, title, desc, href, isSignature, onClick }) => {
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
      className="group relative bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col items-center text-center justify-between hover:shadow-2xl hover:border-white/80 transition-all duration-500 overflow-hidden h-[280px] sm:h-[300px] md:h-[340px] hover:bg-white/90"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Image Container with Bright Effect */}
      <div className="relative mb-3 sm:mb-4">
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center bg-white shadow-lg group-hover:shadow-xl transition-all duration-500 relative overflow-hidden"
          style={{
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          }}
        >
          {/* Image Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl" />
          <img 
            src={`/images/${image}`} 
            alt={title}
            className="w-8 h-8 sm:w-12 sm:h-12 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300" 
          />
          
          {/* Animated Border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/40 via-transparent to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        {/* Floating Particles */}
        <div className="absolute -top-2 -right-2 w-4 h-4 sm:w-6 sm:h-6 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
        <div className="absolute -bottom-2 -left-2 w-3 h-3 sm:w-4 sm:h-4 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-300" />
      </div>

      {/* Content with fixed height */}
      <div className="flex-1 flex flex-col justify-center mb-3 sm:mb-4 min-h-[100px] sm:min-h-[120px]">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 line-clamp-3">
          {desc}
        </p>
      </div>
      
      {/* Interactive Button - Now consistently positioned */}
      <div className="relative w-full mt-auto">
        <span className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-[#013b94] text-white rounded-2xl text-xs sm:text-sm font-semibold group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 shadow-lg group-hover:shadow-xl w-full">
          <span>Accéder</span>
          <motion.svg 
            width="14" 
            height="14" 
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
      <div className="absolute top-4 right-4 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-4 left-4 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2 border-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const profileDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
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
      image: "form.png",
    },
    {
      title: "Documents",
      desc: "Consulter et télécharger les documents partagés.",
      href: "/contractant/documents",
      image: "doc.png",
    },
    {
      title: "Statistiques HSE",
      desc: "Soumettre et suivre vos statistiques HSE.",
      href: route("contractant.hse-statistics.index"),
      image: "stat.png",
    },
    {
      title: "Permis",
      desc: "Déposez vos pièces pour signature par l'administration.",
      image: "agreement.png",
      isSignature: true,
    },
    {
      title: "Ressources Matérielles",
      desc: "Soumettre à la conformité.",
      href: route("contractant.materiel.index"),
      image: "materiel.png",
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-lg bg-white/50 border border-blue-200/50"
              >
                {showMobileMenu ? <CloseIcon size={20} /> : <Menu size={20} />}
              </button>

              {/* Logo Section */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-24 sm:w-30 h-10 sm:h-12 flex items-center justify-center overflow-hidden p-0">
                    <img 
                      src="/images/logo.png" 
                      alt="ParkX Logo" 
                      className="h-8 sm:h-10 object-contain"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-yellow-400 rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            {/* Contractor Profile & Actions */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Contractor Info - Hidden on mobile */}
              <div className="hidden sm:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{contractor?.name || 'Contractor'}</p>
                  <p className="text-xs text-gray-600">{contractor?.company_name || 'Company'}</p>
                </div>
              </div>
              
              {/* Profile Circle with Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <div 
                  className="group cursor-pointer"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#013b94] rounded-full flex items-center justify-center shadow-lg border-2 border-blue-200 hover:border-blue-300 transition-all duration-300">
                    <span className="text-white font-bold text-base sm:text-lg">
                      {contractor?.name?.charAt(0)?.toUpperCase() || 'C'}
                    </span>
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-full bg-[#013b94] opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300" />
                  
                  {/* Status Indicator */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-[#013b94] rounded-full border-2 border-white animate-pulse" />
                </div>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 sm:top-14 w-56 sm:w-64 bg-white/95 backdrop-blur-xl border border-blue-200/50 rounded-2xl shadow-xl overflow-hidden z-50"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.2)'
                      }}
                    >
                      {/* Profile Header */}
                      <div className="p-3 sm:p-4 border-b border-blue-200/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#013b94] rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {contractor?.name?.charAt(0)?.toUpperCase() || 'C'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 truncate max-w-[120px] sm:max-w-none">{contractor?.name || 'Contractor'}</p>
                            <p className="text-xs text-gray-600 truncate max-w-[120px] sm:max-w-none">{contractor?.email || 'email@example.com'}</p>
                            <p className="text-xs text-blue-600 truncate max-w-[120px] sm:max-w-none">{contractor?.company_name || 'Company'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-1 sm:p-2">
                        <Link href={route('contractant.profile')} className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Mon Profil</span>
                        </Link>
                      </div>

                      {/* Logout Button */}
                      <div className="p-1 sm:p-2 border-t border-red-200/30">
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

              {/* Logout Button - Hidden on mobile, shown in mobile menu */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  router.post(route('contractant.logout'));
                }}
                className="hidden sm:flex group relative px-4 py-2 sm:px-6 sm:py-3 bg-[#0e5186] text-white rounded-xl hover:bg-[#0c3f66] transition-all duration-300 shadow-lg hover:shadow-xl"
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white/95 border-t border-blue-200/50"
              ref={mobileMenuRef}
            >
              <div className="px-4 py-4 space-y-4">
                {/* Contractor Info */}
                <div className="flex items-center space-x-3 p-3 bg-blue-50/50 rounded-lg">
                  <div className="w-10 h-10 bg-[#013b94] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {contractor?.name?.charAt(0)?.toUpperCase() || 'C'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{contractor?.name || 'Contractor'}</p>
                    <p className="text-xs text-gray-600">{contractor?.company_name || 'Company'}</p>
                  </div>
                </div>

                {/* Mobile Menu Items */}
                <Link 
                  href={route('contractant.profile')}
                  className="flex items-center space-x-3 p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Mon Profil</span>
                </Link>

                {/* Mobile Logout Button */}
                <button 
                  onClick={() => {
                    router.post(route('contractant.logout'));
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Se déconnecter</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="relative text-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-purple-100/30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 md:mb-8"
          >
            {/* Main Title */}
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 md:mb-4 px-2">
              Bienvenue dans votre espace ParkX
            </div>

            {/* Subtitle */}
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 max-w-2xl mx-auto px-4">
              Gérez vos projets, documents et permis de manière simple et efficace
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cards Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 -mt-12 md:-mt-16 lg:-mt-20 pb-16 md:pb-24 lg:pb-32 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
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
              className="w-full"
            >
              <ServiceCard
                image={card.image}
                title={card.title}
                desc={card.desc}
                href={card.href}
                isSignature={card.isSignature}
                onClick={() => setShowSignatureOptions(true)}
              />
            </motion.div>
          ))}
        </div>

        {/* Permis Modal */}
        <AnimatePresence>
          {showSignatureOptions && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSignatureOptions(false)}
            >
              <motion.div
                className="relative bg-white/95 backdrop-blur-xl border border-blue-200/50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.2)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50" />
                
                <button
                  onClick={() => setShowSignatureOptions(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-300 z-10"
                >
                  <X size={24} />
                </button>

                <div className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-center">
                    Choisissez une option
                  </h2>

                  {/* Gestion des fichiers */}
                  <div className="mb-6 md:mb-8">
                    <h3 className="text-sm font-semibold text-[#013b94] mb-4 uppercase tracking-wider">
                      Gestion des Fichiers
                    </h3>
                    <Link
                      href={route("contractant.suivi-permis.index")}
                      className="group flex flex-col items-center justify-center rounded-2xl border border-blue-200 bg-white/80 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 p-4 md:p-6 transition-all duration-500 backdrop-blur-sm"
                      onClick={() => setShowSignatureOptions(false)}
                    >
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-lg group-hover:shadow-xl transition-all duration-500">
                        <img src="/images/doc.png" alt="Documents" className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-gray-800 text-center group-hover:text-blue-600 transition-colors duration-300">
                        Suivre la situation de vos fichiers
                      </h3>
                    </Link>
                  </div>

                  {/* Demandes de permis */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#013b94] mb-4 uppercase tracking-wider">
                      Demandes de Permis
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                      {/* Permis 1 - Excavation */}
                      <Link
                        href={route("contractant.permisexcavation.create")}
                        className="group flex flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-white/80 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 p-3 md:p-4 transition-all duration-500 backdrop-blur-sm h-full"
                        onClick={() => setShowSignatureOptions(false)}
                      >
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center mb-2 md:mb-3 shadow-lg group-hover:shadow-xl transition-all duration-500">
                          <img src="/images/agreement.png" alt="Permis d'excavation" className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-gray-800 text-center group-hover:text-emerald-600 transition-colors duration-300 mb-1 md:mb-2">
                          Permis d'excavation
                        </h3>
                        <p className="text-xs text-gray-600 text-center group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                          Nouvelle demande de permis d'excavation
                        </p>
                      </Link>

                      {/* Permis 2 - Travail Sécuritaire */}
                      <Link
                        href={route('contractant.permis-travail-securitaire.index')}
                        className="group flex flex-col items-center justify-center rounded-2xl border border-purple-200 bg-white/80 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/50 p-3 md:p-4 transition-all duration-500 backdrop-blur-sm h-full"
                        onClick={() => setShowSignatureOptions(false)}
                      >
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center mb-2 md:mb-3 shadow-lg group-hover:shadow-xl transition-all duration-500">
                          <img src="/images/agreement.png" alt="Permis de travail" className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-gray-800 text-center group-hover:text-purple-600 transition-colors duration-300 mb-1 md:mb-2">
                          Permis de Travail
                        </h3>
                        <p className="text-xs text-gray-600 text-center group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                          Demande de permis de travail sécuritaire
                        </p>
                      </Link>
                             <Link
href={route('contractant.permis-travail-chaud.create')}
    className="group flex flex-col items-center justify-center rounded-2xl border border-purple-200 bg-white/80 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/50 p-3 md:p-4 transition-all duration-500 backdrop-blur-sm h-full"
    onClick={() => setShowSignatureOptions(false)}
>
    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center mb-2 md:mb-3 shadow-lg group-hover:shadow-xl transition-all duration-500">
        <img src="/images/agreement.png" alt="Permis de travail" className="w-5 h-5 md:w-6 md:h-6" />
    </div>
    <h3 className="text-sm md:text-base font-bold text-gray-800 text-center group-hover:text-purple-600 transition-colors duration-300 mb-1 md:mb-2">
        Permis de Travail a chaud
    </h3>
    <p className="text-xs text-gray-600 text-center group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
        Demande de permis de travail à chaud
    </p>
</Link>

                      {/* Additional permis cards with similar responsive adjustments */}
                      {[3, 4].map((num) => (
                        <Link
                          key={num}
                          href="#"
                          className="group flex flex-col items-center justify-center rounded-2xl border border-orange-200 bg-white/80 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100/50 p-3 md:p-4 transition-all duration-500 backdrop-blur-sm h-full"
                          onClick={() => setShowSignatureOptions(false)}
                        >
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center mb-2 md:mb-3 shadow-lg group-hover:shadow-xl transition-all duration-500">
                            <img src="/images/agreement.png" alt={`Permis thème ${num}`} className="w-5 h-5 md:w-6 md:h-6" />
                          </div>
                          <h3 className="text-sm md:text-base font-bold text-gray-800 text-center group-hover:text-orange-600 transition-colors duration-300 mb-1 md:mb-2">
                            Permis Thème {num}
                          </h3>
                          <p className="text-xs text-gray-600 text-center group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                            Description du permis thème {num}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bright Info Panels */}
        <section className="mt-12 md:mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="group relative bg-white/80 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-6 md:p-8 hover:border-blue-300/60 hover:shadow-xl transition-all duration-500 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.1)'
            }}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Icon */}
            <div className="relative mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 010 2.828L4.828 15H4a1 1 0 01-1-1V8a1 1 0 011-1h.828z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 md:w-6 md:h-6 bg-yellow-400 rounded-full animate-pulse" />
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4 group-hover:text-blue-600 transition-colors duration-300">
              Centre de Notifications
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4 md:mb-6 text-sm md:text-base group-hover:text-gray-700 transition-colors duration-300">
              Vos alertes et messages important s'affichent ici en temps réel.
            </p>
            
            {/* Status Indicators */}
            <div className="flex items-center gap-3 md:gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs md:text-sm text-green-600 font-medium">Système actif</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-xs md:text-sm text-blue-600 font-medium">0 nouvelles</span>
              </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-3 right-3 md:top-4 md:right-4 w-6 h-6 md:w-8 md:h-8 border-t-2 border-r-2 border-blue-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="group relative bg-white/80 backdrop-blur-xl border border-emerald-200/50 rounded-3xl p-6 md:p-8 hover:border-emerald-300/60 hover:shadow-xl transition-all duration-500 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(16, 185, 129, 0.1)'
            }}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Icon */}
            <div className="relative mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 md:w-6 md:h-6 bg-pink-400 rounded-full animate-pulse" />
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4 group-hover:text-emerald-600 transition-colors duration-300">
              Support Technique
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4 md:mb-6 text-sm md:text-base group-hover:text-gray-700 transition-colors duration-300">
              Contactez l'équipe d'administration ParkX pour toute assistance.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-xl">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:admin@parkx.test" className="text-emerald-600 hover:text-emerald-700 transition-colors duration-300 font-medium text-xs md:text-sm">
                  admin@parkx.test
                </a>
              </div>
              <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gradient-to-r from-cyan-50 to-emerald-50 border border-cyan-200 rounded-xl">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-cyan-600 font-medium text-xs md:text-sm">Disponible 24/7</span>
              </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-3 right-3 md:top-4 md:right-4 w-6 h-6 md:w-8 md:h-8 border-t-2 border-r-2 border-emerald-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        </section>
      </main>
    </div>
  );
}