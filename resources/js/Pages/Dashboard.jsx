import React, { useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
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
        description: 'Consulter et télécharger les documents partagés',
        image: 'doc.png',
        href: '/documents',
      },
      {
        title: 'VODS',
        description: 'Créer et suivre vos Visites Observation & Ronde',
        image: 'form.png',
        href: '/vods',
      },
      {
        title: 'Statistiques HSE',
        description: 'Soumettre et suivre vos statistiques HSE',
        image: 'stat.png',
         href: '/epi-requests',
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
      image: 'agreement.png',
      href: '/hse-responsible/permis',
      badge: assignedPending,
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
        image: 'agreement.png',
        href: '/responsible-site/suivi-permis',
        badge: assignedPending,
      },
      {
        title: 'Ressources Matérielles',
        description: 'Gérez et suivez vos ressources matérielles',
        image: 'materiel.png',
        href: '/materiel',
        badge: materialPending,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-pink-200/25 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-yellow-200/20 rounded-full blur-2xl animate-pulse delay-700" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      {/* Modern Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl border-b border-blue-200/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo & Brand */}
              <div className="flex items-center space-x-4 ml-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <div className="w-30 h-12 flex items-center justify-center overflow-hidden p-0">
                    <img 
                      src="/images/logo.png" 
                      alt="ParkX Logo" 
                      className="h-10 object-contain"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full animate-pulse" />
                </motion.div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-6">
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
                      <ShieldIcon className="w-4 h-4" />
                      <span>Dashboard Admin</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                )}

                {/* User Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-[#013b94] flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-slate-800">
                    <p className="text-sm font-medium">{user?.name || 'Utilisateur'}</p>
                    <p className="text-xs text-slate-600">ParkX</p>
                  </div>
                </motion.div>

                {/* Logout Button */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Link
                    href="/logout"
                    method="post"
                    className="group relative px-6 py-3 bg-[#0e5186] text-white rounded-xl hover:bg-[#0c3f66] transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="text-sm font-semibold">Déconnexion</span>
                    </div>
                  </Link>
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
        className="relative z-10 pt-16 pb-8 text-center"
      >
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Bienvenue dans votre espace ParkX
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 max-w-2xl mx-auto">
            Gérez vos projets, documents et permis de manière simple et efficace
          </p>
        </div>
      </motion.section>

      {/* Services Grid */}
      <section className="relative z-10 pb-20 px-6 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 60, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100
                }}
                style={{
                  transformStyle: "preserve-3d"
                }}
                className="group relative"
              >
                <Link href={card.href} className="block h-full">
                  <div className="group relative bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-8 flex flex-col items-center text-center justify-between hover:shadow-2xl hover:border-white/80 transition-all duration-500 overflow-hidden h-[340px] hover:bg-white/90">
                    {/* Animated Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Image Container with Bright Effect */}
                    <div className="relative mb-4">
                      <div
                        className="w-20 h-20 rounded-3xl flex items-center justify-center bg-white shadow-lg group-hover:shadow-xl transition-all duration-500 relative overflow-hidden"
                        style={{
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                        }}
                      >
                        {/* Image Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl" />
                        <img 
                          src={`/images/${card.image}`} 
                          alt={card.title}
                          className="w-12 h-12 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300" 
                        />
                        
                        {/* Animated Border */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/40 via-transparent to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      
                      {/* Floating Particles */}
                      <div className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                      <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-300" />
                    </div>

                    {/* Content with fixed height */}
                    <div className="flex-1 flex flex-col justify-center mb-4 min-h-[120px]">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 line-clamp-3">
                        {card.description}
                      </p>
                    </div>
                    
                    {/* Interactive Button */}
                    <div className="relative w-full mt-auto">
                      <span className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#013b94] text-white rounded-2xl text-sm font-semibold group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 shadow-lg group-hover:shadow-xl w-full">
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
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500" />
                    </div>

                    {/* Corner Accents */}
                    <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Badge */}
                    {typeof card.badge === 'number' && card.badge > 0 && (
                      <div className="absolute top-6 right-6 z-10">
                        <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold h-8 min-w-[32px] px-3 shadow-lg animate-pulse">
                          {card.badge > 99 ? '99+' : card.badge}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}