// resources/js/Layouts/AdminLayout.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Mail,
  Package,
  LogOut,
  Search,
  ChevronLeft,
  ChevronRight,
  Folder,
  BarChart3,
  Menu,
  X,
  Moon,
  Sun,
  Bell,
  Crown,
  Settings,
  User,
  MapPin,
  FileText,
  Shield,
  TrendingUp,
  Archive,
  AlertTriangle,
  FolderOpen
} from "lucide-react";
import AdminNotifications from "@/Components/AdminNotifications";

export default function AdminLayout({ children }) {
  const { csrf_token, admin } = usePage().props || {};
  const { url: currentUrl = "" } = usePage();

  // --------- helpers ----------
  const active = (pattern) => new RegExp(pattern).test(currentUrl || "");

  // MOBILE drawer (slide in/out)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // DESKTOP collapse (full → icons-only)
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  // theme persists for main/topbar (sidebar stays black)
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") || "light";
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    if (typeof window !== "undefined") localStorage.setItem("theme", theme);
  }, [theme]);

  // Persist collapsed state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", collapsed.toString());
    }
  }, [collapsed]);

  // user dropdown
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    const close = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const adminName = admin?.name ?? "Admin";
  const adminEmail = admin?.email ?? "";

  // ----- nav items -----
  const items = [
    {
      label: "Accueil",
      href: route("admin.home"),
      match: "^/admin/home$",
      Icon: LayoutDashboard,
    },
    {
      label: "Sites",
      href: route("admin.sites.index"),
      match: "^/admin/sites",
      Icon: MapPin,
    },
    {
      label: "Projets",
      href: route("admin.projects.index"),
      match: "^/admin/projects",
      Icon: FolderOpen,
    },
    {
      label: "Gestion des Comptes",
      href: route("admin.dashboard"),
      match: "^/admin\\?$|^/admin$|^/admin\\?tab=parkx|^/admin\\?tab=contractors",
      Icon: Users,
    },
    {
      label: "Signatures",
      href: route("admin.signatures.index"),
      match: "^/admin/signatures",
      Icon: Mail,
    },
    {
      label: "Matériel (demandes)",
      href: route("admin.material.index"),
      match: "^/admin/materiel",
      Icon: Archive,
    },
    {
      label: "Vods",
      href: route("admin.vods.index"),
      match: "^/admin/vods",
      Icon: FileText,
    },
    {
      label: "Statistiques HSE",
      href: route("admin.hse-statistics.index"),
      match: "^/admin/hse-statistics",
      Icon: BarChart3,
    },
    {
      label: "Documents",
      href: route("admin.documents.index"),
      match: "^/admin/documents",
      Icon: Folder,
    },
    {
      label: "Demandes EPI",
      href: route("admin.epi-requests.index"),
      match: "^/admin/epi-requests",
      Icon: Package,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-slate-100">
      {/* ===== Sidebar ===== */}
      <aside
        aria-label="Sidebar"
        className={[
          "fixed inset-y-0 left-0 z-40 border-r bg-white dark:bg-slate-800 text-gray-900 dark:text-white",
          "transform transition-all duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:transition-all",
          collapsed ? "lg:w-16" : "lg:w-64",
          "w-64",
          "border-gray-200 dark:border-slate-700",
          "shadow-xl",
        ].join(" ")}
      >
        {/* Top row: logo + collapse toggle */}
        <div className={`flex items-center h-16 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 ${
          collapsed ? "justify-center px-2" : "justify-between px-4 gap-2"
        }`}>
          {/* Logo section - hidden when collapsed */}
          {!collapsed && (
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg">
                <img src="/images/wh.png" className="w-6 h-6" alt="PARKX Logo" />
              </div>
              <div className="opacity-100">
                <div className="text-lg font-bold text-slate-900 dark:text-white">PARKX</div>
                <div className="text-xs text-slate-600 dark:text-slate-300">Administration</div>
              </div>
            </div>
          )}

          {/* Collapse (desktop) */}
          <button
            onClick={() => {
              console.log('Collapse button clicked, current state:', collapsed);
              setCollapsed((v) => !v);
            }}
            className={`hidden lg:inline-flex items-center justify-center rounded-lg transition-all duration-200 ${
              collapsed 
                ? "h-8 w-8 bg-blue-500 hover:bg-blue-600 text-white shadow-lg" 
                : "h-8 w-8 hover:bg-gray-100 dark:hover:bg-slate-600"
            }`}
            aria-label="Toggle sidebar"
            aria-expanded={!collapsed}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>


        {/* Nav */}
        <nav className={`py-4 space-y-1 flex-1 overflow-y-auto ${collapsed ? "px-2" : "px-3"}`}>
          {items.map(({ label, href, match, Icon }) => {
            const isActive = active(match);
            return (
              <NavItem
                key={label}
                href={href}
                Icon={Icon}
                label={label}
                active={isActive}
                collapsed={collapsed}
                onClick={() => setSidebarOpen(false)}
              />
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className={`mt-auto border-t border-gray-200 dark:border-slate-700 ${collapsed ? "p-2" : "p-3"}`}>
          {/* Profile preview (expanded) */}
          {!collapsed && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-700 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                {adminName?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">{adminName}</div>
                {adminEmail && <div className="truncate text-xs text-gray-500 dark:text-slate-400">{adminEmail}</div>}
              </div>
            </div>
          )}

          {/* Logout */}
          <form method="POST" action={route("admin.logout")}>
            <input type="hidden" name="_token" value={csrf_token} />
            <button
              type="submit"
              className={`${
                collapsed
                  ? "w-10 h-10 grid place-items-center rounded-lg hover:bg-red-500 hover:text-white mx-auto text-red-600 dark:text-red-400 transition-all duration-200"
                  : "w-full flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
              } transition-colors`}
              title="Se déconnecter"
            >
              <LogOut size={18} />
              {!collapsed && <span className="font-medium">Se déconnecter</span>}
            </button>
          </form>
        </div>
      </aside>

      {/* Backdrop for mobile only */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fermer le menu"
        />
      )}

      {/* ===== Main column ===== */}
      <div className={`${collapsed ? "lg:ml-16" : "lg:ml-64"} flex min-h-screen flex-col transition-all duration-300 ease-in-out`}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 border-b border-gray-200 dark:border-slate-700 bg-white/95 backdrop-blur-sm dark:bg-slate-900/95 shadow-sm">
          <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-6">
            {/* Left: hamburger (mobile) + small logo */}
            <div className="flex items-center gap-3">
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 lg:hidden transition-colors"
                onClick={() => setSidebarOpen((v) => !v)}
                aria-label="Ouvrir le menu"
              >
                <Menu size={18} />
              </button>
              <div className="flex items-center gap-2">
                <img src="/images/wh.png" className="h-8 w-auto" alt="PARKX Logo" />
              </div>
            </div>

            {/* Right: theme, notifications, user */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                title={theme === "dark" ? "Mode clair" : "Mode sombre"}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-600" />
                )}
              </button>

              {/* Notifications */}
              <AdminNotifications />

              {/* User Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="max-w-[8rem] truncate text-sm font-medium text-gray-700 dark:text-slate-200">
                    {adminName}
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {adminName?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
                    <div className="border-b border-gray-200 dark:border-slate-700 px-4 py-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{adminName}</div>
                      {adminEmail && (
                        <div className="truncate text-xs text-gray-500 dark:text-slate-400">{adminEmail}</div>
                      )}
                    </div>
                    <ul className="py-1 text-sm">
                      <li>
                        <Link href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                          <User className="w-4 h-4" />
                          Profil
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                          <Settings className="w-4 h-4" />
                          Paramètres
                        </Link>
                      </li>
                    </ul>
                    <div className="border-t border-gray-200 dark:border-slate-700">
                      <form method="POST" action={route("admin.logout")}>
                        <input type="hidden" name="_token" value={csrf_token} />
                        <button
                          type="submit"
                          className="flex items-center gap-3 w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Se déconnecter
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

/* -------- components -------- */
function NavItem({ href, Icon, label, active, collapsed, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "group relative flex items-center rounded-lg transition-all duration-200",
        collapsed ? "justify-center px-0 py-3 h-12 mx-1" : "px-3 py-3 gap-3",
        active 
          ? collapsed 
            ? "bg-blue-500 text-white shadow-lg" 
            : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600"
          : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
      ].join(" ")}
    >
      <Icon 
        size={20} 
        className={active ? (collapsed ? "text-white" : "text-blue-600 dark:text-blue-400") : ""} 
      />
      
      {!collapsed && (
        <span className="text-sm font-medium">{label}</span>
      )}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-md bg-gray-900 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
          {label}
        </div>
      )}
    </Link>
  );
}