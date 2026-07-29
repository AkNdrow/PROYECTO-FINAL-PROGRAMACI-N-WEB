<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // 👈 Importar esta línea
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory; // 👈 Agregar este trait dentro de la clase

    protected $fillable = [
        'title',
        'content',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}