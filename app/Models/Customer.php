<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'surname',
        'fiscal_code',
        'birth_date',
        'street',
        'house_number',
        'cap',
        'city',
        'province',
        'email',
        'vat_number',
    ];

    protected $casts = [
        'birth_date' => 'datetime',
    ];
}
