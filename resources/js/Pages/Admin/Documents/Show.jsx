import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ document }) {
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
        <AdminLayout>
            <Head title={`Document: ${document.title}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
                                    <p className="text-gray-600">Détails du document</p>
                                </div>
                                <div className="flex space-x-2">
                                    <Link
                                        href={route('admin.documents.edit', document.id)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Modifier
                                    </Link>
                                    <Link
                                        href={route('admin.documents.index')}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Retour à la liste
                                    </Link>
                                </div>
                            </div>

                            {/* Document Info */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Main Info */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Basic Info */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h3>
                                        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Titre</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{document.title}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Nom du fichier</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{document.original_filename}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Type de fichier</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{document.file_type}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Taille</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{document.formatted_file_size}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Uploadé par</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{document.full_name}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Date d'upload</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {new Date(document.created_at).toLocaleDateString('fr-FR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>

                                    {/* Description */}
                                    {document.description && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{document.description}</p>
                                        </div>
                                    )}

                                    {/* Metadata */}
                                    {document.meta && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Métadonnées</h3>
                                            <dl className="grid grid-cols-1 gap-4">
                                                {document.meta.uploaded_at && (
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">Uploadé le</dt>
                                                        <dd className="mt-1 text-sm text-gray-900">
                                                            {new Date(document.meta.uploaded_at).toLocaleDateString('fr-FR')}
                                                        </dd>
                                                    </div>
                                                )}
                                                {document.meta.uploaded_by_ip && (
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">Adresse IP</dt>
                                                        <dd className="mt-1 text-sm text-gray-900">{document.meta.uploaded_by_ip}</dd>
                                                    </div>
                                                )}
                                            </dl>
                                        </div>
                                    )}
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* File Preview */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Fichier</h3>
                                        <div className="text-center">
                                            <div className="text-6xl mb-2">{getFileIcon(document.file_type)}</div>
                                            <p className="text-sm text-gray-600 break-all">{document.original_filename}</p>
                                            <p className="text-xs text-gray-500 mt-1">{document.formatted_file_size}</p>
                                        </div>
                                    </div>

                                    {/* Visibility */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Visibilité</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {getVisibilityBadges(document.visibility)}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                                        <div className="space-y-2">
                                            <a
                                                href={route('admin.documents.download', document.id)}
                                                className="block w-full bg-green-600 hover:bg-green-700 text-white text-center px-4 py-2 rounded-md text-sm font-medium"
                                            >
                                                Télécharger
                                            </a>
                                            <Link
                                                href={route('admin.documents.edit', document.id)}
                                                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center px-4 py-2 rounded-md text-sm font-medium"
                                            >
                                                Modifier
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}