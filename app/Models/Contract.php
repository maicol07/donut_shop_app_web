<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contract extends Model
{
    protected $fillable = [
        'salary',
        'start_date',
        'end_date',
        'type',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    final public function shifts(): HasMany
    {
        return $this->hasMany(Shift::class, 'contract_id', 'id');
    }

    final public function employee(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'employee_assignments', relatedPivotKey: 'fiscal_code', relatedKey: 'fiscal_code');
    }

    final public function shops(): BelongsToMany
    {
        return $this->belongsToMany(Shop::class, 'employee_assignments');
    }
}
