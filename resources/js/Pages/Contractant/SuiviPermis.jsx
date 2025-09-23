import React from "react";
import { usePage, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import ContractantSidebar from '@/Components/ContractantSidebar';
import ContractantTopHeader from '@/Components/ContractantTopHeader';

export default function SuiviPermis({ permis = [], filters, contractor }) {
  const { flash } = usePage().props;
  
  const safeFilters = filters || {};
  const [search, setSearch] = React.useState(safeFilters.search || '');
  const [statusFilter, setStatusFilter] = React.useState(safeFilters.status || '');

  const handleSearch = (e) => {
    setSearch(e.target.value);
    router.get(route('contractant.permis'), {
      search: e.target.value,
      status: statusFilter,
    }, { preserveState: true, replace: true });
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    router.get(route('contractant.permis'), {
      search: search,
      status: e.target.value,
    }, { preserveState: true, replace: true });
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    router.get(route('contractant.permis'));
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'en_attente': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'en_cours': return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'signe': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejete': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'en_attente': return "En attente";
      case 'en_cours': return "En cours";
      case 'signe': return "Signé";
      case 'rejete': return "Rejeté";
      default: return "—";
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'en_attente': return "text-yellow-600";
      case 'en_cours': return "text-blue-600";
      case 'signe': return "text-green-600";
      case 'rejete': return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getPermitTypeLabel = (permis) => {
    return permis.type_label || "Permis d'Excavation";
  };

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
                  <div className="bg-green-50 backdrop-blur-sm border border-green-200 rounded-xl p-4 flex items-center space-x-3 shadow-lg">
                    <FileText className="w-5 h-5 text-green-600" />
                    <p className="text-green-700 font-medium">{flash.success}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="relative z-10 px-6 pb-12 pt-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center mb-16"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Suivi des Permis
                  </span>
                </h1>
                <p className="text-gray-600 text-lg">Consultez l'état de vos demandes de permis</p>
              </motion.div>

              {/* Search Section */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-8 max-w-4xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rechercher
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Rechercher par numéro ou site..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 text-sm font-medium shadow-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Statut
                    </label>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={handleStatusFilter}
                        className="w-full pl-3 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 text-sm appearance-none"
                        style={{ colorScheme: 'light' }}
                      >
                        <option value="">Tous les statuts</option>
                        <option value="en_attente">En attente</option>
                        <option value="en_cours">En cours</option>
                        <option value="signe">Signé</option>
                        <option value="rejete">Rejeté</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearFilters}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl"
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
                className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                {permis.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700">
                      <thead className="text-xs uppercase bg-white/80 backdrop-blur-sm border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 font-semibold text-gray-700">Type</th>
                          <th className="px-6 py-4 font-semibold text-gray-700">N° Permis</th>
                          <th className="px-6 py-4 font-semibold text-gray-700">Site</th>
                          <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                          <th className="px-6 py-4 font-semibold text-gray-700">Statut</th>
                          <th className="px-6 py-4 font-semibold text-center text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {permis.map((p, index) => (
                          <motion.tr 
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group hover:bg-blue-50/50 transition-all duration-300"
                          >
                            <td className="px-6 py-4 text-gray-800 font-medium">
                              {getPermitTypeLabel(p)}
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-800">{p.numero_permis || "—"}</td>
                            <td className="px-6 py-4 text-gray-700">{p.site ? p.site.name : "—"}</td>
                            <td className="px-6 py-4 text-gray-700">
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
                              {p.status === "signe" && p.pdf_signed ? (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <a
                                    href={`/storage/${p.pdf_signed}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-700 font-medium inline-flex items-center transition-colors duration-300"
                                  >
                                    <FileText className="w-4 h-4 mr-1" />
                                    PDF
                                  </a>
                                </motion.div>
                              ) : (
                                <span className="text-gray-500 font-medium inline-flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  Pas encore signé
                                </span>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="p-4 bg-blue-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <FileText className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun permis</h3>
                    <p className="text-gray-600">Aucun permis n'a été soumis pour le moment.</p>
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