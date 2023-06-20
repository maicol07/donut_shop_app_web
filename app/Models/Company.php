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
    public $incrementing = false;

    final public function supplies(): HasMany
    {
        return $this->hasMany(Supply::class, "vat_number");
    }

    final public function customers(): HasMany
    {
        return $this->hasMany(Customer::class, "vat_number");
    }
}
