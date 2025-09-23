<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('permis_travail_securitaire', function (Blueprint $table) {
            $table->id();
            
            // IDENTIFICATION
            $table->foreignId('site_id')->constrained('sites')->onDelete('cascade');
            $table->date('duree_de');
            $table->date('duree_a');
            $table->text('description');
            $table->string('plan_securitaire_par');
            $table->date('date_analyse');
            $table->string('demandeur');
            $table->string('contractant');
            $table->boolean('meme_que_demandeur')->default(false);
            
            // TYPE D'ACTIVITÉ
            $table->json('activites')->nullable();
            $table->string('activite_autre')->nullable();
            
            // PERMIS SUPPLÉMENTAIRES
            $table->json('permis_supp')->nullable();
            
            // DANGERS PARTICULIERS
            $table->json('dangers')->nullable();
            $table->string('danger_autre')->nullable();
            
            // ÉQUIPEMENT DE PROTECTION PERSONNELLE
            $table->boolean('epi_sans_additionnel')->default(false);
            $table->json('epi_chimique')->nullable();
            $table->json('epi_respiratoire')->nullable();
            
            // ÉQUIPEMENT DE PROTECTION
            $table->json('equip_comms')->nullable();
            $table->json('equip_barrieres')->nullable();
            $table->json('equip_qualite_air')->nullable();
            $table->json('equip_etincelles')->nullable();
            
            // COMMENTAIRES
            $table->text('commentaires');
            
            // CONFIRMATIONS
            $table->boolean('confirmation_travail')->default(false);
            $table->boolean('confirmation_conditions')->default(false);
            $table->boolean('confirmation_equipement')->default(false);
            $table->boolean('confirmation_epi')->default(false);
            
            // SIGNATURES CONTRACTANT
            $table->string('sig_resp_construction_nom');
            $table->date('sig_resp_construction_date');
            $table->string('sig_resp_construction_file')->nullable();
            
            $table->string('sig_resp_hse_nom');
            $table->date('sig_resp_hse_date');
            $table->string('sig_resp_hse_file')->nullable();
            
            // SIGNATURES PARKX (approbations)
            $table->string('cm_parkx_nom')->nullable();
            $table->date('cm_parkx_date')->nullable();
            $table->string('cm_parkx_file')->nullable();
            
            $table->string('hse_parkx_nom')->nullable();
            $table->date('hse_parkx_date')->nullable();
            $table->string('hse_parkx_file')->nullable();
            
            // FERMETURE DU PERMIS
            $table->boolean('fermeture_q1')->nullable();
            $table->boolean('fermeture_q2')->nullable();
            $table->boolean('fermeture_q3')->nullable();
            $table->text('fermeture_suivi')->nullable();
            
            // STATUT ET MÉTADONNÉES
            $table->enum('statut', ['brouillon', 'soumis', 'approuve', 'rejete', 'ferme'])->default('brouillon');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamp('soumis_le')->nullable();
            $table->timestamp('approuve_le')->nullable();
            $table->timestamp('ferme_le')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permis_travail_securitaire');
    }
};