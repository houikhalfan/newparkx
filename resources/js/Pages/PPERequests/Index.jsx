import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '../DashboardLayout';

export default function PPERequestsIndex() {
  return (
    <DashboardLayout>
      <Head title="Demande EPI" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Demande d'Équipements de Protection Individuelle (EPI)
                </h1>
                <p className="text-gray-600">
                  Gérez vos demandes d'équipements de protection individuelle
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Casque de sécurité */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-gray-800">Casque de sécurité</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Protection de la tête contre les chutes d'objets</p>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    Demander
                  </button>
                </div>

                {/* Gants de protection */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                      </svg>
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-gray-800">Gants de protection</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Protection des mains contre les coupures et abrasions</p>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                    Demander
                  </button>
                </div>

                {/* Chaussures de sécurité */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-gray-800">Chaussures de sécurité</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Protection des pieds avec coque de sécurité</p>
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                    Demander
                  </button>
                </div>

                {/* Vêtements de protection */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-gray-800">Vêtements de protection</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Vêtements haute visibilité et résistants</p>
                  <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors">
                    Demander
                  </button>
                </div>

                {/* Lunettes de protection */}
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-gray-800">Lunettes de protection</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Protection des yeux contre les projections</p>
                  <button className="w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 transition-colors">
                    Demander
                  </button>
                </div>

                {/* Masque de protection */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-gray-800">Masque de protection</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Protection respiratoire contre les poussières</p>
                  <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
                    Demander
                  </button>
                </div>
              </div>

              {/* Mes demandes */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Mes demandes récentes</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600 text-center">
                    Aucune demande récente. Cliquez sur "Demander" pour créer une nouvelle demande d'EPI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
