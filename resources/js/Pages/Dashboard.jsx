import React, { useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.25l7.25 2.5v5.25c0 4.97-3.13 9.44-7.25 10.75-4.12-1.31-7.25-5.78-7.25-10.75V5.75L12 3.25z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12.25l1.75 1.75 3.25-3.25" />
    </svg>
  );
}

export default function Dashboard() {
  const {
    isResponsible = false,
    assignedPending = 0,
    materialPending = 0,
    auth = {},
  } = usePage().props || {};

  const isAdmin = !!auth?.isAdmin;

  /** Base cards */
  const baseCards = useMemo(
    () => [
      {
        title: 'Documents',
        description: 'Gérez, téléchargez et partagez vos fichiers',
        icon: <img src="/images/doc.png" alt="Documents Icon" className="w-14 h-14" />,
        href: '/documents',
        color: 'from-blue-500 to-indigo-500',
      },
      {
        title: 'Statistiques',
        description: 'Visualisez vos indicateurs en temps réel',
        icon: <img src="/images/stat.png" alt="Stats Icon" className="w-14 h-14" />,
        href: '/stats',
        color: 'from-purple-500 to-pink-500',
      },
      {
        title: 'VODS',
        description: 'Accédez aux vidéos et formulaires liés',
        icon: <img src="/images/form.png" alt="VODS Icon" className="w-14 h-14" />,
        href: '/vods',
        color: 'from-green-500 to-emerald-500',
      },
    ],
    []
  );

  /** Responsable cards */
  const responsableCards = useMemo(
    () => [
      {
        title: 'Papiers assignés',
        description: 'Suivez les documents à signer',
        icon: <img src="/images/agreement.png" alt="Assigned Icon" className="w-14 h-14" />,
        href: '/signatures',
        badge: assignedPending,
        color: 'from-orange-400 to-red-400',
      },
      {
        title: 'Ressources Matérielles',
        description: 'Gérez et suivez vos ressources matérielles',
        icon: <img src="/images/materiel.png" alt="Material Icon" className="w-14 h-14" />,
        href: '/materiel',
        badge: materialPending,
        color: 'from-cyan-500 to-blue-400',
      },
    ],
    [assignedPending, materialPending]
  );

  const cards = useMemo(
    () => (isResponsible ? [...baseCards, ...responsableCards] : baseCards),
    [baseCards, responsableCards, isResponsible]
  );

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* 🔹 Modern Admin Button */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed top-4 right-4 z-50"
        >
          <Link
            href="/admin/home"
            className="group inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-white font-semibold"
          >
            <ShieldIcon />
            <span className="hidden sm:block">Accéder au Dashboard Admin</span>
            <span className="group-hover:translate-x-1 transition">→</span>
          </Link>
        </motion.div>
      )}

      {/* Header */}
      <div
        className="h-[45vh] bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/p.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <h1 className="text-white text-2xl md:text-4xl font-semibold drop-shadow-lg text-center px-4 leading-snug">
            Outils, transparence, collaboration.<br /> Bienvenue sur votre interface ParkX.
          </h1>
        </div>
      </div>

      {/* Cards */}
      <div className="relative z-10 -mt-20 px-6 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12, duration: 0.35 }}
            >
              <Link
                href={card.href}
                className="relative group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center justify-center text-center"
              >
                {/* Gradient top bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-2 rounded-t-2xl bg-gradient-to-r ${card.color}`}
                />

                {/* Icon */}
                <div className="relative mt-2 mb-4">
                  <div className="p-3 bg-gray-100 rounded-full shadow-inner group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                  {typeof card.badge === 'number' && card.badge > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-semibold h-5 min-w-[20px] px-1 shadow-md">
                      {card.badge > 99 ? '99+' : card.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{card.description}</p>

                {/* Hover effect */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-5 transition duration-300`}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
