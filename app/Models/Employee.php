<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'fiscal_code',
        'first_name',
        'last_name',
        'email',
        'phone',
        'job',
        'birth_date',
        'street',
        'house_number',
        'city',
        'state',
        'zip',
        'province',
    ];

    protected $casts = [
        'birth_date' => 'datetime',
    ];
}
