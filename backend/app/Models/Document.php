<?php

namespace App\Models;

<<<<<<< HEAD
use Illuminate\Database\Eloquent\Factories\HasFactory; // 👈 Importar esta línea
=======
use Illuminate\Database\Eloquent\Factories\HasFactory;
>>>>>>> 51aec2169b32c88001655d4f869b94ffa3f06aa9
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
<<<<<<< HEAD
    use HasFactory; // 👈 Agregar este trait dentro de la clase

    protected $fillable = [
        'title',
        'content',
        'user_id',
    ];
=======
    use HasFactory;

    protected $fillable = ['user_id', 'title', 'content', 'type', 'status'];
>>>>>>> 51aec2169b32c88001655d4f869b94ffa3f06aa9

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}