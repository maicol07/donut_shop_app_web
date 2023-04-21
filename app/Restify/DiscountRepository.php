<?php

namespace App\Restify;

use App\Models\Discount;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class DiscountRepository extends Repository
{
    public static string $model = Discount::class;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('discount_name')->required()->rules('string'),
            field('start_date')->required()->rules('date'),
            field('end_date')->required()->rules('date'),
            field('created_at')->readonly(),
            field('updated_at')->readonly(),
        ];
    }
}
