import React, { useEffect, useMemo, useState } from "react";
import { usePage, Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { 
    Users, 
    Search, 
    Filter, 
    User, 
    Calendar, 
    Clock, 
    CheckCircle, 
    XCircle, 
    AlertCircle, 
    Eye, 
    FileText, 
    Building2, 
    Package,
    Edit3,
    Trash2,
    UserCheck,
    Hash,
    Plus,
    Save,
    Shield,
    Mail,
    MapPin,
    Settings,
    UserPlus,
    Building,
    CheckCircle2,
    X,
    ChevronRight,
    Sparkles
} from "lucide-react";

/* --- Enhanced table helpers with animations --- */
function Th({ children, className = "" }) {
  return (
        <th className={`px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
    return (
        <td className={`px-6 py-4 whitespace-nowrap ${className}`}>
            {children}
        </td>
    );
}

function FieldError({ id, children }) {
  if (!children) return null;
  return (
        <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            id={id}
            className="mt-1 text-xs text-red-600 dark:text-red-400"
        >
      {children}
        </motion.p>
  );
}

function HelperText({ children }) {
    return (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {children}
        </p>
    );
}

function StatusPill({ kind }) {
    const badges = {
        pending: {
            label: "En attente",
            className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
            icon: Clock
        },
        approved: {
            label: "Approuvé",
            className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            icon: CheckCircle
        },
        default: {
            label: "—",
            className: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
            icon: AlertCircle
        }
    };

    const badge = badges[kind] || badges.default;
    const Icon = badge.icon;

  return (
        <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${badge.className}`}
        >
            <Icon className="w-3 h-3" />
            {badge.label}
        </motion.span>
  );
}

function SegmentedTabs({ value, onChange, items }) {
  const setTab = (t) => {
    onChange?.(t);
    if (typeof window !== "undefined") {
      const base = window.location.pathname;
      const qs = new URLSearchParams(window.location.search);
      qs.set("tab", t);
      window.history.replaceState({}, "", `${base}?${qs.toString()}`);
    }
  };

  return (
        <div className="inline-flex rounded-2xl bg-slate-100 dark:bg-slate-700 p-1">
      {items.map((it) => (
                <motion.button
          key={it.value}
          onClick={() => setTab(it.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 text-sm rounded-xl font-medium transition-all ${
                        value === it.value 
                            ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg" 
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
        >
          {it.label}
                </motion.button>
      ))}
    </div>
  );
}

function SearchBar({ name, value, onChange, placeholder }) {
  return (
    <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      <input
        name={name}
        value={value}
        onChange={onChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        placeholder={placeholder}
      />
    </div>
  );
}

function AdminDashboard() {
  const {
    users = [],
    pendingContractors = [],
    approvedContractors = [],
    csrf_token,
    url,
    sites = [],
    errors = {},
    flash: _flash,
  } = usePage().props;
  const flash = _flash || {};
  
  // State for expandable contractor details
  const [expandedContractors, setExpandedContractors] = useState(new Set());
  const [contractorDetails, setContractorDetails] = useState({});

  // Function to toggle contractor details
  const toggleContractorDetails = async (contractorId) => {
    const newExpanded = new Set(expandedContractors);
    
    if (newExpanded.has(contractorId)) {
      // If already expanded, collapse it
      newExpanded.delete(contractorId);
      setExpandedContractors(newExpanded);
    } else {
      // If not expanded, fetch details and expand
      if (!contractorDetails[contractorId]) {
        try {
          const response = await fetch(route('admin.contractors.show', contractorId));
          const data = await response.json();
          setContractorDetails(prev => ({
            ...prev,
            [contractorId]: data.contractor
          }));
        } catch (error) {
          console.error('Error fetching contractor details:', error);
          Swal.fire({
            title: 'Erreur',
            text: 'Impossible de charger les détails du contractant.',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
          return;
        }
      }
      newExpanded.add(contractorId);
      setExpandedContractors(newExpanded);
    }
  };

    // Enhanced SweetAlert with better styling
  const fireSuccess = (message) =>
    Swal.fire({
      icon: "success",
      title: message,
      position: "center",
      showConfirmButton: false,
      timer: 1800,
      width: 520,
      iconColor: "#22c55e",
      backdrop: true,
            customClass: {
                popup: 'rounded-2xl',
                title: 'text-slate-900 dark:text-white'
            }
    });

  const fireError = (message) =>
    Swal.fire({
      icon: "error",
      title: message,
      position: "center",
      showConfirmButton: false,
      timer: 2200,
      width: 520,
      backdrop: true,
            customClass: {
                popup: 'rounded-2xl',
                title: 'text-slate-900 dark:text-white'
            }
    });

  useEffect(() => {
    if (flash?.success) fireSuccess(flash.success);
    if (flash?.error) fireError(flash.error);
  }, [flash?.success, flash?.error]);

    // Tab management
  const getTabFromUrl = () => {
    if (typeof window === "undefined") return "parkx";
    const qs = new URLSearchParams(window.location.search);
    return qs.get("tab") || "parkx";
  };
  const [activeTab, setActiveTab] = useState(getTabFromUrl());
  useEffect(() => setActiveTab(getTabFromUrl()), [url]);

    // Filters
  const [q, setQ] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [contractorFilter, setContractorFilter] = useState("all");

  const siteNameFor = (u) =>
    u?.site?.name ?? (u?.site_id ? (sites.find((s) => s.id === u.site_id)?.name || "—") : "—");

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const text = `${u.name} ${u.email} ${siteNameFor(u)}`.toLowerCase();
      const okQ = text.includes(q.toLowerCase());
      const okSite = siteFilter ? String(u.site_id || "") === String(siteFilter) : true;
      return okQ && okSite;
    });
  }, [users, q, siteFilter]);

  const rowsContractors = useMemo(() => {
    const pending = (pendingContractors || []).map((c) => ({ ...c, kind: "pending" }));
    const approved = (approvedContractors || []).map((c) => ({ ...c, kind: "approved" }));
    let merged = [];
    if (contractorFilter === "all" || contractorFilter === "pending") merged = merged.concat(pending);
    if (contractorFilter === "all" || contractorFilter === "approved") merged = merged.concat(approved);
    if (q) {
      merged = merged.filter((r) =>
        `${r.name} ${r.email} ${r.company_name || ""}`.toLowerCase().includes(q.toLowerCase())
      );
    }
    return merged.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }, [pendingContractors, approvedContractors, contractorFilter, q]);

  return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
            {/* Enhanced Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl animate-pulse" />
            </div>

            <div className="relative z-10 p-6 md:p-8">
                {/* Enhanced Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-12"
                >
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl mb-6"
                        >
                            <Users className="w-10 h-10 text-white" />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-5xl md:text-6xl font-black bg-gradient-to-r from-slate-900 via-blue-900 via-purple-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:via-purple-100 dark:to-indigo-100 bg-clip-text text-transparent mb-4"
                        >
                            Gestion des Comptes
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="text-xl text-slate-600 dark:text-slate-300 font-medium"
                        >
                            Gérer les comptes ParkX et contractants avec style
                        </motion.p>
                    </div>

                    {/* Enhanced Tab Navigation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="flex justify-center"
                    >
                        <div className="inline-flex rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-2 shadow-2xl">
                            {[
                                { value: "parkx", label: "Comptes ParkX", icon: Users },
                                { value: "contractors", label: "Comptes Contractants", icon: Building }
                            ].map((item) => {
                                const Icon = item.icon;
                                return (
                                    <motion.button
                                        key={item.value}
                                        onClick={() => setActiveTab(item.value)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`relative px-8 py-4 text-sm rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                                            activeTab === item.value
                                                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.label}
                                        {activeTab === item.value && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl -z-10"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                </motion.div>

                    <AnimatePresence mode="wait">
                        {/* PARKX TAB */}
      {activeTab === "parkx" && (
                            <motion.div
                                key="parkx"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-8"
                            >
                                {/* Enhanced Create User Form */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-indigo-900/20" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
                                    <div className="relative p-8 md:p-10">
                                        <div className="text-center mb-8">
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl mb-4"
                                            >
                                                <UserPlus className="w-8 h-8 text-white" />
                                            </motion.div>
                                            <h2 className="text-3xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-2">
                                                Créer un compte ParkX
                                            </h2>
                                            <p className="text-slate-600 dark:text-slate-400 font-medium">
                                                Ajoutez un nouvel utilisateur au système
                                            </p>
                                        </div>

                                        <form method="POST" action={route("admin.users.store")} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <input type="hidden" name="_token" value={csrf_token} />

                {/* Nom */}
                <div className="md:col-span-3">
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3" htmlFor="name">
                                                    Nom complet
                                                </label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Nom complet"
                                                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
                                                            errors.name ? "border-red-500 focus:ring-red-500/20" : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                    }`}
                    required
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "err-name" : undefined}
                  />
                                                </div>
                  <FieldError id="err-name">{errors.name}</FieldError>
                </div>

                {/* Site */}
                <div className="md:col-span-3">
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2" htmlFor="site_id">
                                                    Site
                                                </label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <select
                    id="site_id"
                    name="site_id"
                                                        className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                            errors.site_id ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                    }`}
                    defaultValue=""
                    aria-invalid={!!errors.site_id}
                    aria-describedby={errors.site_id ? "err-site" : undefined}
                  >
                    <option value="">— Aucun —</option>
                    {sites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                                                </div>
                  <FieldError id="err-site">{errors.site_id}</FieldError>
                </div>

                {/* Email */}
                <div className="md:col-span-3">
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2" htmlFor="email">
                                                    Email
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                                                        className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                            errors.email ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                    }`}
                    required
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "err-email" : undefined}
                  />
                                                </div>
                  <FieldError id="err-email">{errors.email}</FieldError>
                </div>

                {/* Mot de passe */}
                <div className="md:col-span-3">
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2" htmlFor="password">
                                                    Mot de passe
                                                </label>
                                                <div className="relative">
                                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    minLength={8}
                    title="Au moins 8 caractères"
                                                        className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                            errors.password ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                    }`}
                    required
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "err-password" : "help-password"}
                  />
                                                </div>
                  {!errors.password && <HelperText>Au moins 8 caractères.</HelperText>}
                  <FieldError id="err-password">{errors.password}</FieldError>
                </div>

                {/* Confirmation */}
                <div className="md:col-span-6">
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2" htmlFor="password_confirmation">
                    Confirmer le mot de passe
                  </label>
                                                <div className="relative">
                                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirmer"
                    minLength={8}
                    title="Répétez le mot de passe (au moins 8 caractères)"
                                                        className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                            errors.password_confirmation ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                    }`}
                    required
                    aria-invalid={!!errors.password_confirmation}
                    aria-describedby={errors.password_confirmation ? "err-password_confirmation" : undefined}
                  />
                                                </div>
                  <FieldError id="err-password_confirmation">{errors.password_confirmation}</FieldError>
                </div>

                                            {/* Admin Access Toggle */}
                <div className="md:col-span-6 flex flex-col justify-end">
                                                <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      name="as_admin"
                      value="1"
                                                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                                                    <span>Donner l'accès au tableau de bord Admin</span>
                  </label>
                  <HelperText>
                    Crée / met à jour un compte <strong>Admin</strong> avec le même email et mot de passe.
                  </HelperText>
                </div>

                                            {/* Enhanced Submit Button */}
                                            <div className="md:col-span-12 flex justify-center">
                                                <motion.button
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                    type="submit"
                                                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white rounded-2xl hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 transition-all duration-300 font-bold text-lg shadow-2xl overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    <motion.div
                                                        whileHover={{ rotate: 360 }}
                                                        transition={{ duration: 0.6 }}
                                                        className="relative z-10"
                                                    >
                                                        <UserPlus className="w-6 h-6" />
                                                    </motion.div>
                                                    <span className="relative z-10">Créer l'utilisateur</span>
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                        initial={false}
                                                    />
                                                </motion.button>
                </div>
              </form>
            </div>
                                </motion.div>

                                {/* Enhanced Search & Filters */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50 dark:from-emerald-900/20 dark:via-teal-900/10 dark:to-cyan-900/20" />
                                    <div className="relative p-8">
                                        <div className="text-center mb-8">
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl mb-4"
                                            >
                                                <Search className="w-7 h-7 text-white" />
                                            </motion.div>
                                            <h2 className="text-2xl font-black bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 dark:from-white dark:via-emerald-100 dark:to-teal-100 bg-clip-text text-transparent mb-2">
                                                Recherche et filtres
                                            </h2>
                                            <p className="text-slate-600 dark:text-slate-400 font-medium">
                                                Trouvez rapidement les utilisateurs
                                            </p>
          </div>

                                        <form onSubmit={(e) => e.preventDefault()} className="flex flex-wrap items-center gap-4">
                                            <SearchBar
                                                name="q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher (nom, email, site)…"
              />
              <select
                value={siteFilter}
                onChange={(e) => setSiteFilter(e.target.value)}
                                                className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                title="Filtrer par site"
              >
                <option value="">Tous les sites</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="inline-flex items-center gap-2 px-4 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-all font-medium"
                                            >
                                                <Filter className="w-4 h-4" />
                Filtrer
                                            </motion.button>
            </form>
          </div>
                                </motion.div>

                                {/* Users Table */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10" />
                                    <div className="relative overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead>
                                                <tr className="border-b border-slate-200 dark:border-slate-700">
                    <Th>Nom</Th>
                    <Th>Email</Th>
                    <Th>Site</Th>
                    <Th>VODs à rendre</Th>
                    <Th>Créé le</Th>
                                                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                {filteredUsers.length === 0 ? (
                                                    <motion.tr
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="text-center"
                                                    >
                                                        <td colSpan={6} className="px-6 py-12 text-slate-500 dark:text-slate-400">
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ delay: 0.2, type: "spring" }}
                                                                className="flex flex-col items-center gap-4"
                                                            >
                                                                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full">
                                                                    <Users className="w-8 h-8 text-slate-400" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                                                                        Aucun utilisateur trouvé
                                                                    </h3>
                                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                        Les nouveaux utilisateurs apparaîtront ici
                                                                    </p>
                                                                </div>
                                                            </motion.div>
                      </td>
                                                    </motion.tr>
                                                ) : (
                                                    filteredUsers.map((u, idx) => (
                                                        <motion.tr
                      key={u.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: idx * 0.1, duration: 0.4 }}
                                                            whileHover={{ scale: 1.01 }}
                                                            className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
                                                        >
                                                            <Td>
                                                                <div className="flex items-center gap-3">
                                                                    <motion.div
                                                                        whileHover={{ scale: 1.1 }}
                                                                        className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg"
                                                                    >
                                                                        <span className="text-white font-bold text-sm">
                                                                            {u.name.charAt(0)}
                                                                        </span>
                                                                    </motion.div>
                                                                    <div>
                                                                        <div className="font-semibold text-slate-900 dark:text-white">
                                                                            {u.name}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Td>
                                                            <Td>
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Mail className="w-4 h-4" />
                                                                    <span className="text-sm">{u.email}</span>
                                                                </div>
                                                            </Td>
                                                            <Td>
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Building2 className="w-4 h-4" />
                                                                    <span className="text-sm">{siteNameFor(u)}</span>
                                                                </div>
                                                            </Td>
                                                            <Td>
                                                                <form method="POST" action={route("admin.users.update-quota", u.id)} className="flex items-center gap-2">
                          <input type="hidden" name="_token" value={csrf_token} />
                          <input
                            type="number"
                            name="vods_quota"
                            min="0"
                            defaultValue={u.vods_quota ?? 0}
                                                                        className="w-24 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                            type="submit"
                                                                        className="inline-flex items-center gap-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium transition-all"
                            title="Mettre à jour les VODs à rendre"
                          >
                                                                        <Save className="w-3 h-3" />
                            Sauvegarder
                                                                    </motion.button>
                        </form>
                      </Td>
                                                            <Td>
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Calendar className="w-4 h-4" />
                                                                    <span className="text-sm">
                                                                        {new Date(u.created_at).toLocaleDateString("fr-FR")}
                                                                    </span>
                                                                </div>
                                                            </Td>
                                                            <Td className="text-right">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={async () => {
                            const res = await Swal.fire({
                              title: "Supprimer cet utilisateur ?",
                              text: "Cette action est irréversible.",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Oui, supprimer",
                              cancelButtonText: "Annuler",
                              confirmButtonColor: "#dc2626",
                                                                            customClass: {
                                                                                popup: 'rounded-2xl',
                                                                                title: 'text-slate-900 dark:text-white'
                                                                            }
                            });
                            if (res.isConfirmed) {
                              document.getElementById(`delete-user-${u.id}`).submit();
                            }
                          }}
                                                                    className="inline-flex items-center gap-1 px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium transition-all"
                        >
                                                                    <Trash2 className="w-3 h-3" />
                          Supprimer
                                                                </motion.button>

                        <form
                          id={`delete-user-${u.id}`}
                          method="POST"
                          action={route("admin.users.delete", u.id)}
                          className="hidden"
                        >
                          <input type="hidden" name="_token" value={csrf_token} />
                        </form>
                      </Td>
                                                        </motion.tr>
                                                    ))
                                                )}
                </tbody>
              </table>
            </div>
                                </motion.div>
                            </motion.div>
      )}

                        {/* CONTRACTORS TAB */}
      {activeTab === "contractors" && (
                            <motion.div
                                key="contractors"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-8"
                            >
                                {/* Search & Filters */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10" />
                                    <div className="relative p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <motion.div
                                                whileHover={{ rotate: 5 }}
                                                className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg"
                                            >
                                                <Search className="w-5 h-5 text-white" />
                                            </motion.div>
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recherche et filtres</h2>
                                        </div>
                                        
                                        <form onSubmit={(e) => e.preventDefault()} className="flex flex-wrap items-center gap-4">
              <SearchBar
                name="q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher (nom, email, entreprise)…"
              />
              <select
                value={contractorFilter}
                onChange={(e) => setContractorFilter(e.target.value)}
                                                className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                title="Filtrer par statut"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvé</option>
              </select>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="inline-flex items-center gap-2 px-4 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-all font-medium"
                                            >
                                                <Filter className="w-4 h-4" />
                Filtrer
                                            </motion.button>
            </form>
          </div>
                                </motion.div>

                                {/* Contractors Table */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10" />
                                    <div className="relative overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead>
                                                <tr className="border-b border-slate-200 dark:border-slate-700">
                    <Th>Nom</Th>
                    <Th>Email</Th>
                    <Th>Entreprise</Th>
                    <Th>Statut</Th>
                    <Th>Créé le</Th>
                                                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                {rowsContractors.length === 0 ? (
                                                    <motion.tr
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="text-center"
                                                    >
                                                        <td colSpan={6} className="px-6 py-12 text-slate-500 dark:text-slate-400">
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ delay: 0.2, type: "spring" }}
                                                                className="flex flex-col items-center gap-4"
                                                            >
                                                                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full">
                                                                    <Building className="w-8 h-8 text-slate-400" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                                                                        Aucun contractant trouvé
                                                                    </h3>
                                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                        Les nouveaux contractants apparaîtront ici
                                                                    </p>
                                                                </div>
                                                            </motion.div>
                      </td>
                                                    </motion.tr>
                                                ) : (
                                                    rowsContractors.map((r, idx) => (
                                                        <React.Fragment key={`${r.kind}-${r.id}`}>
                                                        <motion.tr
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: idx * 0.1, duration: 0.4 }}
                                                            whileHover={{ scale: 1.01 }}
                                                            className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
                                                        >
                                                            <Td>
                                                                <div className="flex items-center gap-3">
                                                                    <motion.div
                                                                        whileHover={{ scale: 1.1 }}
                                                                        className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg"
                                                                    >
                                                                        <span className="text-white font-bold text-sm">
                                                                            {r.name.charAt(0)}
                                                                        </span>
                                                                    </motion.div>
                                                                    <div>
                                                                        <div className="font-semibold text-slate-900 dark:text-white">
                                                                            {r.name}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Td>
                                                            <Td>
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Mail className="w-4 h-4" />
                                                                    <span className="text-sm">{r.email}</span>
                                                                </div>
                                                            </Td>
                                                            <Td>
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Building className="w-4 h-4" />
                                                                    <span className="text-sm">{r.company_name || "—"}</span>
                                                                </div>
                                                            </Td>
                                                            <Td>
                                                                <StatusPill kind={r.kind} />
                                                            </Td>
                                                            <Td>
                                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                                    <Calendar className="w-4 h-4" />
                                                                    <span className="text-sm">
                                                                        {r.created_at ? new Date(r.created_at).toLocaleDateString("fr-FR") : "—"}
                                                                    </span>
                                                                </div>
                                                            </Td>
                                                            <Td className="text-right">
                        {r.kind === "pending" ? (
                          <div className="inline-flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => toggleContractorDetails(r.id)}
                              className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                expandedContractors.has(r.id)
                                  ? 'bg-blue-200 hover:bg-blue-300 dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-700 dark:text-blue-200'
                                  : 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                              }`}
                              title={expandedContractors.has(r.id) ? 'Masquer les détails' : 'Voir les détails du contractant'}
                            >
                              <Eye className="w-3 h-3" />
                              {expandedContractors.has(r.id) ? 'Masquer' : 'Voir Details'}
                            </motion.button>
                            <form method="POST" action={route("admin.contractors.approve", r.id)}>
                              <input type="hidden" name="_token" value={csrf_token} />
                                                                            <motion.button
                                                                                whileHover={{ scale: 1.05 }}
                                                                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                                                                className="inline-flex items-center gap-1 px-3 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg text-xs font-medium transition-all"
                              >
                                                                                <CheckCircle2 className="w-3 h-3" />
                                Approuver
                                                                            </motion.button>
                            </form>
                            <form method="POST" action={route("admin.contractors.reject", r.id)}>
                              <input type="hidden" name="_token" value={csrf_token} />
                                                                            <motion.button
                                                                                whileHover={{ scale: 1.05 }}
                                                                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                                                                className="inline-flex items-center gap-1 px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium transition-all"
                              >
                                                                                <X className="w-3 h-3" />
                                Rejeter
                                                                            </motion.button>
                            </form>
                          </div>
                        ) : (
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={async () => {
                                const res = await Swal.fire({
                                  title: "Supprimer ce contractant ?",
                                  text: "Cette action est irréversible.",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonText: "Oui, supprimer",
                                  cancelButtonText: "Annuler",
                                  confirmButtonColor: "#dc2626",
                                                                                customClass: {
                                                                                    popup: 'rounded-2xl',
                                                                                    title: 'text-slate-900 dark:text-white'
                                                                                }
                                });
                                if (res.isConfirmed) {
                                  document.getElementById(`delete-contractor-${r.id}`).submit();
                                }
                              }}
                                                                        className="inline-flex items-center gap-1 px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium transition-all"
                            >
                                                                        <Trash2 className="w-3 h-3" />
                              Supprimer
                                                                    </motion.button>
                                                                )}

                            <form
                              id={`delete-contractor-${r.id}`}
                              method="POST"
                              action={route("admin.contractors.delete", r.id)}
                              className="hidden"
                            >
                              <input type="hidden" name="_token" value={csrf_token} />
                            </form>
                                                            </Td>
                                                        </motion.tr>
                                                        
                                                        {/* Expandable Details Section */}
                                                        {expandedContractors.has(r.id) && contractorDetails[r.id] && (
                                                          <motion.tr
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="bg-blue-50 dark:bg-blue-900/10"
                                                          >
                                                            <td colSpan={6} className="px-6 py-6">
                                                              <motion.div
                                                                initial={{ y: -10 }}
                                                                animate={{ y: 0 }}
                                                                transition={{ delay: 0.1 }}
                                                                className="bg-white dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-blue-700 p-6 shadow-sm"
                                                              >
                                                                <div className="flex items-center gap-3 mb-4">
                                                                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                                    <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                                  </div>
                                                                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                                    Détails du Contractant
                                                                  </h3>
                                                                </div>
                                                                
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                  <div className="space-y-4">
                                                                    <div>
                                                                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                                                        Nom complet
                                                                      </label>
                                                                      <p className="text-slate-900 dark:text-white font-medium">
                                                                        {contractorDetails[r.id].name}
                                                                      </p>
                                                                    </div>
                                                                    
                                                                    <div>
                                                                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                                                        Email
                                                                      </label>
                                                                      <p className="text-slate-900 dark:text-white">
                                                                        {contractorDetails[r.id].email}
                                                                      </p>
                                                                    </div>
                                                                    
                                                                    <div>
                                                                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                                                        Téléphone
                                                                      </label>
                                                                      <p className="text-slate-900 dark:text-white">
                                                                        {contractorDetails[r.id].phone || 'Non spécifié'}
                                                                      </p>
                                                                    </div>
                                                                  </div>
                                                                  
                                                                  <div className="space-y-4">
                                                                    <div>
                                                                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                                                        Entreprise
                                                                      </label>
                                                                      <p className="text-slate-900 dark:text-white">
                                                                        {contractorDetails[r.id].company_name || 'Non spécifiée'}
                                                                      </p>
                                                                    </div>
                                                                    
                                                                    <div>
                                                                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                                                        Rôle
                                                                      </label>
                                                                      <p className="text-slate-900 dark:text-white">
                                                                        {contractorDetails[r.id].role || 'Non spécifié'}
                                                                      </p>
                                                                    </div>
                                                                    
                                                                    <div>
                                                                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                                                        Projet assigné
                                                                      </label>
                                                                      <p className="text-slate-900 dark:text-white">
                                                                        {contractorDetails[r.id].project_name || 'Aucun projet assigné'}
                                                                      </p>
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                                
                                                                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                                  <div className="flex items-center justify-between">
                                                                    <div>
                                                                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                                                        Date de demande
                                                                      </label>
                                                                      <p className="text-slate-900 dark:text-white">
                                                                        {new Date(contractorDetails[r.id].created_at).toLocaleDateString('fr-FR', { 
                                                                          year: 'numeric', 
                                                                          month: 'long', 
                                                                          day: 'numeric',
                                                                          hour: '2-digit',
                                                                          minute: '2-digit'
                                                                        })}
                                                                      </p>
                                                                    </div>
                                                                    
                                                                    <div className="flex items-center gap-2">
                                                                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                        contractorDetails[r.id].is_approved 
                                                                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                                          : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                                      }`}>
                                                                        {contractorDetails[r.id].is_approved ? 'Approuvé' : 'En attente'}
                                                                      </span>
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                              </motion.div>
                                                            </td>
                                                          </motion.tr>
                                                        )}
                                                        </React.Fragment>
                                                    ))
                        )}
                </tbody>
              </table>
            </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
          </div>
    </div>
  );
}

AdminDashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;

export default AdminDashboard;