<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Supply extends Model
{
    protected $fillable = [
        'order_number',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    // Company
    final public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_vat_number', 'vat_number');
    }

    // Daily reservation
    final public function donuts(): BelongsToMany
    {
        return $this->belongsToMany(Donut::class, 'daily_reservations', 'supply_id', 'donut_id')
            ->withPivot('quantity')
            ->withTimestamps();
    }
}
