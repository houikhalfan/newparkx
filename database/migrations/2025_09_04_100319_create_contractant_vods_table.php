<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('contractant_vods', function (Blueprint $table) {
            $table->bigIncrements('id');

            // Who created the VOD (contractor account)
            $table->unsignedBigInteger('contractor_id')->index();

            // Dates & helpers (kept similar to your current table)
            $table->date('date')->index();
            $table->smallInteger('due_year')->nullable()->unsigned();
            $table->tinyInteger('due_month')->nullable()->unsigned();
            $table->tinyInteger('week_of_year')->nullable()->unsigned();
            $table->timestamp('completed_at')->nullable();

            // Danger quick flags
            $table->boolean('has_danger')->default(false);
            $table->smallInteger('danger_count')->default(0)->unsigned();

            // Optional breakdown object (JSON)
            $table->longText('risk_breakdown')->nullable();     // json

            // Files
            $table->string('pdf_path', 512)->nullable();
            $table->string('thumb_path', 512)->nullable();

            // Header
            $table->string('projet', 255);
            $table->string('activite', 255);
            $table->string('observateur', 255)->nullable();

            // Big JSON blobs
            $table->longText('personnes_observees')->nullable(); // json
            $table->longText('entreprise_observee')->nullable(); // json
            $table->longText('pratiques')->nullable();           // json [{text, photo_path}]
            $table->longText('comportements')->nullable();       // json [{type, description, photo_path}]
            $table->longText('conditions')->nullable();          // json { label: true }
            $table->longText('correctives')->nullable();         // json { label: {action, responsable, statut, photo_path} }

            $table->timestamps();

            // Optional FK (uncomment if you have contractors table)
            // $table->foreign('contractor_id')->references('id')->on('contractors')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contractant_vods');
    }
};
