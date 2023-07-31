<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Donut extends Model
{
    protected $fillable = [
        'name',
        'price',
        'description',
    ];

    final public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'compositions', 'donut_id', 'ingredient_id')//TODO keys could be wrong
            ->withPivot('absolute_quantity');
    }

    final public function discounts(): BelongsToMany
    {
        return $this->belongsToMany(Discount::class, 'tariffs')
            ->withPivot('quantity', 'percentage_discount');
    }

    final public function availability(): BelongsToMany
    {
        return $this->belongsToMany(Shop::class, 'availabilities')
            ->withPivot('quantity');
    }

    final public function sales(): BelongsToMany
    {
        return $this->belongsToMany(Sale::class, 'purchases')
            ->withPivot('quantity');
    }

    final public function tariffs(): HasMany
    {
        return $this->hasMany(Tariff::class);
    }
}
