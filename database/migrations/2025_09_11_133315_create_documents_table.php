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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('filename'); // System-generated filename
            $table->string('original_filename'); // User's original filename
            $table->string('file_path');
            $table->string('file_type'); // MIME type
            $table->bigInteger('file_size'); // File size in bytes
            $table->json('visibility')->default('["private"]'); // Array of visibility levels
            $table->foreignId('admin_id')->constrained('admins')->onDelete('cascade');
            $table->string('full_name'); // Admin's full name
            $table->json('meta')->nullable(); // Additional metadata
            $table->timestamps();

            // Indexes for better performance
            $table->index('admin_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};