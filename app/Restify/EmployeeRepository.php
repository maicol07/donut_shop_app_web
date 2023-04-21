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
            field('fiscal_code')->required()->rules('string')->storingRules('unique:employees,fiscal_code'),
            field('first_name')->required()->rules('string'),
            field('last_name')->required()->rules('string'),
            field('email')->required()->rules('email'),
            field('phone')->required()->rules('string'),
            field('job')->required()->rules('string'),
            field('birth_date')->required()->rules('date'),
            field('street')->required()->rules('string'),
            field('house_number')->required()->rules('string'),
            field('zip')->required()->rules('string'),
            field('city')->required()->rules('string'),
            field('state')->required()->rules('string'),
            field('province')->required()->rules('string'),
            field('created_at')->readonly(),
            field('updated_at')->readonly(),
        ];
    }

    public static function related(): array
    {
        return [
            BelongsToMany::make('contracts')->withPivot(
                field('created_at')->readonly(),
                field('updated_at')->readonly()
            ),
            BelongsToMany::make('shops')
        ];
    }
}
