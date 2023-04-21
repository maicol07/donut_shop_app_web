<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ingredient extends Model
{
    protected $fillable = [
        'name',
        'allergen',
    ];

    protected $casts = [
        "allergen" => "bool",
    ];

    final public function donuts(): BelongsToMany
    {
        return $this->belongsToMany(Donut::class, "compositions")
            ->withPivot("absolute_quantity")
            ->withTimestamps();
    }

    final public function warehouses(): BelongsToMany
    {
        return $this->belongsToMany(Warehouse::class, "storages")
            ->withPivot("quantity")
            ->withTimestamps();
    }
}
