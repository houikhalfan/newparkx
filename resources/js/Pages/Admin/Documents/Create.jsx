import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create() {
    const [dragActive, setDragActive] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        visibility: ['private'],
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('Form data before submission:', data);
        
        post(route('admin.documents.store'));
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setData('file', e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setData('file', e.target.files[0]);
        }
    };

    const handleVisibilityChange = (visibility) => {
        const currentVisibility = data.visibility;
        if (currentVisibility.includes(visibility)) {
            setData('visibility', currentVisibility.filter(v => v !== visibility));
        } else {
            setData('visibility', [...currentVisibility, visibility]);
        }
    };

    return (
        <AdminLayout>
            <Head title="Ajouter un document" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Ajouter un document</h1>
                                <p className="text-gray-600">Téléchargez un nouveau document</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                        Titre du document *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Entrez le titre du document"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Décrivez le contenu du document"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                {/* Visibility */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Visibilité *
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={data.visibility.includes('public')}
                                                onChange={() => handleVisibilityChange('public')}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                Public - Visible par tous les utilisateurs ParkX
                                            </span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={data.visibility.includes('private')}
                                                onChange={() => handleVisibilityChange('private')}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                Privé - Visible uniquement par les administrateurs
                                            </span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={data.visibility.includes('contractant')}
                                                onChange={() => handleVisibilityChange('contractant')}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                Contractant - Visible uniquement par les contractants
                                            </span>
                                        </label>
                                    </div>
                                    {errors.visibility && (
                                        <p className="mt-1 text-sm text-red-600">{errors.visibility}</p>
                                    )}
                                </div>

                                {/* File Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Fichier *
                                    </label>
                                    
                                    {/* Drag and Drop Area */}
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center ${
                                            dragActive 
                                                ? 'border-blue-400 bg-blue-50' 
                                                : 'border-gray-300'
                                        }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        {data.file ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-center">
                                                    <span className="text-lg mr-2">📄</span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {data.file.name}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    {(data.file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => setData('file', null)}
                                                    className="text-sm text-red-600 hover:text-red-800"
                                                >
                                                    Supprimer le fichier
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Glissez-déposez votre fichier ici, ou
                                                        <label htmlFor="file-upload" className="text-blue-600 hover:text-blue-500 cursor-pointer">
                                                            {' '}cliquez pour sélectionner
                                                        </label>
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        PDF, DOC, DOCX, XLS, XLSX, PNG, JPG jusqu'à 100MB
                                                    </p>
                                                </div>
                                                <input
                                                    id="file-upload"
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {errors.file && (
                                        <p className="mt-1 text-sm text-red-600">{errors.file}</p>
                                    )}
                                </div>

                                {/* Error Messages */}
                                {errors.error && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                        <p className="text-sm text-red-600">{errors.error}</p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center justify-end space-x-3">
                                    <Link
                                        href={route('admin.documents.index')}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Annuler
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing || !data.file || !data.title || data.visibility.length === 0}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Téléchargement...' : 'Ajouter le document'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}