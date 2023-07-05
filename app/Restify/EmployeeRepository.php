<?php

namespace App\Restify;

use App\Models\Employee;
use Binaryk\LaravelRestify\Fields\BelongsToMany;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class EmployeeRepository extends Repository
{
    public static string $model = Employee::class;


    public function fields(RestifyRequest $request): array
    {
        return [
            field('fiscal_code')->label('fiscalCode')->required()->rules('string')->storingRules('unique:employees,fiscal_code'),
            field('first_name')->label('firstName')->required()->rules('string'),
            field('last_name')->label('lastName')->required()->rules('string'),
            field('email')->required()->rules('email'),
            field('phone')->required()->rules('string'),
            field('job')->required()->rules('string'),
            field('birth_date')->label('birthDate')->required()->rules('date'),
            field('street')->required()->rules('string'),
            field('house_number')->label('houseNumber')->required()->rules('string'),
            field('zip')->required()->rules('string'),
            field('city')->required()->rules('string'),
            field('state')->required()->rules('string'),
            field('province')->required()->rules('string'),
            field('created_at')->label('createdAt')->readonly(),
            field('updated_at')->label('updatedAt')->readonly(),
        ];
    }

    public static function related(): array
    {
        return [
            BelongsToMany::make('contracts')->withPivot(
                field('created_at')->label('createdAt')->readonly(),
                field('updated_at')->label('updatedAt')->readonly()
            ),
            BelongsToMany::make('shops')
        ];
    }
}
