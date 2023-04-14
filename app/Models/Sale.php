<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sale extends Model
{
    protected $fillable = [
        'date',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    final public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    final public function supply(): BelongsTo
    {
        return $this->belongsTo(Supply::class);
    }
}
