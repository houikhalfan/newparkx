import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import ContractantSidebar from '@/Components/ContractantSidebar';
import ContractantTopHeader from '@/Components/ContractantTopHeader';
import { 
  FileSignature, 
  Search, 
  PlusCircle,
  Shield,
  Excavator
} from 'lucide-react';

export default function PermisIndex() {
  const permitOptions = [
    {
      title: 'Suivis des permis',
      description: 'Consultez et suivez l\'état de vos permis existants',
      icon: Search,
      href: route('contractant.suivi-permis.index'),
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      iconBg: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      title: 'Permis D\'Excavation',
      description: 'Créez et soumettez un nouveau permis d\'excavation',
      icon: Excavator,
      href: route('contractant.permisexcavation.create'),
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      iconBg: 'from-orange-500/20 to-red-500/20'
    },
    {
      title: 'Permis de travail sécuritaire — Construction',
      description: 'Créez et soumettez un permis de travail sécuritaire',
      icon: Shield,
      href: route('contractant.permis.travail.securitaire'),
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'from-emerald-50 to-teal-50',
      iconBg: 'from-emerald-500/20 to-teal-500/20'
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden flex">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59,130,246,0.2) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Sidebar */}
        <ContractantSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <ContractantTopHeader 
            contractor={usePage().props.auth?.contractor}
            showBackButton={true}
            backRoute={route('contractant.home')}
            backLabel="Retour au tableau de bord"
          />

          <div className="relative z-10 px-6 pb-12 flex-1 pt-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl shadow-2xl mb-6">
                  <FileSignature className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Permis & Suivis
                  </span>
                </h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Gérez vos permis de travail et suivez leur statut en temps réel
                </p>
              </motion.div>

              {/* Permit Options Grid */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {permitOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <motion.div
                      key={option.title}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -8,
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={option.href}
                        className="block group"
                      >
                        <div className={`
                          relative bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl
                          hover:shadow-3xl transition-all duration-300 overflow-hidden
                          bg-gradient-to-br ${option.bgColor}
                        `}>
                          {/* Background Pattern */}
                          <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0" style={{
                              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)`,
                              backgroundSize: '20px 20px'
                            }} />
                          </div>

                          {/* Icon */}
                          <div className={`
                            relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6
                            bg-gradient-to-br ${option.iconBg} shadow-lg
                          `}>
                            <Icon className={`w-8 h-8 bg-gradient-to-br ${option.color} bg-clip-text text-transparent`} />
                          </div>

                          {/* Content */}
                          <div className="relative">
                            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors duration-300">
                              {option.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                              {option.description}
                            </p>
                          </div>

                          {/* Hover Effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="mt-16 text-center"
              >
                <div className="bg-white/80 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Besoin d'aide ?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Consultez la documentation ou contactez le support pour obtenir de l'aide avec vos permis.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
