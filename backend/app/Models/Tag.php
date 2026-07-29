<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

<<<<<<< HEAD
    protected $fillable = [
        'name',
    ];
=======
    protected $fillable = ['name', 'color'];
>>>>>>> 51aec2169b32c88001655d4f869b94ffa3f06aa9

    public function documents()
    {
        return $this->belongsToMany(Document::class);
    }
}