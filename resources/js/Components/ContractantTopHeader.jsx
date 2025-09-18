import React, { useState, useEffect, useRef } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, Sun, Moon, User, Settings, HelpCircle } from "lucide-react";

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
            className="relative z-50 bg-white/80 backdrop-blur-xl border-b border-blue-200/50 shadow-lg"
            style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.1)'
            }}
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
        <div className="flex items-center space-x-4">
    <div className="relative">
        <div className="w-30 h-12 flex items-center justify-center overflow-hidden p-0">
            <img 
                src="/images/logo.png" 
                alt="ParkX Logo" 
                className="h-10 object-contain"
            />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full animate-pulse" />
    </div>

                     
                    </div>

                    {/* Back Button (if needed) */}
                    {showBackButton && backRoute && (
                        <div className="flex-1 flex justify-center">
                            <Link
                                href={backRoute}
                                className="group flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors duration-300"
                            >
                                <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 group-hover:bg-blue-50 group-hover:border-blue-300 transition-all duration-300 shadow-lg">
                                    <ArrowLeft className="w-5 h-5" />
                                </div>
                                <span className="font-semibold">{backLabel}</span>
                            </Link>
                        </div>
                    )}

                    {/* Right Section: Theme Toggle + Profile + Logout */}
                    <div className="flex items-center space-x-6">
                        
                        {/* THEME TOGGLE */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-3 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-300 shadow-sm"
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
                                <p className="text-sm font-semibold text-gray-800">{contractor?.name || 'Contractor'}</p>
                                <p className="text-xs text-gray-600">{contractor?.company_name || 'Company'}</p>
                            </div>
                            
                            {/* Profile Circle & Dropdown */}
                            <div className="relative" ref={profileDropdownRef}>
                                <button
                                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                    className="w-12 h-12 bg-[#013b94] rounded-2xl flex items-center justify-center text-white font-semibold text-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                                >
                                    {contractor?.name ? contractor.name.charAt(0).toUpperCase() : 'C'}
                                </button>
                                
                                <AnimatePresence>
                                    {showProfileDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-200/50 overflow-hidden z-50"
                                        >
                                            <div className="p-4 border-b border-blue-100/50">
                                                <p className="font-semibold text-gray-800">{contractor?.name || 'Contractor'}</p>
                                                <p className="text-sm text-gray-600">{contractor?.email || 'email@example.com'}</p>
                                            </div>
                                            <div className="p-2">
                                          
                                                <Link
                                                    href={route('contractant.settings')}
                                                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                                                >
                                                    <Settings className="w-5 h-5 text-blue-500" />
                                                    <span>Paramètres</span>
                                                </Link>
                                                <Link
                                                    href={route('contractant.help')}
                                                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                                                >
                                                    <HelpCircle className="w-5 h-5 text-blue-500" />
                                                    <span>Aide & Support</span>
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Logout */}
                        <form method="POST" action={route('contractant.logout')} className="inline">
                            <input type="hidden" name="_token" value={csrf_token} />
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative px-6 py-3 bg-[#013b94] text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <div className="flex items-center space-x-2">
                                    <X className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                                    <span className="text-sm font-semibold">Déconnexion</span>
                                </div>
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400 to-pink-400 opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300" />
                            </motion.button>
                        </form>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}