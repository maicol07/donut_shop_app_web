<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Shop extends Model
{
    protected $fillable = [
        'address',
    ];

    final public function employees(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'employee_assignments', relatedPivotKey: 'fiscal_code')->withTimestamps();
    }

    // Contract
    // TODO: Check this
    final public function contracts(): BelongsToMany
    {
        return $this->belongsToMany(Contract::class, 'employee_assignments')->withPivot(['start_date', 'end_date'])->withTimestamps();
    }

    // Availabilities
    final public function availabilities(): BelongsToMany
    {
        return $this->belongsToMany(Donut::class, 'availabilities')->withPivot(['quantity'])->withTimestamps();
    }

    // Warehouse
    final public function warehouse(): BelongsToMany
    {
        return $this->belongsToMany(Warehouse::class, 'stocks')->withPivot(['quantity'])->withTimestamps();
    }
}
