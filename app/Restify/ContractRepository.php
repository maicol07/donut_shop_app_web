<?php

namespace App\Restify;

use App\Models\Contract;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class ContractRepository extends Repository
{
    public static string $model = Contract::class;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('salary')->required()->rules('numeric'),
            field('start_date')->required()->rules('date'),
            field('end_date')->required()->rules('date'),
            field('type')->required()->rules('string'),
            field("created_at")->readonly(),
            field("updated_at")->readonly()
        ];
    }
}
