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

        // Crear 14 usuarios comunes adicionales (Clientes)
        User::factory(14)->create(['role_id' => 2]);
    }
}