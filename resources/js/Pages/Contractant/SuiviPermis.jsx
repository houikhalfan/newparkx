import React from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Calendar, FileText, Eye, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import ContractantSidebar from '@/Components/ContractantSidebar';
import ContractantTopHeader from '@/Components/ContractantTopHeader';

export default function SuiviPermis({ permis = [], filters, contractor }) {
  const { flash } = usePage().props;
  
  // Provide default values for filters if they're undefined
  const safeFilters = filters || {};
  const [search, setSearch] = React.useState(safeFilters.search || '');
  const [statusFilter, setStatusFilter] = React.useState(safeFilters.status || '');

  const handleSearch = (e) => {
    setSearch(e.target.value);
    
    // Trigger search immediately
    router.get(route('contractant.permis'), {
      search: e.target.value,
      status: statusFilter,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    
    // Trigger filter immediately
    router.get(route('contractant.permis'), {
      search: search,
      status: e.target.value,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    router.get(route('contractant.permis'));
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'en_attente':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'en_cours':
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
      case 'signe':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'rejete':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'en_attente':
        return "En attente";
      case 'en_cours':
        return "En cours";
      case 'signe':
        return "Signé";
      case 'rejete':
        return "Rejeté";
      default:
        return "—";
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'en_attente':
        return "text-yellow-300";
      case 'en_cours':
        return "text-blue-300";
      case 'signe':
        return "text-green-300";
      case 'rejete':
        return "text-red-300";
      default:
        return "text-gray-300";
    }
  };

  return (
    <>
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

          {/* Success Message */}
          <AnimatePresence>
            {flash?.success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative z-10 px-6 mb-6"
              >
                <div className="max-w-7xl mx-auto">
                  <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-4 flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-green-400" />
                    <p className="text-green-300 font-medium">{flash.success}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="relative z-10 px-6 pb-12">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    Suivi des Permis
                  </span>
                </h1>
                <p className="text-gray-300 text-lg">Consultez l'état de vos demandes de permis</p>
              </motion.div>

              {/* Search Section */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl mb-8 max-w-4xl mx-auto"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rechercher
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Rechercher par numéro ou site..."
                        className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Statut
                    </label>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={handleStatusFilter}
                        className="w-full pl-3 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300 text-sm appearance-none"
                      >
                        <option value="">Tous les statuts</option>
                        <option value="en_attente">En attente</option>
                        <option value="en_cours">En cours</option>
                        <option value="signe">Signé</option>
                        <option value="rejete">Rejeté</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearFilters}
                      className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm text-sm"
                    >
                      Effacer
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Permis Table */}
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
                {permis.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                      <thead className="text-xs uppercase bg-white/5 backdrop-blur-sm">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Type</th>
                          <th className="px-6 py-4 font-semibold">N° Permis</th>
                          <th className="px-6 py-4 font-semibold">Site</th>
                          <th className="px-6 py-4 font-semibold">Date</th>
                          <th className="px-6 py-4 font-semibold">Statut</th>
                          <th className="px-6 py-4 font-semibold text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {permis.map((p, index) => (
                          <motion.tr 
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group hover:bg-white/5 transition-all duration-300"
                          >
                            <td className="px-6 py-4">Permis d'Excavation</td>
                            <td className="px-6 py-4 font-medium">{p.numero_permis || "—"}</td>
                            <td className="px-6 py-4">{p.site ? p.site.name : "—"}</td>
                            <td className="px-6 py-4">
                              {p.created_at
                                ? new Date(p.created_at).toLocaleDateString("fr-FR")
                                : "—"}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                {getStatusIcon(p.status)}
                                <span className={`ml-2 ${getStatusColor(p.status)}`}>
                                  {getStatusText(p.status)}
                                </span>
                              </div>
                            </td>
                           <td className="px-6 py-4 text-center">
  {p.status === "en_cours" ? (
    <span className="text-gray-400 font-medium cursor-not-allowed inline-flex items-center">
      <Eye className="w-4 h-4 mr-1" />
      Voir
    </span>
  ) : p.status === "signe" && p.pdf_signed ? (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <a
         href={`/storage/${p.pdf_signed}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-300 hover:text-green-200 font-medium inline-flex items-center transition-colors duration-300"
      >
        <FileText className="w-4 h-4 mr-1" />
        PDF
      </a>
    </motion.div>
  ) : (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        href={route("contractant.permisexcavation.show", p.id)}
        className="text-cyan-300 hover:text-cyan-200 font-medium inline-flex items-center transition-colors duration-300"
      >
        <Eye className="w-4 h-4 mr-1" />
        Voir
      </Link>
    </motion.div>
  )}
</td>

                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="p-4 bg-white/5 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Aucun permis</h3>
                    <p className="text-gray-400">Aucun permis n'a été soumis pour le moment.</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}