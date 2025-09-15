// resources/js/Pages/Admin/Home.jsx
import React, { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/Layouts/AdminLayout";
import {
  Users as UsersIcon,
  ClipboardList,
  CheckCircle2,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Activity,
  Clock,
  AlertCircle,
  Download,
  BarChart3,
  Zap,
  Shield,
  Eye,
  ChevronRight,
  Sparkles,
  Target,
  Award,
} from "lucide-react";

function AdminHome() {
  const { stats = {}, recentLogins = [], pendingApprovals = [], pendingCount = 0 } = usePage().props;
  const [isLoaded, setIsLoaded] = useState(false);

  const completion = stats.vods_due > 0 ? Math.round((stats.vods_done / stats.vods_due) * 100) : 0;

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse" />
      </div>

      <div className="relative z-10 p-6 md:p-8">
        {/* Enhanced Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg"
                >
                  <BarChart3 className="w-6 h-6 text-white" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                  Tableau de bord
                </h1>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
            Vue globale des métriques et activités de ParkX
          </p>
        </div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
        <Link
          href="#"
                className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-900 to-blue-900 hover:from-blue-900 hover:to-indigo-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Download className="w-5 h-5" />
                <span>Générer un rapport</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced KPI Cards with Staggered Animation */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <AnimatePresence>
            {isLoaded && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
                >
                  <EnhancedStatCard
                    title="Comptes ParkX"
                    value={stats.users ?? 0}
                    delta={stats.delta_users}
                    Icon={UsersIcon}
                    color="from-blue-500 to-cyan-500"
                    bgColor="from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 100 }}
                >
                  <EnhancedStatCard
                    title="Contractants"
                    value={stats.contractors ?? 0}
                    delta={stats.delta_contractors}
                    Icon={ClipboardList}
                    color="from-emerald-500 to-teal-500"
                    bgColor="from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
                  />
                </motion.div>
                <motion.div
  initial={{ opacity: 0, y: 30, scale: 0.9 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ delay: 0.5, duration: 0.5, type: "spring", stiffness: 100 }}
>
  <EnhancedStatCard
    title="Sites"
    value={stats.sites ?? 0}
    Icon={Target}
    color="from-indigo-500 to-blue-500"
    bgColor="from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20"
  />
</motion.div>

<motion.div
  initial={{ opacity: 0, y: 30, scale: 0.9 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ delay: 0.6, duration: 0.5, type: "spring", stiffness: 100 }}
>
  <EnhancedStatCard
    title="Projets"
    value={stats.projects ?? 0}
    Icon={ClipboardList}
    color="from-pink-500 to-rose-500"
    bgColor="from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20"
  />
</motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 100 }}
                >
                  <EnhancedStatCard
                    title={`VODs à rendre ${stats.month_label ? `(${stats.month_label})` : ""}`}
                    value={stats.vods_due ?? 0}
                    delta={stats.delta_vods_due}
                    Icon={CalendarDays}
                    color="from-amber-500 to-orange-500"
                    bgColor="from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5, type: "spring", stiffness: 100 }}
                >
                  <EnhancedStatCard
                    title="VODs complétés"
                    value={stats.vods_done ?? 0}
                    delta={stats.delta_vods_done}
                    Icon={CheckCircle2}
                    color="from-purple-500 to-pink-500"
                    bgColor="from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Enhanced VOD Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-8"
        >
          <EnhancedVodProgressCard
          monthLabel={stats.month_label}
          done={stats.vods_done ?? 0}
          due={stats.vods_due ?? 0}
          completion={completion}
          />
        </motion.div>

        {/* Enhanced Two Columns with Animation */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Enhanced Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <EnhancedActivityCard
              title="Activité récente"
              subtitle="Dernières connexions des utilisateurs"
              data={recentLogins}
              emptyMessage="Aucune connexion récente."
              linkText="Gérer les utilisateurs"
              linkHref={route("admin.dashboard")}
              icon={Activity}
              color="from-blue-500 to-cyan-500"
            />
          </motion.div>

          {/* Enhanced Pending Approvals */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <EnhancedActivityCard
              title="Approbations en attente"
              subtitle="Comptes contractants en attente de validation"
              data={pendingApprovals}
              emptyMessage="Tout est à jour."
              linkText="Voir tout"
              linkHref={`${route("admin.dashboard")}?tab=contractors`}
              icon={AlertCircle}
              color="from-amber-500 to-orange-500"
              badge={pendingCount}
            />
          </motion.div>
        </motion.section>

        {/* Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Actions rapides</h2>
            <p className="text-slate-600 dark:text-slate-300">Accédez rapidement aux fonctionnalités principales</p>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickActionCard
              title="Gestion des sites"
              description="Créer et gérer les sites industriels"
              icon={Target}
              href={route("admin.sites.index")}
              color="from-blue-500 to-indigo-500"
            />
            <QuickActionCard
              title="Statistiques HSE"
              description="Consulter les rapports de sécurité"
              icon={Shield}
              href={route("admin.hse-statistics.index")}
              color="from-emerald-500 to-teal-500"
            />
            <QuickActionCard
              title="Documents"
              description="Gérer la documentation"
              icon={Eye}
              href={route("admin.documents.index")}
              color="from-purple-500 to-pink-500"
            />
          </div>
        </motion.div>
        </div>
    </div>
  );
}

/* ---------- Enhanced Components ---------- */
function EnhancedStatCard({ title, value, delta, Icon, color, bgColor }) {
  const isNumber = typeof delta === "number";
  const positive = isNumber ? delta >= 0 : null;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${bgColor} border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
      
      <div className="relative p-6">
        {/* Header with icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      </div>
          <motion.div
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
            className={`p-2 rounded-xl bg-gradient-to-r ${color} shadow-lg`}
          >
            <Icon className="w-5 h-5 text-white" />
          </motion.div>
      </div>

        {/* Value with animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2"
        >
          {formatNumber(value)}
        </motion.div>

        {/* Delta indicator */}
        {isNumber && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              positive 
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" 
                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
            }`}
          >
            {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(delta)}% vs mois dernier
          </motion.div>
      )}
    </div>
    </motion.div>
  );
}

function EnhancedVodProgressCard({ monthLabel, done, due, completion }) {
  const color = completion >= 80 ? "from-emerald-500 to-green-500" : 
                completion >= 40 ? "from-amber-500 to-orange-500" : 
                "from-rose-500 to-pink-500";

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10" />
      
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg"
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </motion.div>
        <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Progression VOD — {monthLabel || "-"}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
            {done} / {due} complétés
          </p>
            </div>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}
          >
            {completion}%
          </motion.div>
        </div>

        {/* Progress bar with animation */}
        <div className="relative">
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, completion)}%` }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${color} rounded-full relative`}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </motion.div>
          </div>
          
          {/* Progress indicators */}
          <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EnhancedActivityCard({ title, subtitle, data, emptyMessage, linkText, linkHref, icon: Icon, color, badge }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 5 }}
              className={`p-2 rounded-xl bg-gradient-to-r ${color} shadow-lg`}
            >
              <Icon className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {title}
                {badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full"
                  >
                    {badge}
                  </motion.span>
                )}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {data.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
              <Icon className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400">{emptyMessage}</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {data.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {item.name || "—"}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.email}
                        {item.company_name ? ` • ${item.company_name}` : ""}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                    {item.last_login_at ? new Date(item.last_login_at).toLocaleString("fr-FR") : 
                     item.created_at ? new Date(item.created_at).toLocaleString("fr-FR") : "—"}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Footer link */}
        <motion.div
          whileHover={{ x: 5 }}
          className="mt-6 text-right"
        >
          <Link
            href={linkHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            {linkText}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

function QuickActionCard({ title, description, icon: Icon, href, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link
        href={href}
        className="block p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <div className="text-center">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${color} shadow-lg mb-4 group-hover:shadow-xl transition-shadow`}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
    </div>
      </Link>
    </motion.div>
  );
}

function formatNumber(n) {
  if (n == null) return "0";
  try {
    return new Intl.NumberFormat("fr-FR").format(n);
  } catch {
    return String(n);
  }
}

AdminHome.layout = (page) => <AdminLayout>{page}</AdminLayout>;
export default AdminHome;
