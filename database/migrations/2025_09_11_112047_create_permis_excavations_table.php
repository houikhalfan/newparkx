<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('permis_excavations', function (Blueprint $table) {
            $table->id();

            // Identifiants
            $table->string('numero_permis_general');
            $table->string('numero_permis')->unique();
            $table->foreignId('site_id')->constrained('sites')->onDelete('cascade');

            // Identification
            $table->date('duree_de');
            $table->date('duree_a');
            $table->text('description');
            $table->string('analyse_par');
            $table->date('date_analyse');
            $table->string('demandeur');
            $table->string('contractant');

            // Dangers + équipements → JSON pour flexibilité
            $table->json('excavation_est')->nullable();
            $table->json('conduites')->nullable();
            $table->json('situations')->nullable();
            $table->string('situation_autre')->nullable();
            $table->boolean('danger_aucun')->default(false);

            // EPI
            $table->boolean('epi_sans_additionnel')->default(false);
            $table->json('epi_simples')->nullable();
            $table->string('epi_autre')->nullable();

            // Équipements de protection
            $table->boolean('equip_non_requis')->default(false);
            $table->json('equip_checks')->nullable();
            $table->string('equip_autre')->nullable();

            // Commentaires
            $table->boolean('aucun_commentaire')->default(false);
            $table->text('commentaires')->nullable();
            $table->string('proprietaire_nom');
            $table->string('proprietaire_signature')->nullable();
            $table->date('proprietaire_date')->nullable();

            // Signatures Contractant
            $table->string('sig_resp_construction_nom');
            $table->date('sig_resp_construction_date');
            $table->string('sig_resp_construction_file')->nullable();

            $table->string('sig_resp_hse_nom');
            $table->date('sig_resp_hse_date');
            $table->string('sig_resp_hse_file')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('permis_excavations');
    }
};
