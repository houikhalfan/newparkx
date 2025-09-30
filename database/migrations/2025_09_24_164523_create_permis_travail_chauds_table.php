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
        Schema::create('permis_travail_chauds', function (Blueprint $table) {
            $table->id();
            
            // Header and identification
            $table->string('numero_permis')->unique();
            $table->enum('status', ['en_attente', 'en_cours', 'rejete', 'signe'])->default('en_attente');
            
            // Site and contractant relations
            $table->foreignId('site_id')->constrained()->onDelete('cascade');
            $table->foreignId('contractant_id')->constrained('contractors')->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            
            // Identification section
            $table->text('description_tache');
            $table->string('plan_securitaire_par');
            $table->string('contractant_demandeur');
            $table->string('contractant_travail');
            $table->boolean('meme_que_demandeur')->default(true);
            
            // Type d'activité (stored as JSON arrays)
            $table->json('activites');
            $table->string('activite_autre')->nullable();
            
            // Dangers particuliers
            $table->json('dangers');
            $table->string('danger_autre')->nullable();
            
            // Équipement de protection personnelle
            $table->json('protection_physique');
            $table->string('protection_physique_autre')->nullable();
            $table->json('protection_respiratoire');
            
            // Équipement de protection (tableau)
            $table->json('protection_incendie');
            $table->string('protection_incendie_autre')->nullable();
            $table->json('equipement_inspection');
            $table->json('permis_requis');
            $table->json('surveillance_requise');
            
            // Commentaires
            $table->text('commentaires')->nullable();
            $table->boolean('aucun_commentaire')->default(false);
            
            // Signatures contractant
            $table->string('resp_construction_nom');
            $table->date('resp_construction_date');
            $table->string('resp_construction_signature')->nullable(); // File path for signature
            
            $table->string('resp_hse_nom');
            $table->date('resp_hse_date');
            $table->string('resp_hse_signature')->nullable(); // File path for signature
            
            // Signatures ParkX (to be filled later by ParkX staff)
            $table->string('cm_parkx_nom')->nullable();
            $table->date('cm_parkx_date')->nullable();
            $table->string('cm_parkx_signature')->nullable();
            
            $table->string('hse_parkx_nom')->nullable();
            $table->date('hse_parkx_date')->nullable();
            $table->string('hse_parkx_signature')->nullable();
            
            // Timestamps for workflow
            $table->timestamp('soumis_le')->nullable();
            $table->timestamp('approuve_le')->nullable();
            $table->timestamp('ferme_le')->nullable();
            
            $table->timestamps();
            
            // Indexes for better performance
            $table->index('numero_permis');
            $table->index('status');
            $table->index('site_id');
            $table->index('contractant_id');
            $table->index('created_by');
            $table->index('soumis_le');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permis_travail_chauds');
    }
};