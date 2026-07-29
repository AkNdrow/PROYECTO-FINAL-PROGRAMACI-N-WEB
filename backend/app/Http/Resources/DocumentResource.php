<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titulo' => $this->title,
            'contenido' => $this->content,
            'tipo' => $this->type,
            'estado' => $this->status,
            'autor' => $this->user->name ?? 'Desconocido',
            'etiquetas' => $this->tags->pluck('name'), // Array plano de nombres de etiquetas
            'fecha_creacion' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
