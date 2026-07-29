<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear 15 tags
        $tags = \App\Models\Tag::factory(15)->create();

        // Obtener todos los documentos
        $documents = \App\Models\Document::all();

        // Asignar entre 1 y 3 tags aleatorias a cada documento
        foreach ($documents as $document) {
            $document->tags()->attach(
                $tags->random(rand(1, 3))->pluck('id')->toArray()
            );
        }
    }
}
