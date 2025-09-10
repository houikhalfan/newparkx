import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import ContractorUserDropdown from '@/Components/ContractorUserDropdown';

export default function ContractantLayout({ children, contractor }) {
  const { url } = usePage();

  const nav = [
    { href: '/contractant/documents',    label: 'Documents' },
    { href: '/contractant/hse-statistics', label: 'Statistiques' },
    { href: '/contractant/vods',         label: 'VODs' },
    { href: '/contractant/parapheur',    label: 'Papiers à signer' },

    // ✅ New: Ressources matériel
    { href: '/contractant/materiel',     label: 'Ressources Matérielles' },
  ];

  const isActive = (href) => url.startsWith(href);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar (only on inner pages) */}
      <aside className="w-64 bg-white border-r hidden md:flex md:flex-col">
        <div className="px-5 py-4 border-b">
          <div className="font-semibold">Espace Contractant</div>
          <div className="text-xs text-gray-500">Services</div>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={`block px-3 py-2 rounded-md text-sm ${
                isActive(i.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {i.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1">
        {/* Top Bar */}
        <div className="bg-white border-b px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/images/logo.png" 
                alt="ParkX Logo" 
                className="h-8 w-auto"
              />
              <div className="md:hidden">
                <div className="text-sm font-medium">Services</div>
              </div>
            </div>
            <Link
              href={route('contractant.home')}
              className="hidden md:flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Retour au tableau de bord
            </Link>
          </div>
          <div className="flex items-center">
            <ContractorUserDropdown contractor={contractor} />
          </div>
        </div>
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
