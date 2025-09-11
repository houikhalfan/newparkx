import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function DocumentsIndex({ documents, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [visibilityFilter, setVisibilityFilter] = useState(filters.visibility || '');
    const [selectedDocuments, setSelectedDocuments] = useState([]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        router.get(route('admin.documents.index'), {
            search: e.target.value,
            visibility: visibilityFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterChange = (filter, value) => {
        if (filter === 'visibility') {
            setVisibilityFilter(value);
        }
        
        router.get(route('admin.documents.index'), {
            search: search,
            visibility: filter === 'visibility' ? value : visibilityFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setVisibilityFilter('');
        router.get(route('admin.documents.index'));
    };

    const handleSelectDocument = (documentId) => {
        setSelectedDocuments(prev => 
            prev.includes(documentId) 
                ? prev.filter(id => id !== documentId)
                : [...prev, documentId]
        );
    };

    const handleSelectAll = () => {
        if (selectedDocuments.length === documents.data.length) {
            setSelectedDocuments([]);
        } else {
            setSelectedDocuments(documents.data.map(doc => doc.id));
        }
    };

    const handleBulkDelete = () => {
        if (selectedDocuments.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${selectedDocuments.length} document(s)?`)) {
            router.post(route('admin.documents.bulk-delete'), {
                documents: selectedDocuments,
            });
        }
    };

    const getVisibilityBadges = (visibility) => {
        const badges = {
            public: 'bg-green-100 text-green-800',
            private: 'bg-red-100 text-red-800',
            contractant: 'bg-blue-100 text-blue-800',
        };

        return visibility.map(v => (
            <span key={v} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[v] || 'bg-gray-100 text-gray-800'}`}>
                {v === 'public' ? 'Public' : v === 'private' ? 'Private' : 'Contractor'}
            </span>
        ));
    };

    return (
        <AdminLayout>
            <Head title="Documents" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
                                    <p className="text-gray-600">Manage your documents and files</p>
                                </div>
                                <Link
                                    href={route('admin.documents.create')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Ajouter un document
                                </Link>
                            </div>

                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {/* Search */}
                                <div>
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

                                {/* Visibility Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Visibilité
                                    </label>
                                    <select
                                        value={visibilityFilter}
                                        onChange={(e) => handleFilterChange('visibility', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Toutes les visibilités</option>
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                        <option value="contractant">Contractor</option>
                                    </select>
                                </div>

                                {/* Clear Filters */}
                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Effacer les filtres
                                    </button>
                                </div>
                            </div>

                            {/* Bulk Actions */}
                            {selectedDocuments.length > 0 && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-red-800">
                                            {selectedDocuments.length} document(s) sélectionné(s)
                                        </span>
                                        <button
                                            onClick={handleBulkDelete}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Supprimer sélection
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Documents Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedDocuments.length === documents.data.length && documents.data.length > 0}
                                                    onChange={handleSelectAll}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Document
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Visibilité
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Taille
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
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedDocuments.includes(document.id)}
                                                        onChange={() => handleSelectDocument(document.id)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <span className="text-lg mr-2">{document.file_icon}</span>
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
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-wrap gap-1">
                                                        {getVisibilityBadges(document.visibility)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {document.formatted_file_size}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(document.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {document.full_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={route('admin.documents.show', document.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Voir
                                                        </Link>
                                                        <Link
                                                            href={route('admin.documents.edit', document.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Modifier
                                                        </Link>
                                                        <a
                                                            href={route('admin.documents.download', document.id)}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Télécharger
                                                        </a>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this document?')) {
                                                                    router.delete(route('admin.documents.destroy', document.id));
                                                                }
                                                            }}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </div>
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
                                    <p className="mt-1 text-sm text-gray-500">Commencez par ajouter un nouveau document.</p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('admin.documents.create')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            Ajouter un document
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}