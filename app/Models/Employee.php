<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Employee extends Model
{
    protected $fillable = [
        'fiscal_code',
        'first_name',
        'last_name',
        'email',
        'phone',
        'job',
        'birth_date',
        'street',
        'house_number',
        'city',
        'state',
        'zip',
        'province',
    ];

    protected $casts = [
        'birth_date' => 'datetime',
    ];

    final public function contracts(): BelongsToMany
    {
        return $this->belongsToMany(Contract::class, "employee_assignments")
            ->withPivot("quantity", "percentage_discount")
            ->withTimestamps();
    }

    final public function shops(): BelongsToMany
    {
        return $this->belongsToMany(Shop::class, "employee_assignments");
    }
}
