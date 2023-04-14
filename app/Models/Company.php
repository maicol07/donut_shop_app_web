<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Company extends Model
{
    protected $fillable = [
        'vat_number',
        'name',
    ];

    protected $primaryKey = 'vat_number';
    protected $keyType = 'string';

    final public function supplies(): HasMany
    {
        return $this->hasMany(Supply::class, "company_vat_number");
    }

    final public function customer(): HasOne
    {
        return $this->hasOne(Customer::class, "company_vat_number");
    }
}
