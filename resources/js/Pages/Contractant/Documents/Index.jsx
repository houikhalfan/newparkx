import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ContractantLayout from '@/Pages/ContractantLayout';

export default function DocumentsIndex({ documents, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        router.get(route('contractant.documents'), {
            search: e.target.value,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        router.get(route('contractant.documents'));
    };

    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) {
            return '🖼️';
        } else if (fileType === 'application/pdf') {
            return '📄';
        } else if (fileType.startsWith('text/')) {
            return '📝';
        } else if (fileType.includes('word') || fileType.includes('document')) {
            return '📄';
        } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
            return '📊';
        } else {
            return '📎';
        }
    };


    return (
        <ContractantLayout title="Documents" active="documents">
            <Head title="Documents" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
                                <p className="text-gray-600">Consultez et téléchargez les documents partagés</p>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <div className="flex space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Rechercher
                                        </label>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={handleSearch}
                                            placeholder="Rechercher par titre ou description..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={clearFilters}
                                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            Effacer
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Documents Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Document
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Uploadé par
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {documents.data.map((document) => (
                                            <tr key={document.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <span className="text-lg mr-2">{getFileIcon(document.file_type)}</span>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {document.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {document.original_filename}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(document.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {document.full_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <a
                                                        href={route('contractant.documents.download', document.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Télécharger
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {documents.links && (
                                <div className="mt-6">
                                    <nav className="flex items-center justify-between">
                                        <div className="flex-1 flex justify-between sm:hidden">
                                            {documents.links.prev ? (
                                                <Link
                                                    href={documents.links.prev}
                                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    Précédent
                                                </Link>
                                            ) : (
                                                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-300 bg-white cursor-not-allowed">
                                                    Précédent
                                                </span>
                                            )}
                                            
                                            {documents.links.next ? (
                                                <Link
                                                    href={documents.links.next}
                                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    Suivant
                                                </Link>
                                            ) : (
                                                <span className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-300 bg-white cursor-not-allowed">
                                                    Suivant
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    Affichage de <span className="font-medium">{documents.from}</span> à <span className="font-medium">{documents.to}</span> sur <span className="font-medium">{documents.total}</span> résultats
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                    {documents.links.map((link, index) => (
                                                        link.url ? (
                                                            <Link
                                                                key={index}
                                                                href={link.url}
                                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                    link.active
                                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                }`}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        ) : (
                                                            <span
                                                                key={index}
                                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-300 cursor-not-allowed"
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        )
                                                    ))}
                                                </nav>
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                            )}

                            {/* Empty State */}
                            {documents.data.length === 0 && (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document</h3>
                                    <p className="mt-1 text-sm text-gray-500">Aucun document n'est disponible pour vous.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ContractantLayout>
    );
}
