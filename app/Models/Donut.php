<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donut extends Model
{
    protected $fillable = [
        'name',
        'price',
        'description',
    ];
}
