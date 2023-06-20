<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
    protected $primaryKey = 'fiscal_code';

    final public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, ownerKey: "vat_number");
    }
}
