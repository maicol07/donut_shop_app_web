<?php

namespace App\Restify;

use App\Models\Donut;
use Binaryk\LaravelRestify\Fields\BelongsToMany;
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

    public static function related(): array
    {
        return [
            BelongsToMany::make('ingredients')->withPivot(
                field('absolute_quantity')->required()->rules('numeric')
            ),
            BelongsToMany::make('discounts')->withPivot(
                field('quantity')->required()->rules('numeric'),
                field('percentage_discount')->required()->rules('numeric')
            ),
            BelongsToMany::make('availability', ShopRepository::class)->withPivot(
                field('quantity')->required()->rules('numeric')
            ),
        ];
    }
}
