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
        Schema::create('ppe_requests', function (Blueprint $table) {
            $table->id();
            $table->string('nom_prenom'); // Nom et prénom
            $table->date('date_demande'); // Date de demande
            $table->json('liste_epi'); // Liste des EPIs demandés
            $table->json('quantites'); // Quantités pour chaque EPI
            $table->json('tailles'); // Tailles pour chaque EPI (S, M, L, XL, XXL, XXXL)
            $table->json('pointures'); // Pointures pour chaussures (37-45)
            $table->enum('etat', ['en_cours', 'en_traitement', 'done', 'rejected'])->default('en_cours');
            $table->text('commentaires_admin')->nullable(); // Commentaires de l'admin
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // User qui fait la demande
            $table->foreignId('admin_id')->nullable()->constrained('admins')->onDelete('set null'); // Admin qui traite
            $table->timestamps();

            // Indexes for better performance
            $table->index('user_id');
            $table->index('admin_id');
            $table->index('etat');
            $table->index('date_demande');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppe_requests');
    }
};