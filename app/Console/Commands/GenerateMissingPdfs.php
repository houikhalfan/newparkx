<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PermisExcavation;
use Illuminate\Support\Facades\Storage;
use PDF; // make sure you have barryvdh/laravel-dompdf installed

class GenerateMissingPdfs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permits:generate-missing-pdfs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate PDFs for already signed permits that are missing them';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $permits = PermisExcavation::where('status', 'signe')
            ->whereNull('pdf_signed')
            ->get();

        if ($permits->isEmpty()) {
            $this->info("✅ No missing PDFs found.");
            return;
        }

        foreach ($permits as $permis) {
            // ⚡ generate PDF using a blade template
            $pdf = PDF::loadView('pdf.permis', ['permis' => $permis]);

            $path = 'permits_pdfs/permis-'.$permis->id.'.pdf';
            Storage::disk('public')->put($path, $pdf->output());

            $permis->update(['pdf_signed' => $path]);

            $this->info("📄 PDF generated for permit ID {$permis->id}");
        }

        $this->info("🎉 All missing PDFs generated successfully!");
    }
}
