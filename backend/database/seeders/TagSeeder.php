<?php

namespace Database\Seeders;

use App\Models\Document;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear 15 tags
        $tags = Tag::factory(15)->create();

        // Obtener todos los documentos
        $documents = Document::all();

        // Asignar entre 1 y 3 tags aleatorias a cada documento
        foreach ($documents as $document) {
            $document->tags()->attach(
                $tags->random(rand(1, 3))->pluck('id')->toArray()
            );
        }
    }
}