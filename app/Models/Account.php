<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
}
