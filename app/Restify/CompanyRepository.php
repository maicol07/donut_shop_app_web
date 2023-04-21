<?php

namespace App\Restify;

use App\Models\Company;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class CompanyRepository extends Repository
{
    public static string $model = Company::class;
    public static string $id = 'vat_number';
    public static string $keyType = 'string';

    public function fields(RestifyRequest $request): array
    {
        return [
            field('name')->required(),
            field('vat_number')->required()->rules('string')->storingRules('unique:companies,vat_number'),
            field("created_at")->readonly(),
            field("updated_at")->readonly(),
        ];
    }
}
