<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario Administrador
        User::firstOrCreate(
            ['email' => 'admin@clevernote.com'],
            [
                'name' => 'Admin CleverNote',
                'password' => Hash::make('Admin123!'),
                'email_verified_at' => now(),
                'role_id' => 1,
            ]
        );
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Administrador (Rol 1)
        User::create([
            'name' => 'Admin CleverNote',
            'email' => 'admin@clevernote.com',
            'password' => Hash::make('Admin#2026!'),
            'role_id' => 1,
        ]);

        // 2. Cliente / Estándar (Rol 2)
        User::create([
            'name' => 'Cliente Prueba',
            'email' => 'cliente@clevernote.com',
            'password' => Hash::make('Cliente#2026!'),
            'role_id' => 2,
        ]);

        // 3. Developer / Editor (Rol 3)
        User::create([
            'name' => 'Developer Prueba',
            'email' => 'dev@clevernote.com',
            'password' => Hash::make('Developer#2026!'),
            'role_id' => 3,
        ]);
    

        // Crear 14 usuarios comunes (Clientes)
        User::factory(14)->create(['role_id' => 2]);
        \App\Models\User::factory(14)->create(['role_id' => 2]);
    }
}