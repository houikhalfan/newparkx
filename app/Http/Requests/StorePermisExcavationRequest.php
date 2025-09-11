<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePermisExcavationRequest extends FormRequest
{
    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        return [
            'numero_permis_general' => 'required|string|max:255',
            'numero_permis' => 'required|string|max:255|unique:permis_excavations,numero_permis',
            'site_id' => 'required|exists:sites,id',
            'duree_de' => 'required|date',
            'duree_a' => 'required|date|after_or_equal:duree_de',
            'description' => 'required|string',
            'analyse_par' => 'required|string|max:255',
            'date_analyse' => 'required|date',
            'demandeur' => 'required|string|max:255',
            'contractant' => 'required|string|max:255',

            // Signatures — images only
            'proprietaire_signature' => 'nullable|image|mimes:jpeg,png|max:2048',
            'sig_resp_construction_file' => 'nullable|image|mimes:jpeg,png|max:2048',
            'sig_resp_hse_file' => 'nullable|image|mimes:jpeg,png|max:2048',
        ];
    }
}
