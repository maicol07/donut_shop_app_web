<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model
{
    protected $fillable = [
        'username',
        'fiscal_code',
        'password',
    ];

    protected $primaryKey = "username";
    protected $keyType = 'string';

    final public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, "fiscal_code");
    }
    final public function onlineSales(): HasMany
    {
        return $this->hasMany(OnlineSale::class);
    }
}
