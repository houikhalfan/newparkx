import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  BarChart3, 
  Video, 
  FileSignature, 
  Package,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export default function ContractantSidebar() {
  const { url } = usePage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
      href: '/contractant/parapheur', 
      label: 'Papiers à signer',
      icon: FileSignature,
      color: 'from-orange-500 to-red-500'
    },
    { 
      href: '/contractant/materiel', 
      label: 'Ressources Matérielles',
      icon: Package,
      color: 'from-indigo-500 to-blue-500'
    },
  ];

  const isActive = (href) => url.startsWith(href);

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

  const SidebarContent = ({ isMobile = false }) => (
    <motion.aside
      initial={isMobile ? { x: -300 } : false}
      animate={isMobile ? { x: isMobileOpen ? 0 : -300 } : false}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      layout={false}
      className={`
        sidebar-container relative h-full bg-gradient-to-br from-gray-800/90 to-gray-900/95 backdrop-blur-xl border-r border-white/10 shadow-2xl
        ${isMobile ? 'fixed left-0 top-0 z-50 w-64' : 'flex flex-col'}
        ${isCollapsed && !isMobile ? 'w-16' : 'w-64'}
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.98) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PX</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-sm">Espace Contractant</h1>
                <p className="text-xs text-gray-400">Services</p>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="flex justify-center w-full">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg flex items-center justify-center">
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
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-white" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-white" />
              )}
            </motion.button>
          )}

          {/* Close Button (Mobile) */}
          {isMobile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobile}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <X className="w-4 h-4 text-white" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2">
        <AnimatePresence>
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    group relative flex items-center px-3 py-3 rounded-xl transition-all duration-300
                    ${active 
                      ? 'bg-white text-gray-900 shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }
                    ${isCollapsed && !isMobile ? 'justify-center' : ''}
                  `}
                >
                  {/* Active Background Glow */}
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-xl shadow-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Icon */}
                  <div className={`
                    relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
                    ${active 
                      ? `bg-gradient-to-br ${item.color}` 
                      : 'bg-white/10 group-hover:bg-white/20'
                    }
                  `}>
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-300 group-hover:text-white'}`} />
                  </div>

                  {/* Label */}
                  {!isCollapsed && (
                    <span className={`relative z-10 ml-3 text-sm font-medium ${active ? 'text-gray-900' : 'text-gray-300 group-hover:text-white'}`}>
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && !isMobile && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </AnimatePresence>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-gray-400 text-center">
            ParkX Contractor Portal
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
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-gradient-to-br from-gray-800/90 to-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg"
      >
        <Menu className="w-5 h-5 text-white" />
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
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
