<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class Contract extends Model
{
    protected $fillable = [
        'salary',
        'start_date',
        'end_date',
        'type',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    final public function shifts(): HasMany
    {
        return $this->hasMany(Shift::class,"contract_id", "id");
    }

    final public function employee(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, "employee_assignments");
    }

    final public function shops(): BelongsToMany
    {
        return $this->belongsToMany(Shop::class, "employee_assignments");
    }
}
