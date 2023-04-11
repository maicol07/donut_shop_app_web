<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'vat_number',
        'name',
    ];

    protected $primaryKey = 'vat_number';
    protected $keyType = 'string';
}
