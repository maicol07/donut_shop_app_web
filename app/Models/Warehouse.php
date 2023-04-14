<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Warehouse extends Model
{
    protected $fillable = [
        'name',
        'address',
    ];

    // Shops
    final public function shops(): BelongsToMany
    {
        return $this->belongsToMany(Shop::class, 'stocks')
            ->withTimestamps();
    }

    // Ingredients
    final public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'storages')
            ->withPivot(['quantity'])
            ->withTimestamps();
    }
}
