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

        // Crear 14 usuarios comunes (Clientes)
        User::factory(14)->create(['role_id' => 2]);
    }
}