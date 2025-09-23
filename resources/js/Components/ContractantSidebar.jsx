import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { route } from "ziggy-js";  // ✅ correct
import { 
  FileText, 
  BarChart3, 
  Video, 
  FileSignature, 
  Package,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

export default function ContractantSidebar() {
  const { url } = usePage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState(new Set());

  const navItems = [
    { 
      href: '/contractant/documents', 
      label: 'Documents',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      href: '/contractant/hse-statistics', 
      label: 'Statistiques',
      icon: BarChart3,
      color: 'from-emerald-500 to-teal-500'
    },
    { 
      href: '/contractant/vods', 
      label: 'VODs',
      icon: Video,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      href: route("contractant.permis.selection"),
      label: "Permis & Suivis",
      icon: FileSignature,
      color: "from-orange-500 to-red-500",
      children: [
        {
          href: route("contractant.suivi-permis.index"),
          label: "Suivis des permis",
        },
        {
          href: route("contractant.permisexcavation.create"),
          label: "Permis D'Excavation",
        },
{
  href: "/contractant/permis-travail-securitaire/create",
  label: "Permis de travail sécuritaire — Construction",
}
      ]
    },
    { 
      href: '/contractant/materiel', 
      label: 'Ressources Matérielles',
      icon: Package,
      color: 'from-indigo-500 to-blue-500'
    },
  ];

  const isActive = (href) => {
    // Simple string comparison for relative paths
    return url.startsWith(href);
  };
  
  const isParentActive = (item) => {
    if (item.children) {
      return item.children.some(child => isActive(child.href));
    }
    return isActive(item.href);
  };

  // Special check for permit pages to ensure parent shows as active
  const isPermitPage = () => {
    return url.includes('/permis') || 
           url.includes('/suivi-permis') || 
           url.includes('/permis-excavation') ||
           url.includes('/permis-de-travail-securitaire');
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (isMobileOpen && !event.target.closest('.sidebar-container')) {
        setIsMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileOpen]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleExpanded = (itemHref) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemHref)) {
        newSet.delete(itemHref);
      } else {
        newSet.add(itemHref);
      }
      return newSet;
    });
  };

  const SidebarContent = ({ isMobile = false }) => (
    <motion.aside
      initial={isMobile ? { x: -300 } : false}
      animate={isMobile ? { x: isMobileOpen ? 0 : -300 } : false}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      layout={false}
      className={`
        sidebar-container relative h-full bg-white/90 backdrop-blur-xl border-r border-blue-200/50 shadow-xl
        ${isMobile ? 'fixed left-0 top-0 z-50 w-64' : 'flex flex-col'}
        ${isCollapsed && !isMobile ? 'w-16' : 'w-64'}
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.1)'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-blue-200/30">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">PX</span>
              </div>
              <div>
                <h1 className="text-gray-800 font-bold text-sm">Espace Contractant</h1>
                <p className="text-xs text-gray-600">Services</p>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="flex justify-center w-full">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">PX</span>
              </div>
            </div>
          )}

          {/* Collapse Toggle (Desktop) */}
          {!isMobile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCollapse}
              className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-blue-600" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-blue-600" />
              )}
            </motion.button>
          )}

          {/* Close Button (Mobile) */}
          {isMobile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobile}
              className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-4 h-4 text-blue-600" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2">
        <AnimatePresence>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.label === "Permis & Suivis" ? 
              (isParentActive(item) || isPermitPage()) : 
              isParentActive(item);
            const isExpanded = expandedItems.has(item.href);
            const hasChildren = item.children && item.children.length > 0;
            
            return (
              <div key={item.href}>
                {/* Parent item */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {hasChildren ? (
                    <button
                      onClick={() => toggleExpanded(item.href)}
                      className={`
                        group relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden w-full text-left
                        ${active 
                          ? 'bg-blue-50 text-blue-700 shadow-xl border border-blue-200' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:shadow-lg'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                    >
                    {/* Active Background Glow */}
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-xl border border-blue-200"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      />
                    )}

                    {/* Hover Effect Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
                    
                    {/* Icon */}
                    <motion.div 
                      className={`
                        relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
                        ${active 
                          ? `bg-gradient-to-br ${item.color} shadow-lg` 
                          : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-500/20 group-hover:to-purple-500/20'
                        }
                      `}
                      whileHover={{ 
                        scale: 1.1, 
                        rotate: active ? 0 : 5,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon className={`w-4 h-4 transition-all duration-300 ${active ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
                    </motion.div>

                    {/* Label */}
                    {!isCollapsed && (
                      <motion.span 
                        className={`relative z-10 ml-3 text-sm font-semibold transition-all duration-300 ${active ? 'text-blue-700' : 'text-gray-600 group-hover:text-blue-600'}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {item.label}
                      </motion.span>
                    )}

                    {/* Chevron Icon */}
                    {!isCollapsed && hasChildren && (
                      <motion.div
                        className="relative z-10 ml-auto"
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                      </motion.div>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && !isMobile && (
                      <motion.div 
                        className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg"
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                      >
                        {item.label}
                      </motion.div>
                    )}

                    {/* Subtle glow effect for active state */}
                    {active && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: `linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)`,
                          boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)'
                        }}
                        animate={{ 
                          opacity: [0.5, 1, 0.5],
                          scale: [1, 1.02, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`
                        group relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden
                        ${active 
                          ? 'bg-blue-50 text-blue-700 shadow-xl border border-blue-200' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:shadow-lg'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                    >
                      {/* Active Background Glow */}
                      {active && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-xl border border-blue-200"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        />
                      )}

                      {/* Hover Effect Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      />
                      
                      {/* Icon */}
                      <motion.div 
                        className={`
                          relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
                          ${active 
                            ? `bg-gradient-to-br ${item.color} shadow-lg` 
                            : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-500/20 group-hover:to-purple-500/20'
                          }
                        `}
                        whileHover={{ 
                          scale: 1.1, 
                          rotate: active ? 0 : 5,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon className={`w-4 h-4 transition-all duration-300 ${active ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
                      </motion.div>

                      {/* Label */}
                      {!isCollapsed && (
                        <motion.span 
                          className={`relative z-10 ml-3 text-sm font-semibold transition-all duration-300 ${active ? 'text-blue-700' : 'text-gray-600 group-hover:text-blue-600'}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {item.label}
                        </motion.span>
                      )}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && !isMobile && (
                        <motion.div 
                          className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg"
                          initial={{ opacity: 0, x: -10 }}
                          whileHover={{ opacity: 1, x: 0 }}
                        >
                          {item.label}
                        </motion.div>
                      )}

                      {/* Subtle glow effect for active state */}
                      {active && (
                        <motion.div
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: `linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)`,
                            boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)'
                          }}
                          animate={{ 
                            opacity: [0.5, 1, 0.5],
                            scale: [1, 1.02, 1]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </Link>
                  )}
                </motion.div>

                {/* Children (secondary links) */}
                {!isCollapsed && item.children && isExpanded && (
                  <motion.div 
                    className="ml-12 mt-2 space-y-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {item.children.map((child, index) => {
                      const childActive = isActive(child.href);
                      return (
                        <motion.div
                          key={child.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            href={child.href}
                            className={`
                              group relative block text-xs px-3 py-2 rounded-lg font-medium transition-all duration-300 overflow-hidden
                              ${childActive 
                                ? 'text-blue-700 bg-blue-100 border border-blue-200 shadow-lg' 
                                : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md'
                              }
                            `}
                          >
                            {/* Active state glow */}
                            {childActive && (
                              <motion.div
                                className="absolute inset-0 rounded-lg"
                                style={{
                                  background: `linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)`,
                                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.2)'
                                }}
                                animate={{ 
                                  opacity: [0.3, 0.6, 0.3],
                                  scale: [1, 1.01, 1]
                                }}
                                transition={{ 
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            )}

                            {/* Hover effect overlay */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                            />

                            <span className="relative z-10">
                              {child.label}
                            </span>

                            {/* Subtle indicator for active state */}
                            {childActive && (
                              <motion.div
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 0.3 }}
                              />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            );
          })}
        </AnimatePresence>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-blue-200/30">
          <div className="text-xs text-gray-500 text-center font-medium">
            ParkX hhh Portal
          </div>
        </div>
      )}
    </motion.aside>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMobile}
        className="md:hidden fixed top-4 left-4 z-40 p-3 bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-xl shadow-lg"
      >
        <Menu className="w-5 h-5 text-blue-600" />
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <SidebarContent isMobile={true} />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>
    </>
  );
}
