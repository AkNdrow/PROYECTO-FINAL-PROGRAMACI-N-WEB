<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener usuarios, exceptuando al admin principal si existe
        $users = \App\Models\User::where('role_id', '!=', 1)->get();
        
        if ($users->count() === 0) {
            $users = \App\Models\User::factory(5)->create(['role_id' => 2]);
        }

        foreach ($users as $user) {
            \App\Models\Document::factory(rand(2, 4))->create(['user_id' => $user->id]);
        }
    }
}