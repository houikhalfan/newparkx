import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function PPERequestEdit({ ppeRequest, availableEpiTypes, availableSizes, availablePointures }) {
    const [formData, setFormData] = useState({
        nom_prenom: ppeRequest.nom_prenom || '',
        date_demande: ppeRequest.date_demande || new Date().toISOString().split('T')[0],
        liste_epi: ppeRequest.liste_epi || [''],
        quantites: ppeRequest.quantites || [1],
        tailles: ppeRequest.tailles || [''],
        pointures: ppeRequest.pointures || [''],
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (field, index, value) => {
        const newData = { ...formData };
        
        if (index !== undefined) {
            newData[field][index] = value;
        } else {
            newData[field] = value;
        }
        
        setFormData(newData);
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
    };

    const addEpi = () => {
        setFormData({
            ...formData,
            liste_epi: [...formData.liste_epi, ''],
            quantites: [...formData.quantites, 1],
            tailles: [...formData.tailles, ''],
            pointures: [...formData.pointures, ''],
        });
    };

    const removeEpi = (index) => {
        if (formData.liste_epi.length > 1) {
            const newData = { ...formData };
            newData.liste_epi.splice(index, 1);
            newData.quantites.splice(index, 1);
            newData.tailles.splice(index, 1);
            newData.pointures.splice(index, 1);
            setFormData(newData);
        }
    };

    const needsSize = (epi) => {
        const sizeEpi = ['Polo', 'T-shirt', 'Gilet HV', 'Parka', 'Pantalon'];
        return sizeEpi.includes(epi);
    };

    const needsPointure = (epi) => {
        const pointureEpi = ['Chaussures de sécurité', 'Botte de sécurité'];
        return pointureEpi.includes(epi);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        router.put(route('ppe-requests.update', ppeRequest.id), formData, {
            onError: (errors) => setErrors(errors),
            onSuccess: () => {
                // Success will be handled by the controller redirect
            },
        });
    };

    return (
        <>
            <Head title="Modifier ma Demande d'EPI" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Modifier ma Demande d'EPI</h1>
                                        <p className="text-gray-600">Modifiez les détails de votre demande d'équipements de protection individuelle</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <Link
                                            href={route('ppe-requests.show', ppeRequest.id)}
                                            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700"
                                        >
                                            ← Retour aux détails
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                                        >
                                            📋 Tableau de Bord
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Info Alert */}
                            <div className="mb-6 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                                ℹ️ Vous pouvez uniquement modifier les demandes qui sont encore "En cours". Une fois qu'un administrateur commence à traiter votre demande, vous ne pourrez plus la modifier.
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nom et Prénom *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nom_prenom}
                                            onChange={(e) => handleInputChange('nom_prenom', undefined, e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                                                errors.nom_prenom ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Votre nom complet"
                                        />
                                        {errors.nom_prenom && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nom_prenom}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date de Demande *
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.date_demande}
                                            onChange={(e) => handleInputChange('date_demande', undefined, e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                                                errors.date_demande ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.date_demande && (
                                            <p className="mt-1 text-sm text-red-600">{errors.date_demande}</p>
                                        )}
                                    </div>
                                </div>

                                {/* EPI List */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Équipements de Protection Individuelle</h3>
                                        <button
                                            type="button"
                                            onClick={addEpi}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                                        >
                                            + Ajouter un EPI
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {formData.liste_epi.map((epi, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-md font-medium text-gray-900">EPI #{index + 1}</h4>
                                                    {formData.liste_epi.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeEpi(index)}
                                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                        >
                                                            Supprimer
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Type d'EPI *
                                                        </label>
                                                        <select
                                                            value={epi}
                                                            onChange={(e) => handleInputChange('liste_epi', index, e.target.value)}
                                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                                                                errors[`liste_epi.${index}`] ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        >
                                                            <option value="">Sélectionner un EPI</option>
                                                            {availableEpiTypes.map((type) => (
                                                                <option key={type} value={type}>
                                                                    {type}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors[`liste_epi.${index}`] && (
                                                            <p className="mt-1 text-sm text-red-600">{errors[`liste_epi.${index}`]}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Quantité *
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="10"
                                                            value={formData.quantites[index] || 1}
                                                            onChange={(e) => handleInputChange('quantites', index, parseInt(e.target.value))}
                                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                                                                errors[`quantites.${index}`] ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        />
                                                        {errors[`quantites.${index}`] && (
                                                            <p className="mt-1 text-sm text-red-600">{errors[`quantites.${index}`]}</p>
                                                        )}
                                                    </div>

                                                    {needsSize(epi) && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Taille
                                                            </label>
                                                            <select
                                                                value={formData.tailles[index] || ''}
                                                                onChange={(e) => handleInputChange('tailles', index, e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                                                            >
                                                                <option value="">Sélectionner une taille</option>
                                                                {availableSizes.map((size) => (
                                                                    <option key={size} value={size}>
                                                                        {size}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}

                                                    {needsPointure(epi) && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Pointure
                                                            </label>
                                                            <select
                                                                value={formData.pointures[index] || ''}
                                                                onChange={(e) => handleInputChange('pointures', index, e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                                                            >
                                                                <option value="">Sélectionner une pointure</option>
                                                                {availablePointures.map((pointure) => (
                                                                    <option key={pointure} value={pointure}>
                                                                        {pointure}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-4">
                                    <Link
                                        href={route('ppe-requests.show', ppeRequest.id)}
                                        className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Annuler
                                    </Link>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Mettre à jour la Demande
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
