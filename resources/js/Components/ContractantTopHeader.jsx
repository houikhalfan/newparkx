import React, { useState, useEffect, useRef } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, Sun, Moon } from "lucide-react";

export default function ContractantTopHeader({ contractor, showBackButton = false, backRoute = null, backLabel = "Retour au tableau de bord" }) {
    const { csrf_token } = usePage().props;
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const profileDropdownRef = useRef(null);

    /* ---------------- THEME TOGGLE ---------------- */
    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
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

                    {/* Back Button (if needed) */}
                    {showBackButton && backRoute && (
                        <div className="flex-1 flex justify-center">
                            <Link
                                href={backRoute}
                                className="group flex items-center space-x-3 text-white hover:text-cyan-300 transition-colors duration-300"
                            >
                                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 transition-all duration-300">
                                    <ArrowLeft className="w-5 h-5" />
                                </div>
                                <span className="font-medium">{backLabel}</span>
                            </Link>
                        </div>
                    )}

                    {/* Right Section: Theme Toggle + Profile + Logout */}
                    <div className="flex items-center space-x-6">
                        
                        {/* THEME TOGGLE */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-full border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-colors duration-300"
                        >
                            {darkMode ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        {/* Contractor Info + Profile Dropdown */}
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-white">{contractor?.name || 'Contractor'}</p>
                                <p className="text-xs text-gray-400">{contractor?.company_name || 'Company'}</p>
                            </div>
                            {/* Profile Circle & Dropdown */}
                            {/* ... (your existing dropdown code here) ... */}
                        </div>

                        {/* Logout */}
                        <form method="POST" action={route('contractant.logout')} className="inline">
                            <input type="hidden" name="_token" value={csrf_token} />
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-full text-red-300 hover:from-red-500/30 hover:to-orange-500/30 hover:border-red-400/50 hover:text-red-200 transition-all duration-300 backdrop-blur-sm"
                            >
                                <div className="flex items-center space-x-2">
                                    <X className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                                    <span className="text-sm font-medium">Déconnexion</span>
                                </div>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-orange-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                            </motion.button>
                        </form>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
