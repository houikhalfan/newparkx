<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a default admin user
        Admin::updateOrCreate(
            ['email' => 'admin@parkx.com'],
            [
                'email' => 'admin@parkx.com',
                'password' => Hash::make('admin123'),
            ]
        );
        
        echo "Admin user created: admin@parkx.com / admin123\n";
    }
}
