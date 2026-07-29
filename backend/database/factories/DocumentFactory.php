<?php

namespace Database\Factories;

use App\Models\Document;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Document>
 */
class DocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(), // Crea un usuario si no se le pasa
            'title' => fake()->sentence(4),
            'content' => fake()->paragraphs(3, true),
            'type' => fake()->randomElement(['markdown', 'html', 'txt']),
            'status' => fake()->randomElement(['Pendiente', 'En proceso', 'Completado']),
        ];
    }
}
