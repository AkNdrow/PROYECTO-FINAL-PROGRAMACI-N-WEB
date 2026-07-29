<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear Admin
        \App\Models\User::firstOrCreate(
            ['email' => 'admin@clevernote.com'],
            [
                'name' => 'Administrador',
                'password' => \Illuminate\Support\Facades\Hash::make('AdminClever1!'),
                'role_id' => 1, // Administrador
                'email_verified_at' => now(),
            ]
        );

        // Crear 14 usuarios comunes (Clientes)
        \App\Models\User::factory(14)->create(['role_id' => 2]);
