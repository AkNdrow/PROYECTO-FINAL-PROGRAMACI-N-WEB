<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role; // Si usan tabla de roles separada
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Usuario Administrador
        User::create([
            'name' => 'Administrador Sistema',
            'email' => 'admin@clevernote.com',
            'password' => Hash::make('Admin#2026!'),
            'role_id' => 1, // o 'role' => 'admin' según cómo manejen la columna
            'email_verified_at' => now(),
        ]);

        // 2. Usuario Cliente / Estándar
        User::create([
            'name' => 'Usuario Cliente',
            'email' => 'cliente@clevernote.com',
            'password' => Hash::make('Cliente#2026!'),
            'role_id' => 2, // o 'role' => 'user'
            'email_verified_at' => now(),
        ]);

        // 3. Usuario Developer / Editor (Tercer rol requerido)
        User::create([
            'name' => 'Usuario Developer',
            'email' => 'dev@clevernote.com',
            'password' => Hash::make('Developer#2026!'),
            'role_id' => 3, // o 'role' => 'editor' / 'developer'
            'email_verified_at' => now(),
        ]);
    }
}