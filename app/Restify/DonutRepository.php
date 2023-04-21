<?php

namespace App\Restify;

use App\Models\Donut;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class DonutRepository extends Repository
{
    public static string $model = Donut::class;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('name')->required()->rules('string'),
            field('price')->required()->rules('numeric'),
            field('description')->required()->rules('string'),
            field('created_at')->readonly(),
            field('updated_at')->readonly(),
        ];
    }
}
