<?php

namespace App\Restify;

use App\Models\Customer;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class CustomerRepository extends Repository
{
    public static string $model = Customer::class;

    public static string $id = 'fiscal_code';
    public static string $keyType = 'string';

    public function fields(RestifyRequest $request): array
    {
        return [
            field('name')->required()->rules('string'),
            field('surname')->required()->rules('string'),
            field('fiscal_code')->required()->rules('string')->storingRules('unique:customers,fiscal_code'),
            field('birth_date')->required()->rules('date'),
            field('street')->required()->rules('string'),
            field('house_number')->required()->rules('string'),
            field('cap')->required()->rules('string'),
            field('city')->required()->rules('string'),
            field('province')->required()->rules('string'),
            field('email')->required()->rules('email'),
            field("created_at")->readonly(),
            field("updated_at")->readonly()
        ];
    }
}
