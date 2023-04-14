<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Discount extends Model
{
    protected $fillable = [
        'discount_name',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    final public function donut(): BelongsToMany
    {
        return $this->belongsToMany(Donut::class, "tariffs")
            ->withPivot("quantity", "percentage_discount")
            ->withTimestamps();
    }
}
