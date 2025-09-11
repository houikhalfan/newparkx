import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminPPERequestShow({ ppeRequest }) {
    const [formData, setFormData] = useState({
        etat: ppeRequest.etat,
        commentaires_admin: ppeRequest.commentaires_admin || '',
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
        
        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        router.put(route('admin.ppe-requests.update', ppeRequest.id), formData, {
            onError: (errors) => setErrors(errors),
            onSuccess: () => {
                // Success message will be handled by the controller
            },
        });
    };

    const getEtatBadge = (etat) => {
        const badges = {
            en_cours: 'bg-yellow-100 text-yellow-800',
            en_traitement: 'bg-blue-100 text-blue-800',
            done: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };

        const labels = {
            en_cours: 'En cours',
            en_traitement: 'En traitement',
            done: 'Terminé',
            rejected: 'Rejeté',
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[etat] || 'bg-gray-100 text-gray-800'}`}>
                {labels[etat] || etat}
            </span>
        );
    };

    const formattedEpiList = ppeRequest.formatted_epi_list || [];

    return (
        <AdminLayout>
            <Head title={`Demande d'EPI - ${ppeRequest.nom_prenom}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900">
                                        Demande d'EPI - {ppeRequest.nom_prenom}
                                    </h1>
                                    <p className="text-gray-600">
                                        Demande du {new Date(ppeRequest.date_demande).toLocaleDateString()}
                                    </p>
                                </div>
                                <Link
                                    href={route('admin.ppe-requests.index')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700"
                                >
                                    ← Retour à la liste
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Request Details */}
                                <div className="lg:col-span-2">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Détails de la demande</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Nom et Prénom</label>
                                                <p className="mt-1 text-sm text-gray-900">{ppeRequest.nom_prenom}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Date de demande</label>
                                                <p className="mt-1 text-sm text-gray-900">{new Date(ppeRequest.date_demande).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Demandeur</label>
                                                <p className="mt-1 text-sm text-gray-900">{ppeRequest.user.name}</p>
                                                <p className="text-xs text-gray-500">{ppeRequest.user.email}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">État actuel</label>
                                                <div className="mt-1">
                                                    {getEtatBadge(ppeRequest.etat)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* EPI List */}
                                        <div>
                                            <h4 className="text-md font-medium text-gray-900 mb-3">Liste des EPI demandés</h4>
                                            <div className="space-y-3">
                                                {formattedEpiList.map((item, index) => (
                                                    <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <h5 className="font-medium text-gray-900">{item.epi}</h5>
                                                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                                                    <span>Quantité: <strong>{item.quantite}</strong></span>
                                                                    {item.taille && (
                                                                        <span>Taille: <strong>{item.taille}</strong></span>
                                                                    )}
                                                                    {item.pointure && (
                                                                        <span>Pointure: <strong>{item.pointure}</strong></span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Actions */}
                                <div>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Traiter la demande</h3>
                                        
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    État de la demande
                                                </label>
                                                <select
                                                    value={formData.etat}
                                                    onChange={(e) => handleInputChange('etat', e.target.value)}
                                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                                                        errors.etat ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                >
                                                    <option value="en_cours">En cours</option>
                                                    <option value="en_traitement">En traitement</option>
                                                    <option value="done">Terminé</option>
                                                    <option value="rejected">Rejeté</option>
                                                </select>
                                                {errors.etat && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.etat}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Commentaires
                                                </label>
                                                <textarea
                                                    value={formData.commentaires_admin}
                                                    onChange={(e) => handleInputChange('commentaires_admin', e.target.value)}
                                                    rows={4}
                                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                                                        errors.commentaires_admin ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                    placeholder="Ajoutez des commentaires sur le traitement de cette demande..."
                                                />
                                                {errors.commentaires_admin && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.commentaires_admin}</p>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                Mettre à jour la demande
                                            </button>
                                        </form>

                                        {/* Processing History */}
                                        {ppeRequest.admin && (
                                            <div className="mt-6 pt-6 border-t border-gray-200">
                                                <h4 className="text-sm font-medium text-gray-900 mb-2">Historique</h4>
                                                <div className="text-sm text-gray-600">
                                                    <p>Traité par: <strong>{ppeRequest.admin.full_name || ppeRequest.admin.email}</strong></p>
                                                    <p>Dernière mise à jour: {new Date(ppeRequest.updated_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        )}
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
