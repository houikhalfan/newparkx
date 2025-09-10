<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Admin;
use App\Models\Contractor;
use App\Models\Site;

class InitialDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create initial sites
        $sites = [
            ['name' => 'Site Principal', 'responsible_user_id' => null],
            ['name' => 'Site Nord', 'responsible_user_id' => null],
            ['name' => 'Site Sud', 'responsible_user_id' => null],
        ];

        foreach ($sites as $siteData) {
            Site::firstOrCreate(['name' => $siteData['name']], $siteData);
        }

        // Create admin user
        $admin = Admin::firstOrCreate(
            ['email' => 'admin@parkx.com'],
            ['password' => Hash::make('password123')]
        );

        // Create a ParkX user (employee)
        $user = User::firstOrCreate(
            ['email' => 'john@parkx.com'],
            [
                'name' => 'John Doe',
                'password' => Hash::make('password123'),
                'vods_quota' => 5,
                'site_id' => 1, // Assign to first site
            ]
        );

        // Update the first site to have this user as responsible
        Site::where('id', 1)->update(['responsible_user_id' => $user->id]);

        // Create a contractor
        $contractor = Contractor::firstOrCreate(
            ['email' => 'contractor@abc.com'],
            [
                'name' => 'Entreprise ABC',
                'password' => Hash::make('password123'),
                'phone' => '+212 6 12 34 56 78',
                'company_name' => 'ABC Construction',
                'role' => 'Manager',
                'is_approved' => true,
            ]
        );

        // Create another contractor (pending approval)
        $pendingContractor = Contractor::firstOrCreate(
            ['email' => 'pending@xyz.com'],
            [
                'name' => 'XYZ Corp',
                'password' => Hash::make('password123'),
                'phone' => '+212 6 98 76 54 32',
                'company_name' => 'XYZ Corporation',
                'role' => 'Supervisor',
                'is_approved' => false,
            ]
        );

        $this->command->info('Initial data created successfully!');
        $this->command->info('Admin: admin@parkx.com / password123');
        $this->command->info('User: john@parkx.com / password123');
        $this->command->info('Contractor: contractor@abc.com / password123');
        $this->command->info('Pending Contractor: pending@xyz.com / password123');
    }
}