<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShopSale extends Model
{
    final public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }
}
