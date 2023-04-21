<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OnlineSale extends Model
{
    protected $fillable = [
        'type',
        'username',
    ];

    final public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'username');
    }

    final public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }
}
